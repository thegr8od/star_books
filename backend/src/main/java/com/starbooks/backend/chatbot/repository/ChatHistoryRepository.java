package com.starbooks.backend.chatbot.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ChatHistoryRepository {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();  // UTF-8 자동 적용
    private static final String CHAT_HISTORY_PREFIX = "chat:";

    // 대화 조회 (JSON 파싱하여 반환)
    public List<ChatMessage> getChatHistory(String userId) {
        List<String> rawMessages = redisTemplate.opsForList().range(CHAT_HISTORY_PREFIX + userId, 0, -1);
        return rawMessages == null ? List.of() : rawMessages.stream()
                .map(this::parseJson)
                .collect(Collectors.toList());
    }

    //대화 저장 (JSON 저장 시 UTF-8 강제 적용)
    public void saveChat(String userId, String userMessage, String botResponse) {
        try {
            // UTF-8로 JSON 변환하여 Redis에 저장
            String userJson = objectMapper.writeValueAsString(new ChatMessage("user", userMessage));
            String botJson = objectMapper.writeValueAsString(new ChatMessage("assistant", botResponse));

            redisTemplate.opsForList().rightPush(CHAT_HISTORY_PREFIX + userId, userJson);
            redisTemplate.opsForList().rightPush(CHAT_HISTORY_PREFIX + userId, botJson);

            log.info("✅ Redis 저장 완료: {}", userJson);
            log.info("✅ Redis 저장 완료: {}", botJson);
        } catch (Exception e) {
            log.error("❌ Redis 저장 오류", e);
        }
    }

    private ChatMessage parseJson(String json) {
        try {
            return objectMapper.readValue(json, ChatMessage.class);
        } catch (Exception e) {
            log.error("❌ JSON 파싱 오류: {}", json, e);
            return new ChatMessage("error", "Invalid message format");
        }
    }

    public static class ChatMessage {
        public String role;
        public String content;

        public ChatMessage() {}  // 기본 생성자 (JSON 변환용)
        public ChatMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }
}
