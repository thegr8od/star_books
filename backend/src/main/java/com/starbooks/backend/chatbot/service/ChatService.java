package com.starbooks.backend.chatbot.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    private final RestTemplate restTemplate;
    private final UserRepository userRepository;  // ✅ JPA 기반 사용자 검증 추가

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    public String chatWithGPT(String email, String message) {
        // 이메일을 기반으로 사용자 확인
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return "Error: 사용자를 찾을 수 없습니다.";
        }

        // 기존 대화 기록 가져오기
        List<String> history = chatHistoryRepository.getChatHistory(email);

        // OpenAI API 요청 생성
        String requestBody = createRequestBody(history, message);
        String responseBody = restTemplate.postForObject(OPENAI_URL, requestBody, String.class);

        // 응답 저장
        chatHistoryRepository.saveChat(email, message, responseBody);
        return responseBody;
    }

    public List<String> getChatHistory(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return List.of("Error: 사용자를 찾을 수 없습니다.");
        }
        return chatHistoryRepository.getChatHistory(email);
    }

    private String createRequestBody(List<String> history, String message) {
        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.append("{\"model\":\"o3-mini\", \"messages\":[");
        jsonBuilder.append("{\"role\":\"system\",\"content\":\"You are a helpful assistant.\"}");
        for (String msg : history) {
            jsonBuilder.append(",{\"role\":\"user\",\"content\":\"").append(msg).append("\"}");
        }
        jsonBuilder.append(",{\"role\":\"user\",\"content\":\"").append(message).append("\"}");
        jsonBuilder.append("]}");
        return jsonBuilder.toString();
    }
}
