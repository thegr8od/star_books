package com.starbooks.backend.starline.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * 사용자가 별자리 선을 생성할 때 요청하는 DTO
 */
@Getter
@Setter
public class StarlineCoordRequest {

    /** 시작 감정 좌표 ID */
    @NotNull
    private Long startEmotionId;

    /** 끝 감정 좌표 ID */
    @NotNull
    private Long endEmotionId;
}
