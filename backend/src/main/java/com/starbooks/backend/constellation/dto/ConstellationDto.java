package com.starbooks.backend.constellation.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConstellationDto {
    private Long constellationId;
    private Long userId;
    private LocalDateTime createdAt;
    private List<ConstellationLineDto> lines;
}
