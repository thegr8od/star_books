package com.starbooks.backend.diary.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class DiaryContentRequest {

    @NotBlank(message = "제목은 비어 있을 수 없습니다.")
    private String title;

    @NotBlank(message = "제목은 비어 있을 수 없습니다.")
    private String content;

    private List<String> imageUrls; // 이미지 URL 리스트 추가
}