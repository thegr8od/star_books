package com.starbooks.backend.diary.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "diary_emotion")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DiaryEmotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_emotion_id")
    private Long diaryEmotionId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    @JsonIgnore
    private Diary diary;

    private Float xValue;
    private Float yValue;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @Builder
    public DiaryEmotion(Diary diary, Float xValue, Float yValue) {
        this.xValue = xValue;
        this.yValue = yValue;
        this.diary = diary;
    }


}
