package com.starbooks.backend.universe.controller;

import com.starbooks.backend.common.ApiResponse;
import com.starbooks.backend.common.ErrorCode;
import com.starbooks.backend.config.CustomUserDetails;
import com.starbooks.backend.universe.dto.request.RequestPersonalUnivDTO;
import com.starbooks.backend.universe.dto.response.ResponsePersonalUnivDTO;
import com.starbooks.backend.universe.service.PersonalUnivService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("api/universe")
@RequiredArgsConstructor
public class PersonalUnivController {

    private final PersonalUnivService personalUnivService;

    // 유저의 월별 Personal Univ 조회
    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<ApiResponse<?>> getMonthlyPersonalUniv(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                 @PathVariable int year,
                                                                 @PathVariable int month) {
        Long userId = userDetails.getUserId();  // ✅ userId 가져오기

        log.info("📅 Fetching monthly personal universe data for userId={} in {}/{}", userId, year, month);

        List<ResponsePersonalUnivDTO> responseList = personalUnivService.getMonthlyPersonalUniv(userId, year, month);
        return ResponseEntity.ok(ApiResponse.createSuccess(responseList, "월별 개인 유니버스 데이터 조회 성공"));
    }


    // 유저의 연도별 Personal Univ 조회
    @GetMapping("/yearly/{year}")
    public ResponseEntity<ApiResponse<?>> getYearlyPersonalUniv(
            @AuthenticationPrincipal CustomUserDetails userDetails,  // ✅ CustomUserDetails 사용
            @PathVariable int year) {

        Long userId = userDetails.getUserId();  // ✅ userId 가져오기

        log.info("🔍 Fetching yearly data for userId={}", userId);
        List<ResponsePersonalUnivDTO> responseList = personalUnivService.getYearlyPersonalUniv(userId, year);
        return ResponseEntity.ok(ApiResponse.createSuccess(responseList, "연도별 개인 유니버스 데이터 조회 성공"));
    }

    // 유저의 별자리 정보 업데이트
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<ResponsePersonalUnivDTO>>> saveOrUpdatePersonalUnivs(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody List<RequestPersonalUnivDTO> requestList) {

        Long userId = userDetails.getUserId();
        List<ResponsePersonalUnivDTO> responseList = personalUnivService.saveOrUpdatePersonalUnivs(userId, requestList);

        return ResponseEntity.ok(ApiResponse.createSuccess(responseList, "좌표 저장/업데이트 완료"));
    }



    // 유저의 특정 Personal Univ 조회
    @GetMapping("/{universeId}")
    public ResponseEntity<ApiResponse<?>> getPersonalUniv(@AuthenticationPrincipal Long userId,
                                                          @PathVariable Long universeId) {
        try {
            ResponsePersonalUnivDTO responseDTO = personalUnivService.getPersonalUniv(userId, universeId);
            if (responseDTO == null) {
                return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.UNIVERSE_NOT_FOUND));
            }
            return ResponseEntity.ok(ApiResponse.createSuccess(responseDTO, "개인 유니버스 조회 성공"));
        } catch (Exception e) {
            log.error("개인 유니버스 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.UNIVERSE_NOT_FOUND));
        }
    }
}