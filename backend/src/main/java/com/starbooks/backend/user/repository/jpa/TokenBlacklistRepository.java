package com.starbooks.backend.user.repository.jpa;

import com.starbooks.backend.user.model.TokenBlacklist;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenBlacklistRepository extends CrudRepository<TokenBlacklist, String> {
}
