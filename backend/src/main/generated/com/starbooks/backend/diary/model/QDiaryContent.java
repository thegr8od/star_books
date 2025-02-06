package com.starbooks.backend.diary.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDiaryContent is a Querydsl query type for DiaryContent
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDiaryContent extends EntityPathBase<DiaryContent> {

    private static final long serialVersionUID = 591320643L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDiaryContent diaryContent = new QDiaryContent("diaryContent");

    public final StringPath content = createString("content");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final QDiary diary;

    public final NumberPath<Long> diaryContentId = createNumber("diaryContentId", Long.class);

    public final StringPath title = createString("title");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QDiaryContent(String variable) {
        this(DiaryContent.class, forVariable(variable), INITS);
    }

    public QDiaryContent(Path<? extends DiaryContent> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDiaryContent(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDiaryContent(PathMetadata metadata, PathInits inits) {
        this(DiaryContent.class, metadata, inits);
    }

    public QDiaryContent(Class<? extends DiaryContent> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.diary = inits.isInitialized("diary") ? new QDiary(forProperty("diary"), inits.get("diary")) : null;
    }

}

