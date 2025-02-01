package com.starbooks.backend.user.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("tokenBlacklist")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenBlacklist {
    @Id
    private String token;
}
