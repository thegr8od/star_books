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

    /**
     * 사용자 입력 (email, message, persona)에 따라
     * OpenAI API에 요청하고, 결과를 반환합니다.
     */
    @PreAuthorize("isAuthenticated()")
    public String chatWithGPT(String email, String message, int persona) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return "Error: 사용자를 찾을 수 없습니다.";
        }

        // 1) 기존 대화 이력 조회
        List<ChatHistoryRepository.ChatMessage> history = chatHistoryRepository.getChatHistory(email);

        // 2) JSON requestBody 생성 (여기에 persona 별 system message 삽입)
        String requestBody = createRequestBody(history, message, persona);

        // 3) HTTP 요청 준비
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            // 4) OpenAI API 호출
            ResponseEntity<String> response = restTemplate.exchange(
                    OPENAI_URL, HttpMethod.POST, requestEntity, String.class
            );

            if (response.getStatusCode().isError()) {
                log.error("❌ OpenAI API 요청 실패 - 상태 코드: {}", response.getStatusCode());
                return "Error: OpenAI API 요청 실패 (" + response.getStatusCode() + ")";
            }

            // 5) API 응답에서 assistant의 답변 추출
            String botResponse = extractBotResponse(response.getBody());

            // 6) Redis에 대화 이력 저장
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

    /**
     * JSON 요청 생성: 기존 history + system 메시지(페르소나별) + user 메시지를 묶는다.
     */
    private String createRequestBody(List<ChatHistoryRepository.ChatMessage> history,
                                     String userMessage,
                                     int persona) {
        try {
            // 1) 최상위 노드
            ObjectNode root = objectMapper.createObjectNode();
            root.put("model", "gpt-4o-mini");

            // 2) messages 배열
            ArrayNode messagesArray = objectMapper.createArrayNode();

            // (a) system 메시지 (페르소나별 설정)
            String systemContent = getSystemPrompt(persona);
            messagesArray.add(createMessageNode("system", systemContent));

            // (b) 기존 대화내역 추가 (user, assistant)
            for (ChatHistoryRepository.ChatMessage chat : history) {
                messagesArray.add(createMessageNode(chat.role, chat.content));
            }

            // (c) 이번 user 메시지
            messagesArray.add(createMessageNode("user", userMessage));

            root.set("messages", messagesArray);
            return objectMapper.writeValueAsString(root);

        } catch (Exception e) {
            log.error("❌ JSON 생성 중 오류 발생", e);
            throw new RuntimeException("JSON 생성 오류");
        }
    }

    /**
     * 페르소나에 따라 system 프롬프트를 달리 설정
     */
    private String getSystemPrompt(int persona) {
        switch (persona) {
            case 1:
                return "너는 무뚝뚝한 어른 같은 말투지만, 상대방이 힘들어하면 진지하게 위로해주는 챗봇이야. " +
                        "대답은 짧고 간결하게 해도 좋지만, 필요한 경우 따뜻한 마음이 느껴지도록 답해줘.";
            case 2:
                return "너는 감정이입을 매우 잘하는, 100% 공감 능력을 가진 착한 사람처럼 말하는 챗봇이야. " +
                        "상대방의 감정을 충분히 어루만져 주고, 길게 위로와 공감을 해줘.";
            case 3:
                return "너는 경상도 사투리를 쓰는 쿨한 챗봇이야. " +
                        "경상도 사투리를 자주 섞어서 말해. " +
                        "상대방을 무뚝뚝하게 대하는 듯하지만, 그래도 진심으로 위로하고 챙겨주는 말투를 써. " +
                        "예를 들어: '무슨 일이고? 너무 힘들어 보인다. 내한테 좀 말해봐라 아이가.' 처럼 말해줘. " +
                        "절대 표준어만 쓰지 말고, 경상도 사투리를 꼭 써라.";
            default: 
                return "You are a helpful assistant.";
        }
    }

    /**
     * 메시지 노드 생성
     */
    private ObjectNode createMessageNode(String role, String content) {
        ObjectNode messageNode = objectMapper.createObjectNode();
        messageNode.put("role", role);
        messageNode.put("content", content);
        return messageNode;
    }

    /**
     * OpenAI API 응답(JSON)에서 assistant의 답변 추출
     */
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
