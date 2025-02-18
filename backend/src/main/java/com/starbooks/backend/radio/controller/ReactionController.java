package com.starbooks.backend.radio.controller;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

//웹소켓이라서 RestController가 안먹힐수도 있음
@Controller
@RequestMapping("/api/radio")
public class ReactionController {

    private final StringRedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    public ReactionController(StringRedisTemplate redisTemplate, SimpMessagingTemplate messagingTemplate) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/sendReaction")
    public void sendReaction(@Payload Map<String, String> request) {
        String roomName = request.get("roomName");
        String emoji = request.get("emoji");

        if (roomName == null || emoji == null) {
            return;
        }

        String redisKey = "room:" + roomName + ":emoji:" + emoji;
        Long newCount = redisTemplate.opsForValue().increment(redisKey);
        redisTemplate.expire(redisKey, Duration.ofHours(1));

        messagingTemplate.convertAndSend(
                "/topic/reactions/" + roomName,
                Map.of(emoji, newCount != null ? newCount.intValue() : 1)
        );
    }

    @GetMapping("/reactions")
    public Map<String, Integer> getReactions(@RequestParam String roomName) {
        Set<String> keys = redisTemplate.keys("room:" + roomName + ":emoji:*");

        if (keys == null || keys.isEmpty()) {
            return Map.of();
        }

        return keys.stream().collect(Collectors.toMap(
                key -> key.split(":")[3],
                key -> {
                    String value = redisTemplate.opsForValue().get(key);
                    return value != null ? Integer.parseInt(value) : 0;
                }
        ));
    }
}