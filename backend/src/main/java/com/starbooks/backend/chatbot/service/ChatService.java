package com.starbooks.backend.chatbot.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.starbooks.backend.chatbot.repository.ChatHistoryRepository;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final ChatHistoryRepository chatHistoryRepository;
    private final RestTemplate restTemplate;
    private final UserRepository userRepository;
    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private final ObjectMapper objectMapper;

    @PreAuthorize("isAuthenticated()")
    public String chatWithGPT(String email, String message) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return "Error: 사용자를 찾을 수 없습니다.";
        }

        List<ChatHistoryRepository.ChatMessage> history = chatHistoryRepository.getChatHistory(email);
        String requestBody = createRequestBody(history, message);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    OPENAI_URL, HttpMethod.POST, requestEntity, String.class
            );

            if (response.getStatusCode().isError()) {
                log.error("❌ OpenAI API 요청 실패 - 상태 코드: {}", response.getStatusCode());
                return "Error: OpenAI API 요청 실패 (" + response.getStatusCode() + ")";
            }

            String botResponse = extractBotResponse(response.getBody());

            // ✅ Redis에 대화 저장
            chatHistoryRepository.saveChat(email, message, botResponse);

            return botResponse;
        } catch (Exception e) {
            log.error("❌ OpenAI API 요청 중 예외 발생", e);
            return "Error: OpenAI API 요청 중 문제가 발생했습니다.";
        }
    }

    @PreAuthorize("isAuthenticated()")
    public List<ChatHistoryRepository.ChatMessage> getChatHistory(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return List.of(new ChatHistoryRepository.ChatMessage("error", "사용자를 찾을 수 없습니다."));
        }
        return chatHistoryRepository.getChatHistory(email);
    }

    // ✅ JSON 요청 생성 (기존 기록 반영)
    private String createRequestBody(List<ChatHistoryRepository.ChatMessage> history, String message) {
        try {
            ObjectNode root = objectMapper.createObjectNode();
            root.put("model", "gpt-3.5-turbo");

            ArrayNode messagesArray = objectMapper.createArrayNode();
            messagesArray.add(createMessageNode("system", "You are a helpful assistant."));

            for (ChatHistoryRepository.ChatMessage chat : history) {
                messagesArray.add(createMessageNode(chat.role, chat.content));
            }
            messagesArray.add(createMessageNode("user", message));

            root.set("messages", messagesArray);
            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            log.error("❌ JSON 생성 중 오류 발생", e);
            throw new RuntimeException("JSON 생성 오류");
        }
    }

    private ObjectNode createMessageNode(String role, String content) {
        ObjectNode messageNode = objectMapper.createObjectNode();
        messageNode.put("role", role);
        messageNode.put("content", content);
        return messageNode;
    }

    private String extractBotResponse(String responseBody) {
        try {
            ObjectNode jsonNode = objectMapper.readValue(responseBody, ObjectNode.class);
            return jsonNode.get("choices").get(0).get("message").get("content").asText();
        } catch (Exception e) {
            log.error("❌ GPT 응답 파싱 오류", e);
            return "Error: 응답을 이해할 수 없습니다.";
        }
    }
}
