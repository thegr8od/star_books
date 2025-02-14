package com.starbooks.backend.starline.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QStarlineCoord is a Querydsl query type for StarlineCoord
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QStarlineCoord extends EntityPathBase<StarlineCoord> {

    private static final long serialVersionUID = 2138826815L;

    public static final QStarlineCoord starlineCoord = new QStarlineCoord("starlineCoord");

    public final NumberPath<Long> endEmotionId = createNumber("endEmotionId", Long.class);

    public final NumberPath<Integer> month = createNumber("month", Integer.class);

    public final NumberPath<Long> starlineCoordId = createNumber("starlineCoordId", Long.class);

    public final NumberPath<Long> startEmotionId = createNumber("startEmotionId", Long.class);

    public final NumberPath<Integer> year = createNumber("year", Integer.class);

    public QStarlineCoord(String variable) {
        super(StarlineCoord.class, forVariable(variable));
    }

    public QStarlineCoord(Path<? extends StarlineCoord> path) {
        super(path.getType(), path.getMetadata());
    }

    public QStarlineCoord(PathMetadata metadata) {
        super(StarlineCoord.class, metadata);
    }

}

