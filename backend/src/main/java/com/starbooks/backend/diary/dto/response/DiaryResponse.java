package com.starbooks.backend.diary.dto.response;

import com.starbooks.backend.diary.model.Diary;
import com.starbooks.backend.diary.model.DiaryHashtag;
import com.starbooks.backend.diary.model.Diary.HashtagType;
import lombok.Getter;

// DiaryResponse 클래스 수정
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record DiaryResponse(
        Long diaryId,
        String title,
        String content,
        List<EmotionResponse> emotions,
        List<Diary.HashtagType> hashtags,
        String imageUrl,
        LocalDate diaryDate,
        LocalDateTime createdAt
) {
    public static DiaryResponse from(Diary diary) {
        String title = diary.getContent() != null ? diary.getContent().getTitle() : "";
        String content = diary.getContent() != null ? diary.getContent().getContent() : "";

        List<EmotionResponse> emotions = diary.getEmotions() != null
                ? diary.getEmotions().stream()
                .map(e -> new EmotionResponse(e.getXValue(), e.getYValue()))
                .toList()
                : List.of();

        List<Diary.HashtagType> hashtags = diary.getHashtags() != null
                ? diary.getHashtags().stream().map(DiaryHashtag::getHashtag).toList()
                : List.of();

        String imageUrl = diary.getImage() != null ? diary.getImage().getImgurl() : null;

        return new DiaryResponse(
                diary.getDiaryId(),
                title,
                content,
                emotions,
                hashtags,
                imageUrl,
                diary.getDiaryDate(),
                diary.getCreatedAt()
        );
    }
}
