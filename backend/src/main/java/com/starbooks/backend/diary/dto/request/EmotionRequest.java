package com.starbooks.backend.diary.dto.request;

import lombok.Getter;


public record EmotionRequest(
        Float xValue,
        Float yValue
) {
}
