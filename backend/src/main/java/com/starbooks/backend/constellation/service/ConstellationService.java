package com.starbooks.backend.constellation.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConstellationService {

    @Value("${anthropic.api.key}")
    private String anthropicApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

    /**
     * 🔍 API Key가 설정되어 있는지 확인
     */
    @PostConstruct
    public void checkApiKey() {
        log.info("✅ Checking Anthropic API Key: {}", anthropicApiKey);
        if (anthropicApiKey == null || anthropicApiKey.isEmpty()) {
            throw new IllegalStateException("❌ Claude API Key가 설정되지 않았습니다.");
        }
    }

    /**
     * Claude API를 호출하여 별자리 선 데이터를 생성하는 메서드
     */
    public List<Map<String, Object>> generateLinesFromAI(String base64Image) {
        try {
            if (anthropicApiKey == null || anthropicApiKey.isEmpty()) {
                throw new IllegalStateException("❌ Claude API Key가 설정되지 않았습니다.");
            }

            // 1️⃣ API 요청 바디 생성
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "claude-3-5-sonnet-20241022");
            requestBody.put("max_tokens", 1024);
            requestBody.put("temperature", 0);

            // messages: Anthropic API용으로 구성
            List<Map<String, Object>> messages = new ArrayList<>();
            messages.add(Map.of(
                    "role", "user",
                    "content", List.of(
                            Map.of("type", "text", "text", "제공된 이미지를 단순한 선들로 이루어진 픽토그램으로 변환해주세요. (-10,10) 좌표계 안에서 각 선의 시작점과 끝점 좌표를 배열로 반환해주세요."),
                            Map.of("type", "image", "source", Map.of(
                                    "type", "base64",
                                    "media_type", "image/png",
                                    "data", base64Image
                            ))
                    )
            ));
            requestBody.put("messages", messages);

            // 2️⃣ HTTP 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", anthropicApiKey); // Anthropic 권장 헤더
            headers.set("anthropic-version", "2023-06-01");

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            // 3️⃣ Claude API 호출
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    CLAUDE_API_URL, HttpMethod.POST, requestEntity, String.class
            );

            if (responseEntity.getStatusCode().isError()) {
                log.error("❌ Claude API 요청 실패 - 상태 코드: {}", responseEntity.getStatusCode());
                return Collections.emptyList();
            }

            // 4️⃣ Claude 응답 파싱하여 JSON 데이터 추출
            return parseAIResponse(responseEntity.getBody());

        } catch (Exception e) {
            log.error("❌ Claude API 요청 중 오류 발생", e);
            return Collections.emptyList();
        }
    }

    /**
     * Claude API 응답(JSON)에서 선 데이터 추출
     */
    private List<Map<String, Object>> parseAIResponse(String responseBody) throws Exception {
        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            // 예: { "content": [ { "text": "[{...}, {...}]" } ] } 형태로 응답 온다고 가정
            String responseText = jsonNode.get("content").get(0).get("text").asText();
            return objectMapper.readValue(responseText, List.class);
        } catch (Exception e) {
            log.error("❌ Claude API 응답 파싱 오류", e);
            throw new RuntimeException("Claude 응답 처리 실패");
        }
    }
}
