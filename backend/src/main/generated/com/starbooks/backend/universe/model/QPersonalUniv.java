package com.starbooks.backend.universe.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPersonalUniv is a Querydsl query type for PersonalUniv
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPersonalUniv extends EntityPathBase<PersonalUniv> {

    private static final long serialVersionUID = 1278882711L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPersonalUniv personalUniv = new QPersonalUniv("personalUniv");

    public final com.starbooks.backend.diary.model.QDiaryEmotion diaryEmotion;

    public final NumberPath<Long> universeId = createNumber("universeId", Long.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Float> xCoord = createNumber("xCoord", Float.class);

    public final NumberPath<Float> yCoord = createNumber("yCoord", Float.class);

    public QPersonalUniv(String variable) {
        this(PersonalUniv.class, forVariable(variable), INITS);
    }

    public QPersonalUniv(Path<? extends PersonalUniv> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPersonalUniv(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPersonalUniv(PathMetadata metadata, PathInits inits) {
        this(PersonalUniv.class, metadata, inits);
    }

    public QPersonalUniv(Class<? extends PersonalUniv> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.diaryEmotion = inits.isInitialized("diaryEmotion") ? new com.starbooks.backend.diary.model.QDiaryEmotion(forProperty("diaryEmotion"), inits.get("diaryEmotion")) : null;
    }

}

