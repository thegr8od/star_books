package com.starbooks.backend.starline.repository;

import com.starbooks.backend.starline.model.StarlineCoord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface StarlineCoordRepository extends JpaRepository<StarlineCoord, Long> {

    @Query("SELECT s FROM StarlineCoord s " +
            "JOIN DiaryEmotion de ON (s.startEmotionId = de.diaryEmotionId OR s.endEmotionId = de.diaryEmotionId) " +
            "JOIN Diary d ON de.diary.diaryId = d.diaryId " +
            "WHERE d.user.userId = :userId AND s.year = :year")
    List<StarlineCoord> findByUserIdAndYear(@Param("userId") Long userId, @Param("year") int year);

    @Query("SELECT s FROM StarlineCoord s " +
            "JOIN DiaryEmotion de ON (s.startEmotionId = de.diaryEmotionId OR s.endEmotionId = de.diaryEmotionId) " +
            "JOIN Diary d ON de.diary.diaryId = d.diaryId " +
            "WHERE d.user.userId = :userId AND s.year = :year AND s.month = :month")
    List<StarlineCoord> findByUserIdAndYearAndMonth(@Param("userId") Long userId, @Param("year") int year, @Param("month") int month);

    @Transactional
    @Query("DELETE FROM StarlineCoord s WHERE s.starlineCoordId IN (" +
            "SELECT s2.starlineCoordId FROM StarlineCoord s2 " +
            "JOIN DiaryEmotion de ON (s2.startEmotionId = de.diaryEmotionId OR s2.endEmotionId = de.diaryEmotionId) " +
            "JOIN Diary d ON de.diary.diaryId = d.diaryId " +
            "WHERE d.user.userId = :userId AND s2.year = :year AND s2.month = :month)")
    void deleteByUserIdAndYearAndMonth(@Param("userId") Long userId, @Param("year") int year, @Param("month") int month);
}
