package com.starbooks.backend.user.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTokenBlacklist is a Querydsl query type for TokenBlacklist
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTokenBlacklist extends EntityPathBase<TokenBlacklist> {

    private static final long serialVersionUID = 931169871L;

    public static final QTokenBlacklist tokenBlacklist = new QTokenBlacklist("tokenBlacklist");

    public final NumberPath<Long> expiration = createNumber("expiration", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath token = createString("token");

    public QTokenBlacklist(String variable) {
        super(TokenBlacklist.class, forVariable(variable));
    }

    public QTokenBlacklist(Path<? extends TokenBlacklist> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTokenBlacklist(PathMetadata metadata) {
        super(TokenBlacklist.class, metadata);
    }

}

