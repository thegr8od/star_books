package com.starbooks.backend.starline.dto.response;

import com.starbooks.backend.starline.model.StarlineCoord;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * StarlineCoord 엔티티 데이터를 API 응답 형식으로 변환하는 DTO
 */
@Getter
@Builder
public class StarlineCoordResponse {
    /** 선 ID */
    private Long starlineCoordId;

    /** 시작 감정 좌표 ID */
    private Long startEmotionId;

    /** 끝 감정 좌표 ID */
    private Long endEmotionId;

    /** 생성 일시 */
    private LocalDateTime createdAt;

    /** 업데이트 일시 */
    private LocalDateTime updatedAt;

    /**
     * StarlineCoord 엔티티를 DTO로 변환하는 메서드
     */
    public static StarlineCoordResponse fromEntity(StarlineCoord starlineCoord) {
        return StarlineCoordResponse.builder()
                .starlineCoordId(starlineCoord.getStarlineCoordId())
                .startEmotionId(starlineCoord.getDiaryEmotionStart().getDiaryEmotionId())
                .endEmotionId(starlineCoord.getDiaryEmotionEnd().getDiaryEmotionId())
                .createdAt(starlineCoord.getCreatedAt())
                .updatedAt(starlineCoord.getUpdatedAt())
                .build();
    }
}
