package com.starbooks.backend.diary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DiaryEmotionDTO {
    private Long id;
    private Float xValue;
    private Float yValue;
}