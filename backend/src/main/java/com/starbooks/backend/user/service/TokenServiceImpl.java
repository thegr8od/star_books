package com.starbooks.backend.user.service;

import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.user.dto.response.ResponseRefreshTokenDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final StringRedisTemplate redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    private static final String REFRESH_TOKEN_PREFIX = "refreshToken:";
    private static final String BLACKLIST_PREFIX = "blacklist:";

    @Override
    public String generateAccessToken(String email) {
        return jwtTokenProvider.generateAccessToken(email);
    }

    @Override
    public String generateRefreshToken(String email) {
        String refreshToken = jwtTokenProvider.generateRefreshToken(email);
        long expirationMillis = jwtTokenProvider.getRefreshTokenExpiration();
        saveRefreshToken(email, refreshToken, expirationMillis);
        return refreshToken;
    }

    @Override
    public ResponseRefreshTokenDTO refreshToken(String refreshToken) {
        String email = jwtTokenProvider.getUserEmail(refreshToken);
        if (validateRefreshToken(email, refreshToken) && !isRefreshTokenBlacklisted(refreshToken)) {
            String newAccessToken = generateAccessToken(email);
            return new ResponseRefreshTokenDTO(newAccessToken, generateRefreshToken(email));
        }
        throw new RuntimeException("Invalid or blacklisted refresh token");
    }

    @Override
    public void blacklistRefreshToken(String refreshToken) {
        long expirationMillis = jwtTokenProvider.getRefreshTokenExpiration();
        redisTemplate.opsForValue().set(BLACKLIST_PREFIX + refreshToken, "true", Duration.ofMillis(expirationMillis));
    }

    @Override
    public boolean isRefreshTokenBlacklisted(String refreshToken) {
        return redisTemplate.opsForValue().get(BLACKLIST_PREFIX + refreshToken) != null;
    }

    @Override
    public void invalidateAllUserTokens(String email) {
        redisTemplate.delete(REFRESH_TOKEN_PREFIX + email);
    }

    private void saveRefreshToken(String email, String refreshToken, long expirationMillis) {
        redisTemplate.opsForValue().set(REFRESH_TOKEN_PREFIX + email, refreshToken, Duration.ofMillis(expirationMillis));
    }

    private boolean validateRefreshToken(String email, String refreshToken) {
        String storedToken = redisTemplate.opsForValue().get(REFRESH_TOKEN_PREFIX + email);
        return storedToken != null && storedToken.equals(refreshToken);
    }
}
