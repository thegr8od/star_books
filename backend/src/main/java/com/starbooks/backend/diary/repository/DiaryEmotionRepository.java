package com.starbooks.backend.diary.repository;

import com.starbooks.backend.diary.model.DiaryEmotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiaryEmotionRepository extends JpaRepository<DiaryEmotion, Long> {

    // 다이어리 ID로 감정 데이터 조회
    List<DiaryEmotion> findAllByDiary_DiaryId(Long diaryId);

    // 특정 다이어리의 감정 데이터 일괄 삭제
    @Modifying
    @Query("DELETE FROM DiaryEmotion de WHERE de.diary.diaryId = :diaryId")
    void deleteAllByDiaryId(@Param("diaryId") Long diaryId);
}