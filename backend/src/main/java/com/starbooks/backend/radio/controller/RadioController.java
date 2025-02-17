package com.starbooks.backend.radio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@RequestMapping("/api/radio")
@RestController
public class RadioController {

    @Value("${livekit.api.key}")
    private String LIVEKIT_REMOVED;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public RadioController(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    private String generateSessionId() {
        return UUID.randomUUID().toString();
    }

    private void saveUserSession(String userId, String sessionId, String token, String role, String roomName) {
        try {
            Map<String, String> sessionInfo = new HashMap<>();
            sessionInfo.put("sessionId", sessionId);
            sessionInfo.put("token", token);
            sessionInfo.put("role", role);
            sessionInfo.put("roomName", roomName);

            String sessionKey = String.format("user:sessions:%s", sessionId);
            String userKey = String.format("user:%s:currentSession", userId);

            // 세션 정보 저장
            redisTemplate.opsForValue().set(
                    sessionKey,
                    objectMapper.writeValueAsString(sessionInfo),
                    Duration.ofHours(6)
            );

            // 현재 사용자의 활성 세션 ID 저장
            redisTemplate.opsForValue().set(
                    userKey,
                    sessionId,
                    Duration.ofHours(6)
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to save session", e);
        }
    }

    private Map<String, String> getUserSession(String sessionId) {
        try {
            String sessionKey = String.format("user:sessions:%s", sessionId);
            String sessionJson = redisTemplate.opsForValue().get(sessionKey);

            if (sessionJson == null) {
                return null;
            }

            return objectMapper.readValue(sessionJson, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get session", e);
        }
    }

    @PostMapping(value = "/getRole")
    public ResponseEntity<Map<String, String>> getRole(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");
        String sessionId = params.get("sessionId");

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        // 세션이 있으면 해당 세션의 role 반환
        if (sessionId != null) {
            Map<String, String> session = getUserSession(sessionId);
            if (session != null && roomName.equals(session.get("roomName"))) {
                return ResponseEntity.ok(Map.of("role", session.get("role")));
            }
        }

        // Redis에서 호스트 정보 가져오기
        String existingHost = redisTemplate.opsForValue().get("room:" + roomName + ":host");
        if (existingHost != null && existingHost.equals(participantName)) {
            return ResponseEntity.ok(Map.of("role", "host"));
        }

        // 방의 상태 확인
        String status = redisTemplate.opsForValue().get("room:" + roomName + ":status");
        if (status == null || !status.equals("live")) {
            return ResponseEntity.ok(Map.of("role", "guest"));
        }

        return ResponseEntity.ok(Map.of("role", "guest"));
    }

    @PostMapping(value = "/token")
    public ResponseEntity<Map<String, String>> createToken(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");
        String previousSessionId = params.get("sessionId");

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        // 이전 세션 확인
        if (previousSessionId != null) {
            Map<String, String> session = getUserSession(previousSessionId);
            if (session != null && session.get("token") != null) {
                return ResponseEntity.ok(Map.of(
                        "token", session.get("token"),
                        "role", session.get("role"),
                        "sessionId", previousSessionId
                ));
            }
        }

        // 기존 호스트 확인
        String existingHost = redisTemplate.opsForValue().get("room:" + roomName + ":host");
        boolean isHost = (existingHost == null || existingHost.equals(participantName));

        if (isHost) {
            redisTemplate.opsForValue().set("room:" + roomName + ":host", participantName, Duration.ofHours(6));
            redisTemplate.opsForValue().set("room:" + roomName + ":status", "live", Duration.ofHours(6));
            redisTemplate.opsForValue().set("room:" + roomName + ":participants", "0", Duration.ofHours(6));
        }

        // LiveKit 토큰 생성
        AccessToken token = new AccessToken(LIVEKIT_REMOVED, LIVEKIT_API_SECRET);
        token.setName(participantName);
        token.setIdentity(participantName);
        token.addGrants(new RoomJoin(true), new RoomName(roomName));
        token.setMetadata("{\"role\":\"" + (isHost ? "host" : "guest") + "\"}");
        token.setTtl(Duration.ofHours(6).toSeconds());

        String newSessionId = generateSessionId();
        String generatedToken = token.toJwt();

        // 새 세션 저장
        saveUserSession(
                participantName,
                newSessionId,
                generatedToken,
                isHost ? "host" : "guest",
                roomName
        );

        return ResponseEntity.ok(Map.of(
                "token", generatedToken,
                "role", isHost ? "host" : "guest",
                "sessionId", newSessionId
        ));
    }

    @PostMapping(value = "/endBroadcast")
    public ResponseEntity<Map<String, String>> endBroadcast(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");
        String sessionId = params.get("sessionId");

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        // 세션 확인
        if (sessionId != null) {
            Map<String, String> session = getUserSession(sessionId);
            if (session == null || !"host".equals(session.get("role"))) {
                return ResponseEntity.status(403).body(Map.of("errorMessage", "Invalid session or not a host"));
            }
        }

        // 호스트 확인
        String existingHost = redisTemplate.opsForValue().get("room:" + roomName + ":host");
        if (existingHost == null || !existingHost.equals(participantName)) {
            return ResponseEntity.status(403).body(Map.of("errorMessage", "Only the host can end the broadcast"));
        }

        // 방송 상태 삭제
        redisTemplate.delete("room:" + roomName + ":status");
        redisTemplate.delete("room:" + roomName + ":host");
        redisTemplate.delete("room:" + roomName + ":participants");

        // 세션 삭제
        if (sessionId != null) {
            redisTemplate.delete("user:sessions:" + sessionId);
            redisTemplate.delete("user:" + participantName + ":currentSession");
        }

        return ResponseEntity.ok(Map.of("message", "Broadcast ended successfully"));
    }

    @GetMapping(value = "/broadcastStatus")
    public ResponseEntity<Map<String, String>> getBroadcastStatus(@RequestParam String roomName) {
        String status = redisTemplate.opsForValue().get("room:" + roomName + ":status");
        return ResponseEntity.ok(Map.of("status", status != null ? "live" : "offline"));
    }

    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getLiveBroadcasts() {
        Set<String> keys = redisTemplate.keys("room:*:host");
        if (keys == null || keys.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Map<String, Object>> broadcasts = keys.stream()
                .map(key -> {
                    String roomName = key.split(":")[1];
                    String host = redisTemplate.opsForValue().get(key);
                    String participantsKey = "room:" + roomName + ":participants";
                    String participantCountStr = redisTemplate.opsForValue().get(participantsKey);
                    Integer participantCount = participantCountStr != null ? Integer.parseInt(participantCountStr) : 0;

                    Map<String, Object> broadcastInfo = new HashMap<>();
                    broadcastInfo.put("roomName", roomName);
                    broadcastInfo.put("host", host);
                    broadcastInfo.put("participantCount", participantCount);

                    return broadcastInfo;
                })
                .sorted((a, b) -> Integer.compare(
                        ((Integer) b.get("participantCount")),
                        ((Integer) a.get("participantCount"))
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(broadcasts);
    }

    @PostMapping("/updateParticipants")
    public ResponseEntity<Map<String, String>> updateParticipants(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String action = params.get("action");
        String sessionId = params.get("sessionId");

        if (roomName == null || action == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and action are required"));
        }

        // 세션 유효성 검사
        if (sessionId != null) {
            Map<String, String> session = getUserSession(sessionId);
            if (session == null || !roomName.equals(session.get("roomName"))) {
                return ResponseEntity.status(403).body(Map.of("errorMessage", "Invalid session"));
            }
        }

        String participantsKey = "room:" + roomName + ":participants";
        String currentCount = redisTemplate.opsForValue().get(participantsKey);

        if (currentCount == null) {
            redisTemplate.opsForValue().set(participantsKey, "0");
            currentCount = "0";
        }

        int count = Integer.parseInt(currentCount);
        if ("join".equals(action)) {
            count = Math.max(0, count + 1);
        } else if ("leave".equals(action)) {
            count = Math.max(0, count - 1);
        }

        redisTemplate.opsForValue().set(participantsKey, String.valueOf(count), Duration.ofHours(6));

        return ResponseEntity.ok(Map.of(
                "message", "Participant count updated",
                "count", String.valueOf(count)
        ));
    }
}