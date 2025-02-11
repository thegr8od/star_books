package com.starbooks.backend.starline.model;

import com.starbooks.backend.diary.model.DiaryEmotion;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 별자리 선 정보를 저장하는 엔티티
 */
@Entity
@Table(name = "starline_coord")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StarlineCoord {

    /** 선 ID (기본 키, 자동 증가) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long starlineCoordId;

    /** 시작 감정 좌표 (외래키) */
    @ManyToOne
    @JoinColumn(name = "diary_emotion_id_start", nullable = false)
    private DiaryEmotion diaryEmotionStart;

    /** 끝 감정 좌표 (외래키) */
    @ManyToOne
    @JoinColumn(name = "diary_emotion_id_end", nullable = false)
    private DiaryEmotion diaryEmotionEnd;

    /** 생성 일시 (수정 불가) */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 업데이트 일시 (수정 시 변경) */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * 엔티티가 DB에 저장되기 전 실행되는 메서드
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * 엔티티가 업데이트될 때 자동으로 updatedAt 변경
     */
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
