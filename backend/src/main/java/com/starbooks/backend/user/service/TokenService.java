package com.starbooks.backend.user.service;

import com.starbooks.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.starbooks.backend.user.model.User;

public interface TokenService {
    String generateAccessToken(User user);
    String generateRefreshToken(User user);
    ResponseRefreshTokenDTO refreshToken(String refreshToken);
    void blacklistRefreshToken(String refreshToken);
    boolean isRefreshTokenBlacklisted(String refreshToken);
    void invalidateAllUserTokens(String email);
}
