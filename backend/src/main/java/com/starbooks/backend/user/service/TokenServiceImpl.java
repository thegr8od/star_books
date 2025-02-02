package com.starbooks.backend.user.service;

import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.starbooks.backend.user.model.RefreshToken;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.RefreshTokenRepository;
import com.starbooks.backend.user.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Override
    public String generateAccessToken(String email) {
        return jwtTokenProvider.generateAccessToken(email);
    }

    @Override
    @Transactional
    public String generateRefreshToken(String email) {
        String refreshToken = jwtTokenProvider.generateRefreshToken(email);

        // 기존 리프레시 토큰 삭제
        refreshTokenRepository.findByUser_UserId(userRepository.findByEmail(email)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                        .getUserId())
                .ifPresent(refreshTokenRepository::delete);

        // 새로운 리프레시 토큰 저장
        saveRefreshToken(email, refreshToken);
        return refreshToken;
    }

    @Override
    @Transactional
    public ResponseRefreshTokenDTO refreshToken(String refreshToken) {
        if (jwtTokenProvider.validateToken(refreshToken)) {
            String userEmail = jwtTokenProvider.getUserEmail(refreshToken);
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                refreshTokenRepository.deleteByUser_UserId(user.getUserId());

                String newAccessToken = jwtTokenProvider.generateAccessToken(userEmail);
                String newRefreshToken = jwtTokenProvider.generateRefreshToken(userEmail);

                RefreshToken rt = new RefreshToken(null, user, newRefreshToken, System.currentTimeMillis() + jwtTokenProvider.getRefreshTokenExpiration());
                refreshTokenRepository.save(rt);

                return new ResponseRefreshTokenDTO(newAccessToken, newRefreshToken);
            }
        }
        return null;
    }

    @Override
    @Transactional
    public void invalidateAllUserTokens(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        userOpt.ifPresent(user -> refreshTokenRepository.deleteByUser_UserId(user.getUserId()));
    }

    @Override
    public void blacklistRefreshToken(String refreshToken) {
        // RefreshToken 삭제 로직
        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByToken(refreshToken);
        tokenOpt.ifPresent(refreshTokenRepository::delete);
    }

    @Override
    public boolean isRefreshTokenBlacklisted(String refreshToken) {
        // Redis를 사용하지 않을 경우 항상 false 반환
        return false;
    }

    private void saveRefreshToken(String userEmail, String refreshToken) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        userOpt.ifPresent(user -> {
            refreshTokenRepository.deleteByUser_UserId(user.getUserId());
            RefreshToken rt = new RefreshToken(null, user, refreshToken, System.currentTimeMillis() + jwtTokenProvider.getRefreshTokenExpiration());
            refreshTokenRepository.save(rt);
        });
    }
}
