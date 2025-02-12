package com.starbooks.backend.starline.service;

import com.starbooks.backend.diary.model.DiaryEmotion;
import com.starbooks.backend.diary.repository.DiaryEmotionRepository;
import com.starbooks.backend.starline.dto.request.StarlineCoordRequest;
import com.starbooks.backend.starline.dto.response.StarlineCoordResponse;
import com.starbooks.backend.starline.model.StarlineCoord;
import com.starbooks.backend.starline.repository.StarlineCoordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 별자리 선 데이터를 관리하는 서비스 클래스
 */
@Service
@RequiredArgsConstructor
public class StarlineCoordService {

    private final StarlineCoordRepository starlineCoordRepository;
    private final DiaryEmotionRepository diaryEmotionRepository;

    /**
     * 별자리 선을 생성하는 메서드
     */
    @Transactional
    public StarlineCoordResponse createStarlineCoord(StarlineCoordRequest request) {
        // 시작 감정 좌표 조회
        DiaryEmotion startEmotion = diaryEmotionRepository.findById(request.getStartEmotionId())
                .orElseThrow(() -> new IllegalArgumentException("시작 감정 ID를 찾을 수 없습니다."));

        // 끝 감정 좌표 조회
        DiaryEmotion endEmotion = diaryEmotionRepository.findById(request.getEndEmotionId())
                .orElseThrow(() -> new IllegalArgumentException("끝 감정 ID를 찾을 수 없습니다."));

        // 엔티티 생성 및 저장
        StarlineCoord starlineCoord = StarlineCoord.builder()
                .diaryEmotionStart(startEmotion)
                .diaryEmotionEnd(endEmotion)
                .build();

        return StarlineCoordResponse.fromEntity(starlineCoordRepository.save(starlineCoord));
    }

    /**
     * 모든 별자리 선 정보를 조회하는 메서드
     */
    @Transactional(readOnly = true)
    public List<StarlineCoordResponse> getAllStarlineCoords() {
        return starlineCoordRepository.findAll().stream()
                .map(StarlineCoordResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 특정 ID에 해당하는 별자리 선을 조회하는 메서드
     */
    @Transactional(readOnly = true)
    public StarlineCoordResponse getStarlineCoordById(Long id) {
        return starlineCoordRepository.findById(id)
                .map(StarlineCoordResponse::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 선을 찾을 수 없습니다."));
    }
}
