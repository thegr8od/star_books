package com.starbooks.backend.diary.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "diary_content")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DiaryContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_content_id")
    private Long diaryContentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;

    private String title;
    private String content;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Builder
    public DiaryContent(String title, String content,Diary diary) {
        this.title = title;
        this.content = content;
        this.diary=diary;
    }
}
