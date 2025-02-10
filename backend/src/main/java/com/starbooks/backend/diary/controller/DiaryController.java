package com.starbooks.backend.diary.controller;

import com.starbooks.backend.diary.dto.request.DiaryCreateRequest;
import com.starbooks.backend.diary.dto.response.DiaryResponse;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.diary.service.DiaryService;
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

    @PostMapping
    public ResponseEntity<DiaryResponse> createDiary(
            @Valid @RequestBody DiaryCreateRequest request,
            @AuthenticationPrincipal User user) {
        DiaryResponse response = diaryService.createDiary(request, user);
        return ResponseEntity.created(URI.create("/api/diary/" + response.diaryId()))
                .body(response);
    }

    @GetMapping("/{diaryId}")
    public ResponseEntity<DiaryResponse> getDiary(@PathVariable Long diaryId) {
        return ResponseEntity.ok(diaryService.getDiary(diaryId));
    }

    @DeleteMapping("/{diaryId}")
    public ResponseEntity<Void> deleteDiary(@PathVariable Long diaryId) {
        diaryService.deleteDiary(diaryId);
        return ResponseEntity.noContent().build();
    }
}
