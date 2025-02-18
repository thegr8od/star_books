package com.starbooks.backend.diary.model;
import com.starbooks.backend.diary.model.Diary.HashtagType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "diary_hashtag")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DiaryHashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diary_hashtag_id")
    private Long diaryHashtagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;

    @Enumerated(EnumType.STRING)
    @Column(length = 20) // 최대 길이에 맞게 조정 (예: "만족스러운" 등)
    private Diary.HashtagType hashtag;

    @Builder
    public DiaryHashtag(Diary diary, Diary.HashtagType hashtag) {
        this.diary = diary;
        this.hashtag = hashtag;
    }
}
