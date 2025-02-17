package com.starbooks.backend.diary.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class HashtagStatsResponse {
    private String hashtagType;
    private Long usageCount;

    @Builder
    public HashtagStatsResponse(String hashtagType, Long usageCount) {
        this.hashtagType = hashtagType;
        this.usageCount = usageCount;
    }
}