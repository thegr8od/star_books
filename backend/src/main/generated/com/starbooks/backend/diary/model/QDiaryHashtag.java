package com.starbooks.backend.diary.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDiaryHashtag is a Querydsl query type for DiaryHashtag
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDiaryHashtag extends EntityPathBase<DiaryHashtag> {

    private static final long serialVersionUID = 337337750L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDiaryHashtag diaryHashtag = new QDiaryHashtag("diaryHashtag");

    public final QDiary diary;

    public final NumberPath<Long> hashtagId = createNumber("hashtagId", Long.class);

    public final QHashtag tag;

    public QDiaryHashtag(String variable) {
        this(DiaryHashtag.class, forVariable(variable), INITS);
    }

    public QDiaryHashtag(Path<? extends DiaryHashtag> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDiaryHashtag(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDiaryHashtag(PathMetadata metadata, PathInits inits) {
        this(DiaryHashtag.class, metadata, inits);
    }

    public QDiaryHashtag(Class<? extends DiaryHashtag> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.diary = inits.isInitialized("diary") ? new QDiary(forProperty("diary"), inits.get("diary")) : null;
        this.tag = inits.isInitialized("tag") ? new QHashtag(forProperty("tag")) : null;
    }

}

