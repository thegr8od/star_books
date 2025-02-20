package com.starbooks.backend.diary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Getter
@Data
@AllArgsConstructor
public class DiaryEmotionDTO {
    private Long id;
    private Float xValue;
    private Float yValue;
    private Long userId;  // 추가된 필드
}
