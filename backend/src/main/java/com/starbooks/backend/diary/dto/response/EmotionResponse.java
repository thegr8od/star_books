package com.starbooks.backend.diary.dto.response;

import com.starbooks.backend.diary.model.DiaryEmotion;

public record EmotionResponse(
        Float xValue,
        Float yValue
) {
    public static EmotionResponse from(DiaryEmotion emotion) {
        return new EmotionResponse(
                emotion.getXValue(),
                emotion.getYValue()
        );
    }
}
