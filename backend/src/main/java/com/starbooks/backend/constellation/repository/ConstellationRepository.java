package com.starbooks.backend.constellation.repository;

import com.starbooks.backend.constellation.model.Constellation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConstellationRepository extends JpaRepository<Constellation, Long> {

    // 특정 유저의 모든 별자리 조회
    List<Constellation> findByUserId(Long userId);

    // ✅ 대신 기본 메서드 사용
    Optional<Constellation> findById(Long constellationId);
}
