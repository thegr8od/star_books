package com.starbooks.backend.diary.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "diary_content")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DiaryHashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="diary_content_id")
    private Long hashtagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Hashtag tag;

    @Builder
    public DiaryHashtag(Diary diary ,Hashtag tag) {
        this.tag = tag;
        this.diary = diary;
    }
}