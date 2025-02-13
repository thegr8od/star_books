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
        List<HashtagType> hashtags, // ✅ String → Enum 타입 유지
        List<String> imageUrls,
        LocalDateTime createdAt
) {
    public static DiaryResponse from(Diary diary) {
        return new DiaryResponse(
                diary.getDiaryId(),
                diary.getContent().getTitle(),
                diary.getContent().getContent(),
                diary.getEmotions().stream()
                        .map(e -> new EmotionResponse(e.getXValue(), e.getYValue()))
                        .toList(),
                diary.getHashtags().stream()
                        .map(DiaryHashtag::getHashtag) // ✅ Enum 값 유지
                        .toList(),
                diary.getImages().stream()
                        .map(DiaryImage::getSaveFilePath)
                        .toList(),
                diary.getCreatedAt()
        );
    }
}
