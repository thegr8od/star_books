package com.starbooks.backend.chatbot.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ChatHistoryRepository {

    private final StringRedisTemplate redisTemplate;
    private static final String CHAT_HISTORY_PREFIX = "chat_history:";

    public List<String> getChatHistory(String userId) {
        return redisTemplate.opsForList().range(CHAT_HISTORY_PREFIX + userId, 0, -1);
    }

    public void saveChat(String userId, String userMessage, String botResponse) {
        redisTemplate.opsForList().rightPush(CHAT_HISTORY_PREFIX + userId, userMessage);
        redisTemplate.opsForList().rightPush(CHAT_HISTORY_PREFIX + userId, botResponse);
    }
}
