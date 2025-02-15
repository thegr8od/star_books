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


    @OneToOne(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)  // List에서 단일 관계로 변경
    private DiaryImage image;  // List<DiaryImage>에서 DiaryImage로 변경

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
    public void setImage(DiaryImage image) {  // setImages에서 setImage로 변경
        this.image = image;
        if (image != null) {
            image.setDiary(this);
        }
    }

    public void addHashtag(DiaryHashtag hashtag) {
        hashtags.add(hashtag);
        hashtag.setDiary(this);
    }

    public enum HashtagType {
        // 긍정적인 감정 (Positive)
        행복한, 기쁜, 만족스러운, 신나는, 감동적인,
        설레는, 평온한, 차분한, 편안한, 후련한,

        // 부정적인 감정 (Negative)
        불안한, 초조한, 화난, 짜증나는, 답답한,
        속상한, 슬픈, 우울한, 지친, 무기력한,

        // 중립적인 감정 (Neutral)
        그저그런, 담담한, 멍한, 고민되는, 조용한,
        느긋한, 궁금한, 심심한, 무심한, 졸린;
    }
}