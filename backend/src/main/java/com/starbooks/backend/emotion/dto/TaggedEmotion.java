package com.starbooks.backend.emotion.dto;

import lombok.Data;

@Data
public class TaggedEmotion {
    private String tagName;
    private double weight; // 사용자가 부여하는 가중치 (또는 중복 횟수 등)
}
