package com.starbooks.backend.starline.repository;

import com.starbooks.backend.starline.model.StarlineCoord;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 별자리 선 정보에 대한 데이터 접근을 담당하는 JPA Repository
 */
public interface StarlineCoordRepository extends JpaRepository<StarlineCoord, Long> {
}
