package com.starbooks.backend.diary.controller;

//import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
//import com.starbooks.backend.diary.dto.request.DiaryHashtagRequest;
import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
import com.starbooks.backend.diary.dto.request.DiaryHashtagRequest;
import com.starbooks.backend.diary.dto.response.DiaryResponse;
import com.starbooks.backend.emotion.model.EmotionPoint;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.diary.service.DiaryService;
import com.starbooks.backend.emotion.service.EmotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;
    private final EmotionService emotionService;

    /**
     * 1️⃣ 빈 다이어리 생성 (버튼 클릭 시)
     */
    @PostMapping("/create")
    public ResponseEntity<DiaryResponse> createEmptyDiary(@AuthenticationPrincipal User user) {
        DiaryResponse response = diaryService.createEmptyDiary(user);
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
     * 4️⃣ 내용 입력 및 저장
     */
    @PostMapping("/{diaryId}/content")
    public ResponseEntity<Void> addContent(
            @PathVariable Long diaryId,
            @RequestBody @Valid DiaryContentRequest request) {
        diaryService.addContentAndImages(diaryId, request, request.getImageUrls());
        return ResponseEntity.ok().build();
    }


    /**
     * 5. 내용 및 제목 수정
     */
    @PutMapping("/{diaryId}/content")
    public ResponseEntity<DiaryResponse> updateContent(
            @PathVariable Long diaryId,
            @RequestBody @Valid DiaryContentRequest request) {
        DiaryResponse response = diaryService.updateDiaryContent(diaryId, request);
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
    @GetMapping("/year/{year}")
    public ResponseEntity<List<DiaryResponse>> getDiariesByYear(
            @AuthenticationPrincipal User user,
            @PathVariable int year) {
        List<DiaryResponse> responses = diaryService.getDiariesByYear(user, year);
        return ResponseEntity.ok(responses);
    }

    /**
     * 월별 다이어리 조회
     * 예시: GET /api/diary/year/2025/month/3
     */
    @GetMapping("/year/{year}/month/{month}")
    public ResponseEntity<List<DiaryResponse>> getDiariesByMonth(
            @AuthenticationPrincipal User user,
            @PathVariable int year,
            @PathVariable int month) {
        List<DiaryResponse> responses = diaryService.getDiariesByMonth(user, year, month);
        return ResponseEntity.ok(responses);
    }

}
