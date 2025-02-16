package com.starbooks.backend.constellation.controller;

import com.starbooks.backend.constellation.dto.ClaudeRequestDto;
import com.starbooks.backend.constellation.service.ConstellationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/constellation")
@RequiredArgsConstructor
public class ConstellationController {

    private final ConstellationService constellationService;

    /**
     * 별자리 선 데이터를 생성하는 API
     */
    @PostMapping("/generate-lines")
    public ResponseEntity<List<Map<String, Object>>> generateLines(@RequestBody ClaudeRequestDto request) {
        log.info("🔹 [ConstellationController] 이미지 분석 요청 받음");
        List<Map<String, Object>> lines = constellationService.generateLinesFromAI(request.getBase64Image());
        return ResponseEntity.ok(lines);
    }
}
