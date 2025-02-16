package com.starbooks.backend.user.repository.redis;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.starbooks.backend.user.model.RefreshToken;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    List<RefreshToken> findAllByUserEmail(String userEmail);
}