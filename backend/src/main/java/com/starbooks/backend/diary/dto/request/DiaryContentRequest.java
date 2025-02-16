package com.starbooks.backend.diary.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DiaryContentRequest {
    @NotBlank(message = "제목은 비어 있을 수 없습니다.")
    private String title;

    @NotBlank(message = "내용은 비어 있을 수 없습니다.")
    private String content;

    private String imageUrl; // 단일 이미지 URL
}