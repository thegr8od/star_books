package com.starbooks.backend.diary.repository;

import com.starbooks.backend.diary.model.Diary;
import com.starbooks.backend.diary.model.DiaryImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiaryImageRepository extends JpaRepository<DiaryImage, Long> {
    List<DiaryImage> findAllByDiary(Diary diary);
}
