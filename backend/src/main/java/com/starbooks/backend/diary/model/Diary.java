package com.starbooks.backend.diary.model;

import com.starbooks.backend.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.xml.crypto.dsig.spec.HMACParameterSpec;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "diary")
@Getter

@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Diary {

    @Id
    @Column(name = "diary_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long diaryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    private DiaryContent content;

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiaryEmotion> emotions = new ArrayList<>();

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiaryHashtag> hashtags = new ArrayList<>();


    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiaryImage> images = new ArrayList<>();

    private LocalDateTime createdAt;

    @Builder
    public Diary(User user, LocalDateTime createdAt) {
        this.user = user;
        this.createdAt = createdAt;
    }

    // 연관 관계 편의 메서드
    public void setContent(DiaryContent content) {
        this.content = content;
        content.setDiary(this);
    }

    public void addEmotion(DiaryEmotion emotion) {
        emotions.add(emotion);
        emotion.setDiary(this);
    }

    // Diary 클래스 내부
    public void setImages(List<DiaryImage> images) {
        this.images = images;
        // 양방향 관계 설정 (선택 사항)
        images.forEach(image -> image.setDiary(this));
    }

    public void addHashtag(DiaryHashtag hashtag) {
        hashtags.add(hashtag);
        hashtag.setDiary(this);
    }

    public enum HashtagType {
        기쁨, 슬픔, 화남, 혼란스러움, 피곤함
    }
}