package com.starbooks.backend.diary.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDiaryEmotion is a Querydsl query type for DiaryEmotion
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDiaryEmotion extends EntityPathBase<DiaryEmotion> {

    private static final long serialVersionUID = -1984970203L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDiaryEmotion diaryEmotion = new QDiaryEmotion("diaryEmotion");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final QDiary diary;

    public final NumberPath<Long> diaryEmotionId = createNumber("diaryEmotionId", Long.class);

    public final NumberPath<Float> xValue = createNumber("xValue", Float.class);

    public final NumberPath<Float> yValue = createNumber("yValue", Float.class);

    public QDiaryEmotion(String variable) {
        this(DiaryEmotion.class, forVariable(variable), INITS);
    }

    public QDiaryEmotion(Path<? extends DiaryEmotion> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDiaryEmotion(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDiaryEmotion(PathMetadata metadata, PathInits inits) {
        this(DiaryEmotion.class, metadata, inits);
    }

    public QDiaryEmotion(Class<? extends DiaryEmotion> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.diary = inits.isInitialized("diary") ? new QDiary(forProperty("diary"), inits.get("diary")) : null;
    }

}

