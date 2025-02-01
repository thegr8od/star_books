package com.starbooks.backend.user.service;

import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.starbooks.backend.user.model.RefreshToken;
import com.starbooks.backend.user.model.TokenBlacklist;
import com.starbooks.backend.user.repository.redis.RefreshTokenRepository;
import com.starbooks.backend.user.repository.redis.TokenBlacklistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenBlacklistRepository tokenBlacklistRepository;

    @Override
    public String generateAccessToken(String email) {
        return jwtTokenProvider.generateAccessToken(email);
    }

    @Override
    public String generateRefreshToken(String email) {
        String refreshToken = jwtTokenProvider.generateRefreshToken(email);
        saveRefreshToken(email, refreshToken);
        return refreshToken;
    }

    @Override
    public ResponseRefreshTokenDTO refreshToken(String refreshToken) {
        if (isRefreshTokenBlacklisted(refreshToken)) {
            return null;
        }
        if (jwtTokenProvider.validateToken(refreshToken)) {
            String userEmail = jwtTokenProvider.getUserEmail(refreshToken);
            RefreshToken storedToken = refreshTokenRepository.findById(userEmail).orElse(null);
            if (storedToken != null && storedToken.getToken().equals(refreshToken)) {
                refreshTokenRepository.deleteById(userEmail);

                String newAccessToken = jwtTokenProvider.generateAccessToken(userEmail);
                String newRefreshToken = jwtTokenProvider.generateRefreshToken(userEmail);

                return new ResponseRefreshTokenDTO(newAccessToken, newRefreshToken);
            }
        }
        return null;
    }

    @Override
    public void blacklistRefreshToken(String refreshToken) {
        tokenBlacklistRepository.save(new TokenBlacklist(refreshToken));
    }

    @Override
    public boolean isRefreshTokenBlacklisted(String refreshToken) {
        return tokenBlacklistRepository.existsById(refreshToken);
    }

    @Override
    public void invalidateAllUserTokens(String email) {
        List<RefreshToken> userTokens = refreshTokenRepository.findAllByUserEmail(email);
        for (RefreshToken token : userTokens) {
            blacklistRefreshToken(token.getToken());
            refreshTokenRepository.delete(token);
        }
    }

    private void saveRefreshToken(String userEmail, String refreshToken) {
        long expiration = jwtTokenProvider.getClaims(refreshToken).getExpiration().getTime();
        RefreshToken rt = new RefreshToken(userEmail, refreshToken, expiration);
        refreshTokenRepository.save(rt);
    }
}
