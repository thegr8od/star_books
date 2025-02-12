package com.starbooks.backend.radio.controller;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/radio")
public class RadioController {

    @Value("${livekit.api.key}")
    private String LIVEKIT_REMOVED;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    private final StringRedisTemplate redisTemplate;

    public RadioController(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @PostMapping(value = "/token")
    public ResponseEntity<Map<String, String>> createToken(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        // Redis에서 해당 방의 호스트 여부 확인
        String existingHost = redisTemplate.opsForValue().get("room:" + roomName + ":host");

        boolean isHost = (existingHost == null);

        if (isHost) {
            // 방의 첫 번째 참가자가 호스트가 됨
            redisTemplate.opsForValue().set("room:" + roomName + ":host", participantName, Duration.ofHours(6));
        }

        AccessToken token = new AccessToken(LIVEKIT_REMOVED, LIVEKIT_API_SECRET);
        token.setName(participantName);
        token.setIdentity(participantName);

        if (isHost) {
            //호스트(방송자) → 오디오 송출 가능
            token.addGrants(new RoomJoin(true), new RoomName(roomName));
        } else {
            //게스트(청취자) → 오디오 송출 불가 (오디오만 수신 가능)
            token.addGrants(new RoomJoin(true), new RoomName(roomName));
        }

        return ResponseEntity.ok(Map.of(
                "token", token.toJwt(),
                "role", isHost ? "host" : "guest"
        ));
    }
}
