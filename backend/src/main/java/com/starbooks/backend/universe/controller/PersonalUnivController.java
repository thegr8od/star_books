package com.starbooks.backend.universe.controller;

import com.starbooks.backend.common.ApiResponse;
import com.starbooks.backend.common.ErrorCode;
import com.starbooks.backend.universe.dto.request.RequestPersonalUnivDTO;
import com.starbooks.backend.universe.dto.response.ResponsePersonalUnivDTO;
import com.starbooks.backend.universe.service.PersonalUnivService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("api/universe")
@RequiredArgsConstructor
public class PersonalUnivController {

    private final PersonalUnivService personalUnivService;

    // CREATE
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createPersonalUniv(@RequestBody RequestPersonalUnivDTO requestDTO) {
        log.info("📌 [DEBUG] PersonalUnivController - 받은 요청 데이터: diaryEmotionId={}, logMonth={}, xCoord={}, yCoord={}",
                requestDTO.getDiaryEmotionId(), requestDTO.getLogMonth(), requestDTO.getXCoord(), requestDTO.getYCoord());

        try {
            ResponsePersonalUnivDTO responseDTO = personalUnivService.createPersonalUniv(requestDTO);
            return ResponseEntity.ok(ApiResponse.createSuccess(responseDTO, "개인 유니버스 생성 성공"));
        } catch (Exception e) {
            log.error("❌ 개인 유니버스 생성 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.UNIVERSE_SAVE_FAILED));
        }
    }


    // READ
    @GetMapping("/{universeId}")
    public ResponseEntity<ApiResponse<?>> getPersonalUniv(@PathVariable Long universeId) {
        try {
            ResponsePersonalUnivDTO responseDTO = personalUnivService.getPersonalUniv(universeId);
            if (responseDTO == null) {
                return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.UNIVERSE_NOT_FOUND));
            }
            return ResponseEntity.ok(ApiResponse.createSuccess(responseDTO, "개인 유니버스 조회 성공"));
        } catch (Exception e) {
            log.error("개인 유니버스 조회 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.UNIVERSE_NOT_FOUND));
        }
    }

    // UPDATE
    @PutMapping("/{universeId}")
    public ResponseEntity<ApiResponse<?>> updatePersonalUniv(@PathVariable Long universeId,
                                                             @RequestBody RequestPersonalUnivDTO requestDTO) {
        try {
            ResponsePersonalUnivDTO responseDTO = personalUnivService.updatePersonalUniv(universeId, requestDTO);
            if (responseDTO == null) {
                return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.UNIVERSE_NOT_FOUND));
            }
            return ResponseEntity.ok(ApiResponse.createSuccess(responseDTO, "개인 유니버스 수정 성공"));
        } catch (Exception e) {
            log.error("개인 유니버스 수정 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.UNIVERSE_UPDATE_FAILED));
        }
    }

    // DELETE
    @DeleteMapping("/{universeId}")
    public ResponseEntity<ApiResponse<?>> deletePersonalUniv(@PathVariable Long universeId) {
        try {
            personalUnivService.deletePersonalUniv(universeId);
            return ResponseEntity.ok(ApiResponse.createSuccessWithNoContent("개인 유니버스 삭제 성공"));
        } catch (Exception e) {
            log.error("개인 유니버스 삭제 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.createError(ErrorCode.UNIVERSE_DELETE_FAILED));
        }
    }
}
