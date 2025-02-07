package com.starbooks.backend.chatbot.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.starbooks.backend.chatbot.repository.ChatHistoryRepository;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final ChatHistoryRepository chatHistoryRepository;
    private final RestTemplate restTemplate;  // ✅ 정상적으로 주입됨
    private final UserRepository userRepository;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    @PreAuthorize("isAuthenticated()")
    public String chatWithGPT(String email, String message) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return "Error: 사용자를 찾을 수 없습니다.";
        }

        List<String> history = chatHistoryRepository.getChatHistory(email);
        String requestBody = createRequestBody(history, message);

        // ✅ HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);  // ✅ Authorization 헤더 추가

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        // ✅ RestTemplate을 사용하여 OpenAI API 호출
        ResponseEntity<String> response = restTemplate.exchange(
                OPENAI_URL, HttpMethod.POST, requestEntity, String.class
        );

        String responseBody = response.getBody();
        chatHistoryRepository.saveChat(email, message, responseBody);
        return responseBody;
    }

    @PreAuthorize("isAuthenticated()")
    public List<String> getChatHistory(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return List.of("Error: 사용자를 찾을 수 없습니다.");
        }
        return chatHistoryRepository.getChatHistory(email);
    }

    private String createRequestBody(List<String> history, String message) {
        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.append("{\"model\":\"gpt-4\", \"messages\":[");
        jsonBuilder.append("{\"role\":\"system\",\"content\":\"You are a helpful assistant.\"}");
        for (String msg : history) {
            jsonBuilder.append(",{\"role\":\"user\",\"content\":\"").append(msg).append("\"}");
        }
        jsonBuilder.append(",{\"role\":\"user\",\"content\":\"").append(message).append("\"}");
        jsonBuilder.append("]}");
        return jsonBuilder.toString();
    }
}
