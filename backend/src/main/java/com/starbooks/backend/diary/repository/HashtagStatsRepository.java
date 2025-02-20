package com.starbooks.backend.diary.repository;

import com.starbooks.backend.diary.model.HashtagStats;
import com.starbooks.backend.diary.model.Diary.HashtagType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HashtagStatsRepository extends JpaRepository<HashtagStats, HashtagType> {

    @Query("SELECT h FROM HashtagStats h ORDER BY h.usageCount DESC LIMIT 5")
    List<HashtagStats> findTop5ByOrderByUsageCountDesc();
}