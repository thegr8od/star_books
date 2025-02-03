package com.starbooks.backend.diary.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record DiaryCreateRequest(
        @NotBlank
        String title,

        @NotBlank
        String content,

        @NotEmpty
        List<EmotionRequest> emotions,
        List<String> hashtags,
        List<MultipartFile> images
) {}

