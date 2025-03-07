package com.starbooks.backend.diary.controller;

//import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
//import com.starbooks.backend.diary.dto.request.DiaryHashtagRequest;
import com.starbooks.backend.common.service.S3Service;
import com.starbooks.backend.config.CustomUserDetails;
import com.starbooks.backend.diary.dto.DiaryEmotionDTO;
import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
import com.starbooks.backend.diary.dto.request.DiaryCreateRequest;
import com.starbooks.backend.diary.dto.request.DiaryHashtagRequest;
import com.starbooks.backend.diary.dto.response.DiaryResponse;
import com.starbooks.backend.diary.dto.response.HashtagStatsResponse;
import com.starbooks.backend.diary.model.DiaryEmotion;
import com.starbooks.backend.emotion.model.EmotionPoint;
import com.starbooks.backend.universe.model.PersonalUniv;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.diary.service.DiaryService;
import com.starbooks.backend.diary.model.Diary;
import com.starbooks.backend.emotion.service.EmotionService;
import io.jsonwebtoken.io.IOException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;
    private final EmotionService emotionService;
    private final S3Service s3Service;

    /**
     * 1️⃣ 빈 다이어리 생성 (버튼 클릭 시)
     */
    @PostMapping("/create")
    public ResponseEntity<DiaryResponse> createEmptyDiary(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid DiaryCreateRequest request) {
        Long userId = userDetails.getUserId();
        DiaryResponse response = diaryService.createEmptyDiary(userId, request.getDiaryDate());
        return ResponseEntity.created(URI.create("/api/diary/" + response.diaryId()))
                .body(response);
    }




    /**
     * 2️⃣ 해시태그 입력과 동시에 감정 분석 처리
     * 프론트엔드 Request 예시:
     * {
     *   "hashtags": ["행복한", "설레는", "기쁜"]
     * }
     */
    @PostMapping("/{diaryId}/hashtag")
    public ResponseEntity<EmotionPoint> addHashtagsAndAnalyzeEmotion(
            @PathVariable Long diaryId,
            @RequestBody @Valid DiaryHashtagRequest request) {
        EmotionPoint result = diaryService.addHashtagsAndAnalyzeEmotion(diaryId, request.getHashtags());
        return ResponseEntity.ok(result);
    }

    /**
     * 해시태그 삭제
     */
    @DeleteMapping("/{diaryId}/hashtag/{hashtagType}")
    public ResponseEntity<Void> removeHashtag(
            @PathVariable Long diaryId,
            @PathVariable Diary.HashtagType hashtagType) {
        diaryService.removeHashtag(diaryId, hashtagType);
        return ResponseEntity.noContent().build();
    }

    /**
     * Top 5 해시태그 조회
     */
    @GetMapping("/hashtags/top5")
    public ResponseEntity<List<HashtagStatsResponse>> getTop5Hashtags() {
        return ResponseEntity.ok(diaryService.getTop5Hashtags());
    }

    @GetMapping("/my-hashtags")
    public ResponseEntity<List<HashtagStatsResponse>> getMyHashtagStats(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserId();
        List<HashtagStatsResponse> stats = diaryService.getUserHashtagStats(userId);
        return ResponseEntity.ok(stats);
    }

    /**
     * 해시태그 통계 초기화 (관리자용)
     */
    @PostMapping("/hashtags/initialize")
    public ResponseEntity<Void> initializeHashtagStats() {
        diaryService.initializeHashtagStats();
        return ResponseEntity.ok().build();
    }


    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "파일이 비어있습니다."));
            }

            // 이미지 파일 검증
            if (!file.getContentType().startsWith("image")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "이미지 파일만 업로드 가능합니다."));
            }

            String imageUrl = s3Service.uploadFile(file);
            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));

        } catch (IOException e) {
            log.error("파일 업로드 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "파일 업로드에 실패했습니다: " + e.getMessage()));
        } catch (Exception e) {
            log.error("예상치 못한 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "서버 오류가 발생했습니다."));
        }
    }

    /**
     * 4️⃣ 내용 입력 및 저장
     */
    @PostMapping("/{diaryId}/content")
    public ResponseEntity<PersonalUniv> addContent(@PathVariable Long diaryId,
                                                   @RequestBody @Valid DiaryContentRequest request) {
        PersonalUniv personalUniv = diaryService.addContentAndImages(diaryId, request, request.getImageUrl());
        return ResponseEntity.ok(personalUniv);
    }


    @GetMapping("/emotion")
    public ResponseEntity<List<DiaryEmotionDTO>> getAllDiaryEmotions(@RequestParam LocalDate diaryDate) {
        List<DiaryEmotionDTO> emotions = diaryService.getAllDiaryEmotionsByDate(diaryDate);
        return ResponseEntity.ok(emotions);
    }

    /**
     * 5. 내용 및 제목 수정
     */
    @PutMapping("/{diaryId}/content")
    public ResponseEntity<DiaryResponse> updateContent(
            @PathVariable Long diaryId,
            @RequestBody @Valid DiaryContentRequest request) {
        DiaryResponse response = diaryService.updateDiaryContent(diaryId, request,request.getImageUrl());
        return ResponseEntity.ok(response);
    }

    /**
     * 다이어리 조회
     */
    @GetMapping("/{diaryId}")
    public ResponseEntity<DiaryResponse> getDiary(@PathVariable Long diaryId) {
        return ResponseEntity.ok(diaryService.getDiary(diaryId));
    }

    /**
     * 다이어리 삭제
     */
    @DeleteMapping("/{diaryId}")
    public ResponseEntity<Void> deleteDiary(@PathVariable Long diaryId) {
        diaryService.deleteDiary(diaryId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 년도별 다이어리 조회
     * 예시: GET /api/diary/year/2025
     */
//    @GetMapping("/year/{year}")
//    public ResponseEntity<List<DiaryResponse>> getDiariesByYear(
//            @AuthenticationPrincipal User user,
//            @PathVariable int year) {
//        List<DiaryResponse> responses = diaryService.getDiariesByYear(user, year);
//        return ResponseEntity.ok(responses);
//    }

    /**
     * 월별 다이어리 조회
     * 예시: GET /api/diary/year/2025/month/3
     */
    @GetMapping("/year/{year}/month/{month}")
    public ResponseEntity<List<DiaryResponse>> getDiariesByMonth(
            @AuthenticationPrincipal CustomUserDetails userDetails,  // CustomUserDetails로 변경
            @PathVariable int year,
            @PathVariable int month) {

        Long userId = userDetails.getUserId();  // userId 가져오기
        System.out.println("Authenticated User ID: " + userId);

        List<DiaryResponse> responses = diaryService.getDiariesByMonth(userId, year, month);
        return ResponseEntity.ok(responses);
    }


}
