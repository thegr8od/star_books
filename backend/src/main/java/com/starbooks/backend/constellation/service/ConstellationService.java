package com.starbooks.backend.constellation.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.starbooks.backend.constellation.dto.ConstellationLineDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConstellationService {

    @Value("${anthropic.api.key}")
    private String anthropicApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ConstellationDBService constellationDBService;

    private static final String CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

    /**
     * 📤 MultipartFile 이미지를 Base64로 변환
     */
    public String encodeFileToBase64(MultipartFile file) {
        try {
            byte[] fileContent = file.getBytes();
            return Base64.getEncoder().encodeToString(fileContent);
        } catch (Exception e) {
            log.error("❌ 이미지 Base64 변환 실패", e);
            throw new RuntimeException("이미지 변환 오류");
        }
    }

    private List<Map<String, Object>> parseAIResponse(String responseBody) {
        try {
            log.info("🔍 Claude API 응답 원본: {}", responseBody);

            // JSON 파싱
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            String responseText = jsonNode.get("content").get(0).get("text").asText();

            // JSON 코드 블록 감지 및 제거
            Matcher matcher = Pattern.compile("\\[(.*?)\\]", Pattern.DOTALL).matcher(responseText);
            if (matcher.find()) {
                responseText = "[" + matcher.group(1) + "]";
            }

            // JSON을 리스트로 변환
            List<Map<String, Object>> parsedData = objectMapper.readValue(responseText, new TypeReference<>() {});
            log.info("✅ 최종 파싱된 데이터: {}", parsedData);

            return parsedData;
        } catch (Exception e) {
            log.error("❌ Claude API 응답 파싱 오류 발생", e);
            throw new RuntimeException("응답 처리 실패");
        }
    }


    /**
     * 🛠 Claude API 호출 및 응답 처리 + 데이터 저장
     */
    public List<Map<String, Object>> generateLinesFromAI(String base64Image, Long userId) {
        try {
            log.info("🛠 Claude API 요청 시작...");

            // Claude API 호출
            List<Map<String, Object>> parsedData = callClaudeAPI(base64Image);

            // 데이터를 DTO로 변환 후 저장
            List<ConstellationLineDto> lineDtos = new ArrayList<>();
            for (Map<String, Object> line : parsedData) {
                Map<String, Integer> start = (Map<String, Integer>) line.get("start");
                Map<String, Integer> end = (Map<String, Integer>) line.get("end");

                lineDtos.add(new ConstellationLineDto(null, null,
                        start.get("x"), start.get("y"), end.get("x"), end.get("y")));
            }

            constellationDBService.saveConstellation(userId, lineDtos);

            return parsedData;

        } catch (Exception e) {
            log.error("❌ Claude API 요청 중 오류 발생", e);
            throw new RuntimeException("Claude API 처리 실패");
        }
    }

    /**
     * 🛠 Claude API 호출 로직
     */
    private List<Map<String, Object>> callClaudeAPI(String base64Image) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "claude-3-5-sonnet-20241022");
            requestBody.put("max_tokens", 1024);
            requestBody.put("temperature", 0);

            List<Map<String, Object>> messages = List.of(Map.of(
                    "role", "user",
                    "content", List.of(
                            Map.of("type", "text", "text",
                                    "제공된 이미지를 단순한 선들로 이루어진 픽토그램으로 변환해주세요. " +
                                            "(0,0)이 왼쪽 상단, (100,100)이 오른쪽 하단인 좌표계를 사용합니다. " +
                                            "각 선은 시작점과 끝점의 좌표를 배열로 반환해야 합니다. " +
                                            "x는 왼쪽에서 오른쪽으로 증가하고, y는 위에서 아래로 증가하는 방식입니다. " +
                                            "원형 부분은 8개의 선분을 사용하여 부드럽게 표현해주세요. " +
                                            "눈, 코, 입은 점으로 단순히 표현할 수 있으며, 입은 표정에 따라 선으로 표현할 수도 있습니다. " +
                                            "사람 머리카락은 얼굴 선 옆에 간단한 선으로 추가해 주세요. " +
                                            "설명 없이 JSON 배열만 반환해야 하며, '//' 같은 주석 없이 오직 JSON 형식으로 응답해 주세요. " +
                                            "예시: [{\"start\": {\"x\": 30, \"y\": 20}, \"end\": {\"x\": 50, \"y\": 40}}, ...]"),
                            Map.of("type", "image", "source",
                                    Map.of("type", "base64", "media_type", "image/png", "data", base64Image))
                    )
            ));

            requestBody.put("messages", messages);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", anthropicApiKey);
            headers.set("anthropic-version", "2023-06-01");

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(CLAUDE_API_URL, HttpMethod.POST, requestEntity, String.class);

            return parseAIResponse(response.getBody());

        } catch (Exception e) {
            log.error("❌ Claude API 요청 중 오류 발생", e);
            throw new RuntimeException("Claude API 처리 실패");
        }
    }
}
