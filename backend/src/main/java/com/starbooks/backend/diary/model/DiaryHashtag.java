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
    @Column(name="diary_hashtag_id")
    private Long hashtagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HashtagType hashtag;

    @Builder
    public DiaryHashtag(Diary diary ,HashtagType hashtag) {
        this.diary = diary;
        this.hashtag = hashtag;
    }
}