package com.starbooks.backend.constellation.controller;

import com.starbooks.backend.constellation.dto.ConstellationDto;
import com.starbooks.backend.constellation.dto.ConstellationLineDto;
import com.starbooks.backend.constellation.service.ConstellationDBService;
import com.starbooks.backend.constellation.service.ConstellationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final ConstellationDBService constellationDBService;

    /**
     * 📌 AI가 생성한 별자리 데이터 저장 (DB에 저장)
     */
    @PostMapping("/generate/{userId}")
    public ResponseEntity<?> generateConstellation(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        log.info("📌 [ConstellationController] 별자리 생성 요청 - userId: {}", userId);

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 비어 있습니다.");
        }

        try {
            String base64Image = constellationService.encodeFileToBase64(file);
            List<Map<String, Object>> linesData = constellationService.generateLinesFromAI(base64Image, userId);
            return ResponseEntity.ok(Map.of("message", "별자리 생성 및 저장 완료", "data", linesData));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("별자리 생성 중 오류 발생");
        }
    }

    /**
     * 🔍 특정 유저의 별자리 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ConstellationDto>> getConstellations(@PathVariable Long userId) {
        log.info("📌 [ConstellationController] 유저 별자리 조회 - userId: {}", userId);
        return ResponseEntity.ok(constellationDBService.getConstellationsByUser(userId));
    }

    /**
     * 🔍 특정 별자리의 선 데이터 조회
     */
    @GetMapping("/{constellationId}/lines")
    public ResponseEntity<List<ConstellationLineDto>> getLines(@PathVariable Long constellationId) {
        log.info("📌 [ConstellationController] 별자리 선 조회 - constellationId: {}", constellationId);
        return ResponseEntity.ok(constellationDBService.getLinesByConstellationId(constellationId));
    }
}
