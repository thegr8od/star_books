package com.starbooks.backend.diary.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "hashtag_stats")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HashtagStats {

    @Id
    @Enumerated(EnumType.STRING)
    @Column(name = "hashtag_type", length = 20)
    private Diary.HashtagType hashtagType;

    @Column(name = "usage_count")
    private Long usageCount;

    @Column(name = "last_updated_at")
    private LocalDateTime lastUpdatedAt;

    @PrePersist
    @PreUpdate
    protected void updateTimestamp() {
        lastUpdatedAt = LocalDateTime.now();
    }

    @Builder
    public HashtagStats(Diary.HashtagType hashtagType) {
        this.hashtagType = hashtagType;
        this.usageCount = 0L;
    }

    public void incrementCount() {
        this.usageCount++;
    }

    public void decrementCount() {
        if (this.usageCount > 0) {
            this.usageCount--;
        }
    }
}