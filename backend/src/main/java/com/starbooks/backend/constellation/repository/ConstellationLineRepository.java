package com.starbooks.backend.constellation.repository;

import com.starbooks.backend.constellation.model.ConstellationLine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConstellationLineRepository extends JpaRepository<ConstellationLine, Long> {
    List<ConstellationLine> findByConstellation_ConstellationId(Long constellationId);
}
