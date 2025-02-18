package com.starbooks.backend.diary.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class HashtagStatsResponse {
    private String hashtagType;
    private Long usageCount;
    private int xValue;
    private int yValue;

    @Builder
    public HashtagStatsResponse(String hashtagType, Long usageCount, int xValue, int yValue) {
        this.hashtagType = hashtagType;
        this.usageCount = usageCount;
        this.xValue = xValue;
        this.yValue = yValue;
    }
}