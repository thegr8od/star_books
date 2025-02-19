package com.starbooks.backend.user.service;

import com.starbooks.backend.user.model.PasswordResetToken;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetToken createToken(User user) {
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1)) // 유효기간 1시간
                .build();
        return tokenRepository.save(resetToken);
    }

    public Optional<PasswordResetToken> getToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public void deleteToken(PasswordResetToken token) {
        tokenRepository.delete(token);
    }
}
