package com.starbooks.backend.diary.repository;

import com.starbooks.backend.diary.model.DiaryContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DiaryContentRepository extends JpaRepository<DiaryContent, Long> {

    // 다이어리 ID로 내용 조회
    Optional<DiaryContent> findByDiary_DiaryId(Long diaryId);

    // 다이어리 내용 업데이트
    @Modifying
    @Query("UPDATE DiaryContent dc SET dc.title = :title, dc.content = :content WHERE dc.diary.diaryId = :diaryId")
    void updateContent(@Param("diaryId") Long diaryId,
                       @Param("title") String title,
                       @Param("content") String content);
}