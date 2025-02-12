package com.starbooks.backend.universe.service;

import com.starbooks.backend.diary.model.DiaryEmotion;
import com.starbooks.backend.diary.repository.DiaryEmotionRepository;
import com.starbooks.backend.universe.dto.request.RequestPersonalUnivDTO;
import com.starbooks.backend.universe.dto.response.ResponsePersonalUnivDTO;
import com.starbooks.backend.universe.model.PersonalUniv;
import com.starbooks.backend.universe.repository.PersonalUnivRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonalUnivService {

    private final PersonalUnivRepository personalUnivRepository;
    private final DiaryEmotionRepository diaryEmotionRepository;  // ✅ diary_emotion_id 참조

    /**
     * 개인 유니버스 생성 (diary_emotion_id를 참조)
     */
    @Transactional
    public ResponsePersonalUnivDTO createPersonalUniv(RequestPersonalUnivDTO dto) {
        // ✅ diary_emotion_id로 DiaryEmotion 찾기
        DiaryEmotion diaryEmotion = diaryEmotionRepository.findById(dto.getDiaryEmotionId())
                .orElseThrow(() -> new RuntimeException("Diary Emotion not found"));

        // ✅ PersonalUniv 엔티티 생성
        PersonalUniv personalUniv = PersonalUniv.builder()
                .diaryEmotion(diaryEmotion) // ✅ diary_emotion_id 참조
                .xCoord(dto.getXCoord())
                .yCoord(dto.getYCoord())
                .updatedAt(LocalDateTime.now())  // ✅ NULL 방지
                .build();

        PersonalUniv savedEntity = personalUnivRepository.save(personalUniv);
        return new ResponsePersonalUnivDTO(savedEntity);
    }

    /**
     * 개인 유니버스 조회
     */
    public ResponsePersonalUnivDTO getPersonalUniv(Long universeId) {
        Optional<PersonalUniv> personalUniv = personalUnivRepository.findById(universeId);
        return personalUniv.map(ResponsePersonalUnivDTO::new).orElse(null);
    }

    /**
     * 개인 유니버스 업데이트
     */
    @Transactional
    public ResponsePersonalUnivDTO updatePersonalUniv(Long universeId, RequestPersonalUnivDTO dto) {
        Optional<PersonalUniv> optionalEntity = personalUnivRepository.findById(universeId);
        if (optionalEntity.isPresent()) {
            PersonalUniv personalUniv = optionalEntity.get();

            // diary_emotion_id 업데이트 시, 새로운 DiaryEmotion 참조하도록 변경
            if (dto.getDiaryEmotionId() != null) {
                DiaryEmotion diaryEmotion = diaryEmotionRepository.findById(dto.getDiaryEmotionId())
                        .orElseThrow(() -> new RuntimeException("Diary Emotion not found"));
                personalUniv.setDiaryEmotion(diaryEmotion);
            }

            personalUniv.setXCoord(dto.getXCoord());
            personalUniv.setYCoord(dto.getYCoord());
            personalUniv.setUpdatedAt(LocalDateTime.now()); // ✅ updated_at 최신화

            PersonalUniv updatedEntity = personalUnivRepository.save(personalUniv);
            return new ResponsePersonalUnivDTO(updatedEntity);
        }
        return null;
    }

    /**
     * 개인 유니버스 삭제
     */
    @Transactional
    public void deletePersonalUniv(Long universeId) {
        personalUnivRepository.deleteById(universeId);
    }
}
