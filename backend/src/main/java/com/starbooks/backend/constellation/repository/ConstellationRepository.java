package com.starbooks.backend.constellation.repository;

import com.starbooks.backend.constellation.model.Constellation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConstellationRepository extends JpaRepository<Constellation, Long> {
    List<Constellation> findByUserId(Long userId);
}
