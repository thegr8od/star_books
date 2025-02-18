package com.starbooks.backend.diary.repository;

import com.starbooks.backend.config.CustomUserDetails;
import com.starbooks.backend.diary.model.Diary;
import com.starbooks.backend.diary.model.DiaryEmotion;
import com.starbooks.backend.user.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    @EntityGraph(attributePaths = {"content", "diaryEmotion", "hashtags", "image"})
    Optional<Diary> findByDiaryId(Long diaryId);

    @Query("SELECT e FROM DiaryEmotion e WHERE e.diary.user.userId = :userId AND e.diary.diaryDate = :diaryDate")
    Optional<DiaryEmotion> findEmotionByUserIdAndDiaryDate(@Param("userId") Long userId, @Param("diaryDate") LocalDate diaryDate);

    @Query("SELECT e FROM DiaryEmotion e JOIN FETCH e.diary d JOIN FETCH d.user u WHERE d.diaryDate = :diaryDate")
    List<DiaryEmotion> findAllEmotionsByDate(@Param("diaryDate") LocalDate diaryDate);


    @Query("SELECT d FROM Diary d WHERE d.user.userId = :userId ORDER BY d.createdAt DESC")
    Page<Diary> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

    List<Diary> findAllByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);

    List<Diary> findAllByUser(User user);

}
