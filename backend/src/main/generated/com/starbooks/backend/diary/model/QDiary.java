package com.starbooks.backend.diary.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDiary is a Querydsl query type for Diary
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDiary extends EntityPathBase<Diary> {

    private static final long serialVersionUID = 663611734L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDiary diary = new QDiary("diary");

    public final QDiaryContent content;

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> diaryId = createNumber("diaryId", Long.class);

    public final ListPath<DiaryEmotion, QDiaryEmotion> emotions = this.<DiaryEmotion, QDiaryEmotion>createList("emotions", DiaryEmotion.class, QDiaryEmotion.class, PathInits.DIRECT2);

    public final ListPath<DiaryHashtag, QDiaryHashtag> hashtags = this.<DiaryHashtag, QDiaryHashtag>createList("hashtags", DiaryHashtag.class, QDiaryHashtag.class, PathInits.DIRECT2);

    public final ListPath<DiaryImage, QDiaryImage> images = this.<DiaryImage, QDiaryImage>createList("images", DiaryImage.class, QDiaryImage.class, PathInits.DIRECT2);

    public final com.starbooks.backend.user.model.QUser user;

    public QDiary(String variable) {
        this(Diary.class, forVariable(variable), INITS);
    }

    public QDiary(Path<? extends Diary> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDiary(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDiary(PathMetadata metadata, PathInits inits) {
        this(Diary.class, metadata, inits);
    }

    public QDiary(Class<? extends Diary> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.content = inits.isInitialized("content") ? new QDiaryContent(forProperty("content"), inits.get("content")) : null;
        this.user = inits.isInitialized("user") ? new com.starbooks.backend.user.model.QUser(forProperty("user"), inits.get("user")) : null;
    }

}

