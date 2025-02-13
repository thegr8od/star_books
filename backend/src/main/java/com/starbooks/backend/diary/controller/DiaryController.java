package com.starbooks.backend.diary.controller;

//import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
//import com.starbooks.backend.diary.dto.request.DiaryHashtagRequest;
import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
import com.starbooks.backend.diary.dto.request.DiaryHashtagRequest;
import com.starbooks.backend.diary.dto.response.DiaryResponse;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.diary.service.DiaryService;
import com.starbooks.backend.emotion.service.EmotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

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
     * 2️⃣ 해시태그 입력
     */
    @PostMapping("/{diaryId}/hashtags")
    public ResponseEntity<Void> addHashtags(
            @PathVariable Long diaryId,
            @RequestBody @Valid DiaryHashtagRequest request) {
        diaryService.addHashtags(diaryId, request.getHashtags());
        return ResponseEntity.ok().build();
    }
//
//    /**
//     * 3️⃣ 다이어리 저장 + 감정 분석 요청
//     */
    @PostMapping("/{diaryId}/analyze")
    public ResponseEntity<Void> analyzeDiary(@PathVariable Long diaryId) {
        EmotionService.calculateWeightedPoint(diaryId);
        return ResponseEntity.ok().build();
    }

    /**
     * 4️⃣ 내용 입력 및 저장
     */
    @PostMapping("/{diaryId}/content")
    public ResponseEntity<Void> addContent(
            @PathVariable Long diaryId,
            @RequestBody @Valid DiaryContentRequest request) {
        diaryService.addContent(diaryId, request);
        return ResponseEntity.ok().build();
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
}
