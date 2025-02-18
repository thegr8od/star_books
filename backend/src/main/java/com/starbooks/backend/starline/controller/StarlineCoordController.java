package com.starbooks.backend.starline.controller;

import com.starbooks.backend.common.ApiResponse;
import com.starbooks.backend.config.CustomUserDetails;
import com.starbooks.backend.starline.dto.request.StarlineCoordRequest;
import com.starbooks.backend.starline.dto.response.StarlineCoordResponse;
import com.starbooks.backend.starline.service.StarlineCoordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/starline")
@RequiredArgsConstructor
public class StarlineCoordController {

    private final StarlineCoordService starlineCoordService;

    /**
     * 특정 연도의 별자리 선 좌표 조회
     */
    @GetMapping("/yearly/{year}")
    public ResponseEntity<ApiResponse<List<StarlineCoordResponse>>> getYearlyStarlineCoords(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable int year) {

        Long userId = userDetails.getUserId();
        log.info("🔍 Fetching yearly starline data for userId={}, year={}", userId, year);

        List<StarlineCoordResponse> responseList = starlineCoordService.getYearlyStarlineCoords(userId, year);
        return ResponseEntity.ok(ApiResponse.createSuccess(responseList, "연도별 별자리 선 조회 성공"));
    }

    /**
     * 특정 연도/월의 별자리 선 좌표 조회
     */
    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<ApiResponse<List<StarlineCoordResponse>>> getMonthlyStarlineCoords(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable int year,
            @PathVariable int month) {

        Long userId = userDetails.getUserId();
        log.info("🔍 Fetching monthly starline data for userId={}, year={}, month={}", userId, year, month);

        List<StarlineCoordResponse> responseList = starlineCoordService.getMonthlyStarlineCoords(userId, year, month);
        return ResponseEntity.ok(ApiResponse.createSuccess(responseList, "월별 별자리 선 조회 성공"));
    }

    /**
     * 특정 월의 기존 데이터를 삭제 후 새로운 데이터를 추가
     */
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<Void>> updateStarlineCoords(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid List<StarlineCoordRequest> starlineCoordRequests) {

        Long userId = userDetails.getUserId();
        log.info("📝 Updating starline data for userId={}, requestSize={}", userId, starlineCoordRequests.size());

        // 요청 데이터 처리
        starlineCoordService.updateStarlineCoords(userId, starlineCoordRequests);
        return ResponseEntity.ok(ApiResponse.createSuccess(null, "별자리 선 업데이트 성공"));
    }
}
