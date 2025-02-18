package com.starbooks.backend.constellation.controller;

import com.starbooks.backend.common.ApiResponse;
import com.starbooks.backend.common.ErrorCode;
import com.starbooks.backend.config.CustomUserDetails;
import com.starbooks.backend.constellation.dto.ConstellationDto;
import com.starbooks.backend.constellation.dto.ConstellationLineDto;
import com.starbooks.backend.constellation.service.ConstellationDBService;
import com.starbooks.backend.constellation.service.ConstellationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
     * 📌 AI가 생성한 별자리 데이터 저장
     */
    @PostMapping("/generate-lines")
    public ResponseEntity<?> generateConstellation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        Long userId = userDetails.getUserId();
        log.info("📌 [ConstellationController] AI 별자리 생성 요청 - userId: {}", userId);

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.CONSTELLATION_INVALID_REQUEST));
        }

        try {
            String base64Image = constellationService.encodeFileToBase64(file);
            List<Map<String, Object>> linesData = constellationService.generateLinesFromAI(base64Image, userId);
            return ResponseEntity.ok(ApiResponse.createSuccess(linesData, "별자리 생성 및 저장 완료"));
        } catch (Exception e) {
            log.error("❌ AI 별자리 생성 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * 📌 유저가 직접 별자리 데이터를 업로드
     */
    @PostMapping("/user-upload")
    public ResponseEntity<?> uploadConstellation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ConstellationDto constellationDto) {

        Long userId = userDetails.getUserId();
        log.info("📌 [ConstellationController] 유저 별자리 업로드 요청 - userId: {}", userId);

        if (constellationDto == null || constellationDto.getLines().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.CONSTELLATION_INVALID_REQUEST));
        }

        try {
            ConstellationDto savedConstellation = constellationDBService.saveConstellation(userId, constellationDto.getLines());
            return ResponseEntity.ok(ApiResponse.createSuccess(savedConstellation, "유저 별자리 저장 완료"));
        } catch (Exception e) {
            log.error("❌ 유저 별자리 업로드 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * 🔍 현재 로그인한 유저의 별자리 목록 조회
     */
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<ConstellationDto>>> getConstellations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getUserId();
        log.info("📌 [ConstellationController] 유저 별자리 조회 - userId: {}", userId);

        List<ConstellationDto> constellations = constellationDBService.getConstellationsByUser(userId);
        return ResponseEntity.ok(ApiResponse.createSuccess(constellations, "별자리 목록 조회 성공"));
    }

    /**
     * 🔍 특정 별자리의 선 데이터 조회
     */
    @GetMapping("/{constellationId}/lines")
    public ResponseEntity<?> getLines(@PathVariable Long constellationId) {
        log.info("📌 [ConstellationController] 별자리 선 조회 - constellationId: {}", constellationId);

        List<ConstellationLineDto> lines = constellationDBService.getLinesByConstellationId(constellationId);
        if (lines.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.createError(ErrorCode.CONSTELLATION_NOT_FOUND));
        }

        return ResponseEntity.ok(ApiResponse.createSuccess(lines, "별자리 선 데이터 조회 성공"));
    }

    /**
     * 🔄 별자리 데이터 수정 (별자리 소유자만 가능)
     */
    @PutMapping("/{constellationId}/update")
    public ResponseEntity<?> updateConstellationLines(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long constellationId,
            @RequestBody List<ConstellationLineDto> updatedLines) {

        Long userId = userDetails.getUserId();
        log.info("📌 [ConstellationController] 별자리 수정 요청 - userId: {}, constellationId: {}", userId, constellationId);

        try {
            boolean isUpdated = constellationDBService.updateConstellationLines(userId, constellationId, updatedLines);
            if (!isUpdated) {
                return ResponseEntity.status(403).body(ApiResponse.createError(ErrorCode.CONSTELLATION_FORBIDDEN));
            }
            return ResponseEntity.ok(ApiResponse.createSuccess(null, "별자리 수정 완료"));
        } catch (Exception e) {
            log.error("❌ 별자리 수정 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponse.createError(ErrorCode.CONSTELLATION_UPDATE_FAILED));
        }
    }

    /**
     * ❌ 별자리 삭제 (별자리 소유자만 가능)
     */
    @DeleteMapping("/{constellationId}")
    public ResponseEntity<?> deleteConstellation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long constellationId) {

        Long userId = userDetails.getUserId();
        log.info("❌ [ConstellationController] 별자리 삭제 요청 - userId: {}, constellationId: {}", userId, constellationId);

        try {
            boolean isDeleted = constellationDBService.deleteConstellation(userId, constellationId);
            if (!isDeleted) {
                return ResponseEntity.status(403).body(ApiResponse.createError(ErrorCode.CONSTELLATION_FORBIDDEN));
            }
            return ResponseEntity.ok(ApiResponse.createSuccess(null, "별자리 삭제 완료"));
        } catch (Exception e) {
            log.error("❌ 별자리 삭제 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponse.createError(ErrorCode.CONSTELLATION_DELETE_FAILED));
        }
    }
}
