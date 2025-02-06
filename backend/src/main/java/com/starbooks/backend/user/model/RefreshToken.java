package com.starbooks.backend.user.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@RedisHash(value = "refreshToken", timeToLive = 1209600) // 14일
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @Id
    private String id;  // 토큰 값 자체를 ID로 사용

    @Indexed
    private String userEmail;
    private Long expiration;

    public static RefreshToken from(String token, String userEmail, Long expiration) {
        return new RefreshToken(token, userEmail, expiration);
    }
}