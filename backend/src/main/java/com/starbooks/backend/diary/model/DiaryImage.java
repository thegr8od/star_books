package com.starbooks.backend.diary.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "diary_image")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DiaryImage {

    @Id
    @Column(name="diary_image_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id", nullable = false)
    private Diary diary;

    @Column(name = "save_file_path", nullable = false, length = 255)
    private String Imgurl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public DiaryImage(Diary diary, String Imgurl) {
        this.diary = diary;
        this.Imgurl = Imgurl;
    }
}
