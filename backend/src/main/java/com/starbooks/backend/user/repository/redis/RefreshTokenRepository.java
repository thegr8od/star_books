package com.starbooks.backend.user.repository.redis;

import com.starbooks.backend.user.model.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    List<RefreshToken> findAllByUserEmail(String userEmail);
}
