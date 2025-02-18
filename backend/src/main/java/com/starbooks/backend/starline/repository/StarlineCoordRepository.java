package com.starbooks.backend.starline.repository;

import com.starbooks.backend.starline.model.StarlineCoord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

    // 1. 삭제할 StarlineCoord의 ID 목록을 조회
    @Query("SELECT s.starlineCoordId FROM StarlineCoord s " +
            "JOIN DiaryEmotion de ON (s.startEmotionId = de.diaryEmotionId OR s.endEmotionId = de.diaryEmotionId) " +
            "JOIN Diary d ON de.diary.diaryId = d.diaryId " +
            "WHERE d.user.userId = :userId AND s.year = :year AND s.month = :month")
    List<Long> findStarlineCoordIdsForDeletion(@Param("userId") Long userId, @Param("year") int year, @Param("month") int month);

    // 2. 조회된 ID 목록을 사용해 삭제
    @Transactional
    @Modifying
    @Query("DELETE FROM StarlineCoord s WHERE s.starlineCoordId IN :ids")
    void deleteByIds(@Param("ids") List<Long> ids);
}
