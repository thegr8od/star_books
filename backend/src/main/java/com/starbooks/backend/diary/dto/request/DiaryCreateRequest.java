package com.starbooks.backend.diary.dto.request;


import com.starbooks.backend.diary.model.Diary;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
        @NotNull
        List<Diary.HashtagType> hashtags,
        List<MultipartFile> images
) {}

