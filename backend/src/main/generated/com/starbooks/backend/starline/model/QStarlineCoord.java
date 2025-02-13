package com.starbooks.backend.starline.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QStarlineCoord is a Querydsl query type for StarlineCoord
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStarlineCoord extends EntityPathBase<StarlineCoord> {

    private static final long serialVersionUID = 2138826815L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QStarlineCoord starlineCoord = new QStarlineCoord("starlineCoord");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final com.starbooks.backend.diary.model.QDiaryEmotion diaryEmotionEnd;

    public final com.starbooks.backend.diary.model.QDiaryEmotion diaryEmotionStart;

    public final NumberPath<Long> starlineCoordId = createNumber("starlineCoordId", Long.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public QStarlineCoord(String variable) {
        this(StarlineCoord.class, forVariable(variable), INITS);
    }

    public QStarlineCoord(Path<? extends StarlineCoord> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QStarlineCoord(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QStarlineCoord(PathMetadata metadata, PathInits inits) {
        this(StarlineCoord.class, metadata, inits);
    }

    public QStarlineCoord(Class<? extends StarlineCoord> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.diaryEmotionEnd = inits.isInitialized("diaryEmotionEnd") ? new com.starbooks.backend.diary.model.QDiaryEmotion(forProperty("diaryEmotionEnd"), inits.get("diaryEmotionEnd")) : null;
        this.diaryEmotionStart = inits.isInitialized("diaryEmotionStart") ? new com.starbooks.backend.diary.model.QDiaryEmotion(forProperty("diaryEmotionStart"), inits.get("diaryEmotionStart")) : null;
    }

}

