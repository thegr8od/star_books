package com.starbooks.backend.diary.repository;

import com.starbooks.backend.diary.model.Diary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

    @EntityGraph(attributePaths = {"content", "emotions", "hashtags", "images"})
    Optional<Diary> findWithDetailsById(Long diaryId);

    @Query("SELECT d FROM Diary d WHERE d.user.userId = :userId ORDER BY d.createdAt DESC")
    Page<Diary> findAllByUserId(@Param("userId") Long userId, Pageable pageable);
}
