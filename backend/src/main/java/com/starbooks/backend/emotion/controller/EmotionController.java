package com.starbooks.backend.emotion.controller;

import com.starbooks.backend.emotion.model.EmotionPoint;
import com.starbooks.backend.emotion.service.EmotionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emotion")
public class EmotionController {

    private final EmotionService emotionService;

    public EmotionController(EmotionService emotionService) {
        this.emotionService = emotionService;
    }

    /**
     * 요청 Body는 해시태그(String)의 리스트로 받습니다.
     * 예: ["행복한", "신나는", "담담한"]
     */
    @PostMapping("/calculate")
    public ResponseEntity<EmotionPoint> calculate(@RequestBody List<String> tags) {
        EmotionPoint result = emotionService.calculateWeightedPoint(tags);
        return ResponseEntity.ok(result);
    }
}
