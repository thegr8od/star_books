package com.starbooks.backend.user.service;

import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    private final StringRedisTemplate redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    private static final String REFRESH_TOKEN_PREFIX = "refreshToken:";
    private static final String BLACKLIST_PREFIX = "blacklist:";

    @Override
    public String generateAccessToken(User user) {
        return jwtTokenProvider.generateAccessToken(user);
    }

    @Override
    public String generateRefreshToken(User user) {
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);
        long expirationMillis = jwtTokenProvider.getRefreshTokenExpiration();
        saveRefreshToken(user.getEmail(), refreshToken, expirationMillis);
        return refreshToken;
    }

    @Override
    public ResponseRefreshTokenDTO refreshToken(String refreshToken) {
        String email = jwtTokenProvider.getUserEmail(refreshToken);

        // 이메일로 사용자 정보 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (validateRefreshToken(email, refreshToken) && !isRefreshTokenBlacklisted(refreshToken)) {
            String newAccessToken = generateAccessToken(user);
            return new ResponseRefreshTokenDTO(newAccessToken, generateRefreshToken(user));
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
