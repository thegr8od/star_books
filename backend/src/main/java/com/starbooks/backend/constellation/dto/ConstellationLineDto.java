package com.starbooks.backend.constellation.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConstellationLineDto {
    private Long lineId;
    private Long constellationId;
    private int startX;
    private int startY;
    private int endX;
    private int endY;
}
