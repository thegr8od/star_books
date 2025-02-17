package com.starbooks.backend.constellation.controller;

import com.starbooks.backend.constellation.service.ConstellationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/constellation")
@RequiredArgsConstructor
public class ConstellationController {

    private final ConstellationService constellationService;

    /***
     * 📸 사용자 이미지 업로드 및 분석 요청 (MultipartFile 지원)
     */
    @PostMapping("/generate-lines")
    public ResponseEntity<?> generateLines(@RequestParam("file") MultipartFile file) {
        log.info("🔹 [ConstellationController] 이미지 업로드 요청 받음");

        if (file == null || file.isEmpty()) {
            log.error("❌ 업로드된 파일이 없음.");
            return ResponseEntity.badRequest().body("파일이 비어 있습니다.");
        }

        try {
            // Base64 변환 후 Claude API 호출
            String base64Image = constellationService.encodeFileToBase64(file);
            List<Map<String, Object>> lines = constellationService.generateLinesFromAI(base64Image);

            log.info("✅ 별자리 선 데이터 생성 완료");
            return ResponseEntity.ok(lines);
        } catch (RuntimeException e) {
            log.error("❌ API 응답 처리 중 오류 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("별자리 생성 실패: " + e.getMessage());
        } catch (Exception e) {
            log.error("❌ 이미지 처리 중 예상치 못한 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 내부 오류가 발생했습니다.");
        }
    }
}
