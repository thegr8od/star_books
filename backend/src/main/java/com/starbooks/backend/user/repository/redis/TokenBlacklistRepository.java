package com.starbooks.backend.user.repository.redis;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.starbooks.backend.user.model.TokenBlacklist;

public interface TokenBlacklistRepository extends CrudRepository<TokenBlacklist, String> {
}