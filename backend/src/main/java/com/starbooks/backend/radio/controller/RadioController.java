package com.starbooks.backend.radio.controller;

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

    public RadioController(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 기존 역할 확인 API
     * - 프론트에서 먼저 호출하여 기존 호스트 여부 확인
     */
    @PostMapping(value = "/getRole")
    public ResponseEntity<Map<String, String>> getRole(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        // 기존 호스트 확인
        String existingHost = redisTemplate.opsForValue().get("room:" + roomName + ":host");
        if (existingHost != null && existingHost.equals(participantName)) {
            return ResponseEntity.ok(Map.of("role", "host"));
        }

        return ResponseEntity.ok(Map.of("role", "guest"));
    }

    /**
     * LiveKit 토큰 생성 API
     * - 기존 역할이 있으면 유지
     * - 첫 입장 시 호스트 지정
     */
    @PostMapping(value = "/token")
    public ResponseEntity<Map<String, String>> createToken(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        // 기존 호스트 확인
        String existingHost = redisTemplate.opsForValue().get("room:" + roomName + ":host");
        boolean isHost = (existingHost == null || existingHost.equals(participantName));

        if (isHost) {
            // 방의 첫 번째 참가자가 호스트가 됨
            redisTemplate.opsForValue().set("room:" + roomName + ":host", participantName, Duration.ofHours(6));

            // 방송 상태 저장
            redisTemplate.opsForValue().set("room:" + roomName + ":status", "live", Duration.ofHours(6));

            // 참가자 수 초기화
            redisTemplate.opsForValue().set("room:" + roomName + ":participants", "0", Duration.ofHours(6));
        }

        // LiveKit 토큰 생성
        AccessToken token = new AccessToken(LIVEKIT_REMOVED, LIVEKIT_API_SECRET);
        token.setName(participantName);
        token.setIdentity(participantName);
        token.addGrants(new RoomJoin(true), new RoomName(roomName));
        token.setMetadata("{\"role\":\"" + (isHost ? "host" : "guest") + "\"}");

        return ResponseEntity.ok(Map.of(
                "token", token.toJwt(),
                "role", isHost ? "host" : "guest"
        ));
    }

    /**
     * 방송 종료 API
     * - 호스트만 방송을 종료할 수 있음
     */
    @PostMapping(value = "/endBroadcast")
    public ResponseEntity<Map<String, String>> endBroadcast(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        // 현재 호스트 가져오기
        String existingHost = redisTemplate.opsForValue().get("room:" + roomName + ":host");

        if (existingHost == null || !existingHost.equals(participantName)) {
            return ResponseEntity.status(403).body(Map.of("errorMessage", "Only the host can end the broadcast"));
        }

        // 🔥 방송 상태 삭제
        redisTemplate.delete("room:" + roomName + ":status");
        redisTemplate.delete("room:" + roomName + ":host");

        return ResponseEntity.ok(Map.of("message", "Broadcast ended successfully"));
    }

    @GetMapping(value = "/broadcastStatus")
    public ResponseEntity<Map<String, String>> getBroadcastStatus(@RequestParam String roomName) {
        String status = redisTemplate.opsForValue().get("room:" + roomName + ":status");

        if (status == null) {
            return ResponseEntity.ok(Map.of("status", "offline")); // 방송 종료됨
        }
        return ResponseEntity.ok(Map.of("status", "live")); // 방송 진행 중
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

                    // Map.of 대신 새로운 HashMap 사용
                    Map<String, Object> broadcastInfo = new HashMap<>();
                    broadcastInfo.put("roomName", roomName);
                    broadcastInfo.put("host", host);
                    broadcastInfo.put("participantCount", participantCount);

                    return broadcastInfo;
                })
                //시청자 순 으로 정렬
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
        String action = params.get("action"); // "join" 또는 "leave"

        if (roomName == null || action == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and action are required"));
        }

        String participantsKey = "room:" + roomName + ":participants";

        // 참가자 수 업데이트 전에 현재 값 확인
        String currentCount = redisTemplate.opsForValue().get(participantsKey);
        if (currentCount == null) {
            // 값이 없으면 0으로 초기화
            redisTemplate.opsForValue().set(participantsKey, "0");
            currentCount = "0";
        }

        int count = Integer.parseInt(currentCount);
        if ("join".equals(action)) {
            count = Math.max(0, count + 1);
        } else if ("leave".equals(action)) {
            count = Math.max(0, count - 1);
        }

        // 새로운 값 저장 (6시간 만료 설정)
        redisTemplate.opsForValue().set(participantsKey, String.valueOf(count), Duration.ofHours(6));

        return ResponseEntity.ok(Map.of(
                "message", "Participant count updated",
                "count", String.valueOf(count)
        ));
    }
}
