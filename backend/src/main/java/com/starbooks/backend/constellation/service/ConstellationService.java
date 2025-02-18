package com.starbooks.backend.constellation.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.starbooks.backend.constellation.dto.ConstellationLineDto;
import com.starbooks.backend.constellation.service.ConstellationDBService;
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
import java.util.stream.Collectors;

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

    public String encodeFileToBase64(MultipartFile file) {
        try {
            byte[] fileContent = file.getBytes();
            return Base64.getEncoder().encodeToString(fileContent);
        } catch (Exception e) {
            log.error("❌ 이미지 Base64 변환 실패", e);
            throw new RuntimeException("이미지 변환 오류");
        }
    }

    public List<Map<String, Object>> generateLinesFromAI(String base64Image, Long userId) {
        try {
            log.info("🛠 Claude API 요청 시작...");

            List<Map<String, Object>> parsedData = callClaudeAPI(base64Image);

            if (parsedData == null || parsedData.isEmpty()) {
                throw new RuntimeException("Claude API 응답이 비어 있습니다.");
            }

            List<ConstellationLineDto> lineDtos = parsedData.stream()
                    .map(line -> {
                        Map<String, Integer> start = (Map<String, Integer>) line.get("start");
                        Map<String, Integer> end = (Map<String, Integer>) line.get("end");

                        return new ConstellationLineDto(null, null,
                                start.get("x"), start.get("y"), end.get("x"), end.get("y"));
                    })
                    .collect(Collectors.toList());

            constellationDBService.saveConstellation(userId, lineDtos);
            return parsedData;
        } catch (Exception e) {
            log.error("❌ Claude API 요청 중 오류 발생", e);
            throw new RuntimeException("Claude API 처리 실패");
        }
    }

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
                                            "**설명 없이 오직 JSON 배열만 반환해야 합니다.** " +  // ✅ JSON만 반환 강조
                                            "**'//' 같은 주석, 텍스트, 부가 설명을 절대 포함하지 마세요.** " +  // ✅ 추가적인 주석도 포함하지 않도록 요청
                                            "**예시와 완전히 동일한 JSON 배열을 반환하세요.** " +
                                            "**예시: [{\"start\": {\"x\": 30, \"y\": 20}, \"end\": {\"x\": 50, \"y\": 40}}, ...]**"
                            ),
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

            log.info("📝 Claude API 응답: {}", response.getBody()); // ✅ 응답을 로그로 확인

            return parseAIResponse(response.getBody());
        } catch (Exception e) {
            log.error("❌ Claude API 요청 중 오류 발생", e);
            throw new RuntimeException("Claude API 처리 실패");
        }
    }


    private List<Map<String, Object>> parseAIResponse(String responseBody) {
        try {
            if (responseBody == null || responseBody.isBlank()) {
                throw new RuntimeException("Claude API 응답이 비어 있습니다.");
            }

            // ✅ JSON 형식이 아닌 경우 예외 처리
            if (!responseBody.trim().startsWith("{") && !responseBody.trim().startsWith("[")) {
                log.error("❌ 예상치 못한 응답 형식: {}", responseBody);
                throw new RuntimeException("Claude API 응답이 JSON 형식이 아닙니다.");
            }

            JsonNode jsonNode = objectMapper.readTree(responseBody);

            // ✅ JSON 형식이 맞지만 content가 존재하지 않는 경우 예외 처리
            if (!jsonNode.has("content")) {
                log.error("❌ JSON 구조 오류: {}", jsonNode);
                throw new RuntimeException("Claude API 응답에서 'content' 키를 찾을 수 없습니다.");
            }

            return objectMapper.readValue(jsonNode.get("content").get(0).get("text").asText(), new TypeReference<>() {});
        } catch (Exception e) {
            log.error("❌ Claude API 응답 파싱 오류 발생: {}", responseBody, e);
            throw new RuntimeException("응답 처리 실패");
        }
    }

}
