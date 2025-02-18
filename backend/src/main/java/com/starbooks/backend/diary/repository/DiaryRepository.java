package com.starbooks.backend.diary.repository;

import com.starbooks.backend.config.CustomUserDetails;
import com.starbooks.backend.diary.model.Diary;
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

    @EntityGraph(attributePaths = {"content", "diaryEmotion", "hashtags", "images"})
    Optional<Diary> findByDiaryId(Long diaryId);

    @Query("SELECT d FROM Diary d WHERE d.user.userId = :userId AND d.diaryDate = :date")
    Optional<Diary> findByUserIdAndDiaryDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT d FROM Diary d WHERE d.user.userId = :userId ORDER BY d.createdAt DESC")
    Page<Diary> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

    List<Diary> findAllByUserAndCreatedAtBetween(User user, LocalDateTime start, LocalDateTime end);

    List<Diary> findAllByUser(User user);

}
