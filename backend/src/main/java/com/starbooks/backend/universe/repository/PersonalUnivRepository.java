package com.starbooks.backend.universe.repository;

import com.starbooks.backend.diary.model.DiaryEmotion;
import com.starbooks.backend.universe.model.PersonalUniv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalUnivRepository extends JpaRepository<PersonalUniv, Long> {

    // 기존: updatedAt 을 기준으로 조회
//    @Query("SELECT p FROM PersonalUniv p " +
//           "WHERE p.diaryEmotion.diary.user.userId = :userId " +
//           "AND p.updatedAt >= :start AND p.updatedAt < :end")
//    List<PersonalUniv> findByUserIdAndUpdatedAtBetween(
//            @Param("userId") Long userId,
//            @Param("start") LocalDateTime start,
//            @Param("end") LocalDateTime end
//    );

    /**
     * diary_date(일기 날짜) 기준으로 PersonalUniv 조회
     *
     * - DiaryEmotion 으로부터 Diary를 가져오고
     * - Diary의 diary_date 를 기준으로 검색
     */
    @Query("SELECT p FROM PersonalUniv p " +
            "WHERE p.diaryEmotion.diary.user.userId = :userId " +
            "AND p.diaryEmotion.diary.diaryDate >= :startDate " +
            "AND p.diaryEmotion.diary.diaryDate <= :endDate")
    List<PersonalUniv> findByUserIdAndDiaryDateBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // 나머지 부분은 그대로...
    @Query("SELECT p FROM PersonalUniv p WHERE p.universeId = :universeId AND p.diaryEmotion.diary.user.userId = :userId")
    Optional<PersonalUniv> findByUserIdAndUniverseId(@Param("userId") Long userId,
                                                     @Param("universeId") Long universeId);

    @Query("SELECT p FROM PersonalUniv p WHERE p.diaryEmotion.diary.user.userId = :userId AND p.diaryEmotion.diaryEmotionId = :diaryEmotionId")
    Optional<PersonalUniv> findByUserIdAndDiaryEmotionId(@Param("userId") Long userId,
                                                         @Param("diaryEmotionId") Long diaryEmotionId);

    Optional<PersonalUniv> findByDiaryEmotion(DiaryEmotion diaryEmotion);
}
