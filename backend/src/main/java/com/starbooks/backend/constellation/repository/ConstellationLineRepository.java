package com.starbooks.backend.constellation.repository;

import com.starbooks.backend.constellation.model.ConstellationLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConstellationLineRepository extends JpaRepository<ConstellationLine, Long> {

    // 특정 별자리 ID로 선 데이터 조회
    List<ConstellationLine> findByConstellation_ConstellationId(Long constellationId);

    // 특정 별자리의 선 데이터 삭제 (업데이트 시 사용)
    void deleteByConstellation_ConstellationId(Long constellationId);
}
