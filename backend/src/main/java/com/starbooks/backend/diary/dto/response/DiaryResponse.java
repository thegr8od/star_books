package com.starbooks.backend.diary.dto.response;

import com.starbooks.backend.diary.model.Diary;
import com.starbooks.backend.diary.model.DiaryImage;
import com.starbooks.backend.diary.model.DiaryHashtag;
import com.starbooks.backend.diary.model.Diary.HashtagType;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

public record DiaryResponse(
        Long diaryId,
        String title,
        String content,
        List<EmotionResponse> emotions,
        List<HashtagType> hashtags,
        List<String> imageUrls,
        LocalDateTime createdAt
) {
    public static DiaryResponse from(Diary diary) {
        String title = "";
        String content = "";
        if (diary.getContent() != null) {
            title = diary.getContent().getTitle();
            content = diary.getContent().getContent();
        }

        List<EmotionResponse> emotions = diary.getEmotions() != null
                ? diary.getEmotions().stream()
                .map(e -> new EmotionResponse(e.getXValue(), e.getYValue()))
                .toList()
                : List.of();

        List<HashtagType> hashtags = diary.getHashtags() != null
                ? diary.getHashtags().stream()
                .map(DiaryHashtag::getHashtag)
                .toList()
                : List.of();

        List<String> imageUrls = diary.getImages() != null
                ? diary.getImages().stream()
                .map(DiaryImage::getImgurl)
                .toList()
                : List.of();

        return new DiaryResponse(
                diary.getDiaryId(),
                title,
                content,
                emotions,
                hashtags,
                imageUrls,
                diary.getCreatedAt()
        );
    }
}
