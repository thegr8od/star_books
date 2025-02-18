package com.starbooks.backend.universe.repository;

import com.starbooks.backend.diary.model.DiaryEmotion;
import com.starbooks.backend.universe.model.PersonalUniv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalUnivRepository extends JpaRepository<PersonalUniv, Long> {

    @Query("SELECT p FROM PersonalUniv p " +
            "WHERE p.diaryEmotion.diary.user.userId = :userId " +
            "AND p.updatedAt >= :start AND p.updatedAt < :end") // ✅ BETWEEN 대신 < 사용
    List<PersonalUniv> findByUserIdAndUpdatedAtBetween(@Param("userId") Long userId,
                                                       @Param("start") LocalDateTime start,
                                                       @Param("end") LocalDateTime end);

    @Query("SELECT p FROM PersonalUniv p WHERE p.universeId = :universeId AND p.diaryEmotion.diary.user.userId = :userId")
    Optional<PersonalUniv> findByUserIdAndUniverseId(@Param("userId") Long userId,
                                                     @Param("universeId") Long universeId);


    @Query("SELECT p FROM PersonalUniv p WHERE p.diaryEmotion.diary.user.userId = :userId AND p.diaryEmotion.diaryEmotionId = :diaryEmotionId")
    Optional<PersonalUniv> findByUserIdAndDiaryEmotionId(@Param("userId") Long userId,
                                                         @Param("diaryEmotionId") Long diaryEmotionId);

    Optional<PersonalUniv> findByDiaryEmotion(DiaryEmotion diaryEmotion);
}
