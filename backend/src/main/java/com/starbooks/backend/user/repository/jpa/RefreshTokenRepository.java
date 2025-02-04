package com.starbooks.backend.user.repository.jpa;

import com.starbooks.backend.user.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUser_UserId(Long userId);
    void deleteByUser_UserId(Long userId);
}
