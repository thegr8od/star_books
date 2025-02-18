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
     * 📌 AI가 생성한 별자리 데이터 저장 (JWT 토큰에서 userId 자동 추출)
     */
    @PostMapping("/generate-lines")
    public ResponseEntity<?> generateConstellation(
            @AuthenticationPrincipal CustomUserDetails userDetails,  // ✅ 토큰에서 userId 가져오기
            @RequestParam("file") MultipartFile file) {

        Long userId = userDetails.getUserId(); // ✅ userId 추출
        log.info("📌 [ConstellationController] 별자리 생성 요청 - userId: {}", userId);

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 비어 있습니다.");
        }

        try {
            String base64Image = constellationService.encodeFileToBase64(file);
            List<Map<String, Object>> linesData = constellationService.generateLinesFromAI(base64Image, userId);
            return ResponseEntity.ok(ApiResponse.createSuccess(linesData, "별자리 생성 및 저장 완료"));
        } catch (Exception e) {
            log.error("❌ 별자리 생성 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * 🔍 현재 로그인한 유저의 별자리 목록 조회 (JWT 토큰에서 userId 자동 추출)
     */
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<ConstellationDto>>> getConstellations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long userId = userDetails.getUserId();  // ✅ userId 추출
        log.info("📌 [ConstellationController] 유저 별자리 조회 - userId: {}", userId);

        List<ConstellationDto> constellations = constellationDBService.getConstellationsByUser(userId);
        return ResponseEntity.ok(ApiResponse.createSuccess(constellations, "별자리 목록 조회 성공"));
    }

    /**
     * 🔍 특정 별자리의 선 데이터 조회
     */
    @GetMapping("/{constellationId}/lines")
    public ResponseEntity<ApiResponse<List<ConstellationLineDto>>> getLines(@PathVariable Long constellationId) {
        log.info("📌 [ConstellationController] 별자리 선 조회 - constellationId: {}", constellationId);
        List<ConstellationLineDto> lines = constellationDBService.getLinesByConstellationId(constellationId);
        return ResponseEntity.ok(ApiResponse.createSuccess(lines, "별자리 선 데이터 조회 성공"));
    }

    /**
     * 🌟 유저가 직접 별자리 데이터 업로드 (JWT 토큰에서 userId 자동 추출)
     */
    @PostMapping("/user-upload")
    public ResponseEntity<?> uploadConstellation(
            @AuthenticationPrincipal CustomUserDetails userDetails,  // ✅ 토큰에서 userId 가져오기
            @RequestBody ConstellationDto constellationDto) {  // ✅ 유저가 보낸 별자리 데이터

        Long userId = userDetails.getUserId(); // ✅ userId 추출
        log.info("📌 [ConstellationController] 유저 별자리 업로드 요청 - userId: {}", userId);

        try {
            ConstellationDto savedConstellation = constellationDBService.saveUserConstellation(userId, constellationDto);
            return ResponseEntity.ok(ApiResponse.createSuccess(savedConstellation, "유저 별자리 저장 완료"));
        } catch (Exception e) {
            log.error("❌ 유저 별자리 업로드 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * 📌 AI가 생성한 별자리 데이터 수정 (JWT 토큰에서 userId 자동 추출)
     */
    @PutMapping("/{constellationId}/update-lines")
    public ResponseEntity<?> updateConstellationLines(
            @AuthenticationPrincipal CustomUserDetails userDetails,  // ✅ 토큰에서 userId 가져오기
            @PathVariable Long constellationId,  // ✅ 수정할 별자리 ID
            @RequestBody List<ConstellationLineDto> updatedLines) {  // ✅ 수정할 선 데이터

        Long userId = userDetails.getUserId(); // ✅ userId 추출
        log.info("📌 [ConstellationController] 별자리 데이터 수정 요청 - userId: {}, constellationId: {}", userId, constellationId);

        try {
            boolean isUpdated = constellationDBService.updateConstellationLines(userId, constellationId, updatedLines);
            if (!isUpdated) {
                return ResponseEntity.status(403).body(ApiResponse.createError(ErrorCode.FORBIDDEN, "AI가 생성한 별자리만 수정할 수 있습니다."));
            }
            return ResponseEntity.ok(ApiResponse.createSuccess(null, "별자리 데이터 수정 완료"));
        } catch (Exception e) {
            log.error("❌ 별자리 데이터 수정 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR));
        }
    }

    /**
     * ❌ AI가 생성한 별자리 삭제 (JWT 토큰에서 userId 자동 추출)
     */
    @DeleteMapping("/{constellationId}")
    public ResponseEntity<?> deleteConstellation(
            @AuthenticationPrincipal CustomUserDetails userDetails,  // ✅ 토큰에서 userId 가져오기
            @PathVariable Long constellationId) {  // ✅ 삭제할 별자리 ID

        Long userId = userDetails.getUserId(); // ✅ userId 추출
        log.info("❌ [ConstellationController] 별자리 삭제 요청 - userId: {}, constellationId: {}", userId, constellationId);

        try {
            boolean isDeleted = constellationDBService.deleteConstellation(userId, constellationId);
            if (!isDeleted) {
                return ResponseEntity.status(403).body(ApiResponse.createError(ErrorCode.FORBIDDEN, "AI가 생성한 별자리만 삭제할 수 있습니다."));
            }
            return ResponseEntity.ok(ApiResponse.createSuccess(null, "별자리 삭제 완료"));
        } catch (Exception e) {
            log.error("❌ 별자리 삭제 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponse.createError(ErrorCode.INTERNAL_SERVER_ERROR));
        }
    }



}
