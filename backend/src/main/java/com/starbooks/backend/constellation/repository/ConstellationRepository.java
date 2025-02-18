package com.starbooks.backend.constellation.repository;

import com.starbooks.backend.constellation.model.Constellation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConstellationRepository extends JpaRepository<Constellation, Long> {

    // 특정 유저의 모든 별자리 조회
    List<Constellation> findByUserId(Long userId);

    // 특정 유저의 AI가 생성한 별자리만 조회
    List<Constellation> findByUserIdAndGeneratedByAI(Long userId, Boolean generatedByAI);

    // 특정 ID의 별자리 조회 (AI 생성 여부 확인용)
    Optional<Constellation> findByConstellationIdAndGeneratedByAI(Long constellationId, Boolean generatedByAI);
}
