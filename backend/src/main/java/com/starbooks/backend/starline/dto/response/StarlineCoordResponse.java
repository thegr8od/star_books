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
    private Long starlineCoordId;
    private Long startEmotionId;
    private Long endEmotionId;
    private int year;
    private int month;
    private int day;

    /**
     * StarlineCoord 엔티티를 DTO로 변환하는 메서드
     */
    public static StarlineCoordResponse fromEntity(StarlineCoord starlineCoord) {
        return StarlineCoordResponse.builder()
                .starlineCoordId(starlineCoord.getStarlineCoordId())  // ✅ getId()로 변경
                .startEmotionId(starlineCoord.getStartEmotionId())  // ✅ 필드명 맞춤
                .endEmotionId(starlineCoord.getEndEmotionId())  // ✅ 필드명 맞춤
                .year(starlineCoord.getYear())
                .month(starlineCoord.getMonth())
                .build();
    }
}
