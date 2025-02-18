package com.starbooks.backend.diary.service;

//import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
import com.starbooks.backend.diary.dto.response.DiaryResponse;
import com.starbooks.backend.diary.exception.NotFoundException;
import com.starbooks.backend.diary.model.*;
import com.starbooks.backend.emotion.model.EmotionPoint;
import com.starbooks.backend.emotion.service.EmotionService;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.diary.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final EmotionService emotionService; // 감정 분석 서비스

    /**
     * 1️⃣ 빈 다이어리 생성
     */
    @Transactional
    public DiaryResponse createEmptyDiary(User user) {
        Diary diary = Diary.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();
        diaryRepository.save(diary);
        return DiaryResponse.from(diary);
    }

    /**
     * 2️⃣ 해시태그 추가
     */
    @Transactional
    public EmotionPoint addHashtagsAndAnalyzeEmotion(Long diaryId, List<Diary.HashtagType> hashtags) {
        Diary diary = getDiaryEntity(diaryId);

        // 해시태그 등록
        hashtags.forEach(tag -> {
            DiaryHashtag diaryHashtag = DiaryHashtag.builder()
                    .diary(diary)
                    .hashtag(tag)
                    .build();
            diary.addHashtag(diaryHashtag);
        });

        // Enum 값들을 문자열로 변환 (예: "행복한", "설레는" 등)
        List<String> tagStrings = hashtags.stream()
                .map(Enum::name)
                .collect(Collectors.toList());

        // 감정 분석 수행 (가중 평균 좌표 계산)
        EmotionPoint result = emotionService.calculateWeightedPoint(tagStrings);

        // 계산 결과로 DiaryEmotion 생성 및 다이어리에 추가
        DiaryEmotion diaryEmotion = DiaryEmotion.builder()
                .diary(diary)
                .xValue((float) result.getxvalue())
                .yValue((float) result.getyvalue())
                .build();
        diary.addEmotion(diaryEmotion);

        return result;
    }


    /**
     * 4️⃣ 다이어리 내용 입력
     */
    @Transactional
    public void addContentAndImages(Long diaryId, DiaryContentRequest contentRequest,String Imgurl) {
        Diary diary = getDiaryEntity(diaryId);

        // 내용 저장
        DiaryContent content = DiaryContent.builder()
                .diary(diary)
                .title(contentRequest.getTitle())
                .content(contentRequest.getContent())
                .build();
        diary.setContent(content);

        // 이미지 저장 (단일 이미지)
        if (Imgurl != null) {
            DiaryImage diaryImage = DiaryImage.builder()
                    .diary(diary)
                    .Imgurl(Imgurl)
                    .build();
            diary.setImage(diaryImage);
        }
    }

    @Transactional
    public DiaryResponse updateDiaryContent(Long diaryId, DiaryContentRequest contentRequest) {
        Diary diary = getDiaryEntity(diaryId);

        // 기존에 다이어리 내용이 존재하면 업데이트, 없으면 새로 생성
        DiaryContent content = diary.getContent();
        if (content == null) {
            content = DiaryContent.builder()
                    .diary(diary)
                    .title(contentRequest.getTitle())
                    .content(contentRequest.getContent())
                    .build();
            diary.setContent(content);
        } else {
            content.setTitle(contentRequest.getTitle());
            content.setContent(contentRequest.getContent());
        }
        // 해시태그나 감정 등은 그대로 두므로, 수정하지 않습니다.
        return DiaryResponse.from(diary);
    }


    /**
     * 년도별 다이어리 조회
     */
    public List<DiaryResponse> getDiariesByYear(User user, int year) {
        LocalDateTime start = LocalDateTime.of(year, 1, 1, 0, 0, 0);
        // plusYears(1) 후 마지막 나노초 전까지
        LocalDateTime end = start.plusYears(1).minusNanos(1);
        List<Diary> diaries = diaryRepository.findAllByUserAndCreatedAtBetween(user, start, end);
        return diaries.stream()
                .map(DiaryResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 월별 다이어리 조회
     */
    public List<DiaryResponse> getDiariesByMonth(User user, int year, int month) {
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0, 0);
        // 해당 월의 마지막 시점
        LocalDateTime end = start.plusMonths(1).minusNanos(1);
        List<Diary> diaries = diaryRepository.findAllByUserAndCreatedAtBetween(user, start, end);
        return diaries.stream()
                .map(DiaryResponse::from)
                .collect(Collectors.toList());
    }

    public DiaryResponse getDiary(Long diaryId) {
        Diary diary = getDiaryEntity(diaryId);
        return DiaryResponse.from(diary);
    }

    @Transactional
    public void deleteDiary(Long diaryId) {
        Diary diary = getDiaryEntity(diaryId);
        diaryRepository.delete(diary);
    }

    public Diary getDiaryEntity(Long diaryId) {
        return diaryRepository.findById(diaryId)
                .orElseThrow(() -> new NotFoundException("Diary not found"));
    }


}
