package com.starbooks.backend.diary.service;

//import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
import com.starbooks.backend.config.CustomUserDetails;
import com.starbooks.backend.diary.dto.DiaryEmotionDTO;
import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
import com.starbooks.backend.diary.dto.response.DiaryResponse;
import com.starbooks.backend.diary.dto.response.HashtagStatsResponse;
import com.starbooks.backend.diary.exception.NotFoundException;
import com.starbooks.backend.diary.model.*;
import com.starbooks.backend.diary.repository.HashtagStatsRepository;
import com.starbooks.backend.emotion.model.EmotionPoint;
import com.starbooks.backend.emotion.service.EmotionService;
import com.starbooks.backend.universe.model.PersonalUniv;
import com.starbooks.backend.universe.repository.PersonalUnivRepository;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.diary.repository.DiaryRepository;
import com.starbooks.backend.user.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final EmotionService emotionService; // 감정 분석 서비스
    private final HashtagStatsRepository hashtagStatsRepository;
    private final UserRepository userRepository;
    private final PersonalUnivRepository personalUnivRepository;


    /**
     * 1️⃣ 빈 다이어리 생성
     */
    @Transactional
    public DiaryResponse createEmptyDiary(Long userId, LocalDate diaryDate) {  // LocalDate 추가
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        System.out.println("Current TimeZone: " + TimeZone.getDefault().getID());

        Diary diary = Diary.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .diaryDate(diaryDate)  // 새 필드에 값 설정
                .build();
        diaryRepository.save(diary);
        return DiaryResponse.from(diary);
    }


    @Transactional(readOnly = true)
    public List<DiaryEmotionDTO> getAllDiaryEmotionsByDate(LocalDate diaryDate) {
        List<DiaryEmotion> emotions = diaryRepository.findAllEmotionsByDate(diaryDate);
        return emotions.stream()
                .map(e -> new DiaryEmotionDTO(
                        e.getDiaryEmotionId(),
                        e.getXValue(),
                        e.getYValue(),
                        e.getDiary().getUser().getUserId()  // userId 추가
                ))
                .collect(Collectors.toList());
    }




    /**
     * 2️⃣ 해시태그 추가 (수정된 버전)
     */
    @Transactional
    public EmotionPoint addHashtagsAndAnalyzeEmotion(Long diaryId, List<Diary.HashtagType> hashtags) {
        Diary diary = getDiaryEntity(diaryId);

        // 해시태그 등록 및 통계 업데이트
        hashtags.forEach(tag -> {
            DiaryHashtag diaryHashtag = DiaryHashtag.builder()
                    .diary(diary)
                    .hashtag(tag)
                    .build();
            diary.addHashtag(diaryHashtag);

            // 해시태그 통계 업데이트
            updateHashtagStats(tag, true);
        });

        List<String> tagStrings = hashtags.stream()
                .map(Enum::name)
                .collect(Collectors.toList());

        EmotionPoint result = emotionService.calculateWeightedPoint(tagStrings);

        DiaryEmotion diaryEmotion = DiaryEmotion.builder()
                .diary(diary)
                .xValue((float) result.getxvalue())
                .yValue((float) result.getyvalue())
                .build();
        diary.addEmotion(diaryEmotion);

        return result;
    }

    /**
     * Top 5 해시태그 조회
     */
    public List<HashtagStatsResponse> getTop5Hashtags() {
        return hashtagStatsRepository.findTop5ByOrderByUsageCountDesc()
                .stream()
                .map(stats -> {
                    EmotionPoint point = emotionService.getTagCoordinate(stats.getHashtagType().name());
                    return HashtagStatsResponse.builder()
                            .hashtagType(stats.getHashtagType().name())
                            .usageCount(stats.getUsageCount())
                            .xValue((int) point.getxvalue())  // 좌표 추가
                            .yValue((int) point.getyvalue())  // 좌표 추가
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<HashtagStatsResponse> getUserHashtagStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        // 사용자의 모든 다이어리 조회
        List<Diary> userDiaries = diaryRepository.findAllByUser(user);

        // 해시태그 통계 계산
        Map<String, Long> hashtagCountMap = userDiaries.stream()
                .flatMap(diary -> diary.getHashtags().stream())
                .collect(Collectors.groupingBy(tag -> tag.getHashtag().name(), Collectors.counting()));

        // 각 해시태그별 좌표 추가
        return hashtagCountMap.entrySet().stream()
                .map(entry -> {
                    EmotionPoint point = emotionService.getTagCoordinate(entry.getKey());
                    return HashtagStatsResponse.builder()
                            .hashtagType(entry.getKey())
                            .usageCount(entry.getValue())
                            .xValue((int) point.getxvalue())
                            .yValue((int) point.getyvalue())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 해시태그 통계 초기화
     */
    @Transactional
    public void initializeHashtagStats() {
        if (hashtagStatsRepository.count() == 0) {
            for (Diary.HashtagType type : Diary.HashtagType.values()) {
                hashtagStatsRepository.save(HashtagStats.builder()
                        .hashtagType(type)
                        .build());
            }
        }
    }

    /**
     * 해시태그 통계 업데이트
     */
    private void updateHashtagStats(Diary.HashtagType hashtagType, boolean isIncrement) {
        HashtagStats stats = hashtagStatsRepository.findById(hashtagType)
                .orElseGet(() -> HashtagStats.builder()
                        .hashtagType(hashtagType)
                        .build());

        if (isIncrement) {
            stats.incrementCount();
        } else {
            stats.decrementCount();
        }

        hashtagStatsRepository.save(stats);
    }

    /**
     * 해시태그 삭제
     */
    @Transactional
    public void removeHashtag(Long diaryId, Diary.HashtagType hashtagType) {
        Diary diary = getDiaryEntity(diaryId);

        diary.getHashtags().removeIf(tag -> {
            if (tag.getHashtag() == hashtagType) {
                updateHashtagStats(hashtagType, false);
                return true;
            }
            return false;
        });
    }

    /**
     * 4️⃣ 다이어리 내용 입력
     */
    @Transactional
    public PersonalUniv addContentAndImages(Long diaryId, DiaryContentRequest contentRequest, String Imgurl) {
        Diary diary = getDiaryEntity(diaryId);

        // DiaryContent 처리
        DiaryContent content = diary.getContent();
        if (content == null) {
            content = DiaryContent.builder()
                    .diary(diary)
                    .title(contentRequest.getTitle())
                    .content(contentRequest.getContent())
                    .build();
        } else {
            content.setTitle(contentRequest.getTitle());
            content.setContent(contentRequest.getContent());
        }
        diary.setContent(content);

        // DiaryImage 처리
        if (Imgurl != null) {
            DiaryImage diaryImage = diary.getImage();
            if (diaryImage == null) {
                diaryImage = DiaryImage.builder().diary(diary).Imgurl(Imgurl).build();
            } else {
                diaryImage.setImgurl(Imgurl);
            }
            diary.setImage(diaryImage);
        }

        DiaryEmotion emotion = diary.getDiaryEmotion();

        // PersonalUniv 중복 확인
        Optional<PersonalUniv> existingUniv = personalUnivRepository.findByDiaryEmotion(emotion);
        PersonalUniv personalUniv;
        if (existingUniv.isPresent()) {
            // 이미 존재하면 업데이트
            personalUniv = existingUniv.get();
            personalUniv.setXCoord(50f);
            personalUniv.setYCoord(50f);
            personalUniv.setUpdatedAt(LocalDateTime.now());
        } else {
            // 존재하지 않으면 새로 생성
            personalUniv = PersonalUniv.builder()
                    .diaryEmotion(emotion)
                    .xCoord(50f)
                    .yCoord(50f)
                    .updatedAt(LocalDateTime.now())
                    .build();
        }

        personalUnivRepository.save(personalUniv);
        return personalUniv;
    }




    @Transactional
    public DiaryResponse updateDiaryContent(Long diaryId, DiaryContentRequest contentRequest, String newImgUrl) {
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

        // 이미지 업데이트 로직 추가
        if (newImgUrl != null) {
            DiaryImage diaryImage = diary.getImage();
            if (diaryImage == null) {
                // 기존 이미지가 없는 경우 새로 생성
                diaryImage = DiaryImage.builder()
                        .diary(diary)
                        .Imgurl(newImgUrl)
                        .build();
                diary.setImage(diaryImage);
            } else {
                // 기존 이미지가 있는 경우 URL 업데이트
                diaryImage.setImgurl(newImgUrl);
            }
        }

        return DiaryResponse.from(diary);
    }

    @Transactional(readOnly = true)
    public DiaryEmotion getDiaryEmotionByDate(Long userId, LocalDate diaryDate) {
        return diaryRepository.findEmotionByUserIdAndDiaryDate(userId, diaryDate)
                .orElseThrow(() -> new NotFoundException("해당 날짜의 다이어리 감정 데이터가 없습니다."));
    }


//    /**
//     * 년도별 다이어리 조회
//     */
//    public List<DiaryResponse> getDiariesByYear(User user, int year) {
//        LocalDate start = LocalDate.of(year, 1, 1, 0, 0, 0);
//        // plusYears(1) 후 마지막 나노초 전까지
//        LocalDate end = start.plusYears(1).minusNanos(1);
//        List<Diary> diaries = diaryRepository.findAllByUserAndDiaryDateBetween(user, start, end);
//        return diaries.stream()
//                .map(DiaryResponse::from)
//                .collect(Collectors.toList());
//    }

    /**
     * 월별 다이어리 조회
     */
    public List<DiaryResponse> getDiariesByMonth(Long userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth()); // 해당 월의 마지막 날짜

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<Diary> diaries = diaryRepository.findAllByUserAndDiaryDateBetween(user, start, end);
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
        return diaryRepository.findByDiaryId(diaryId)
                .orElseThrow(() -> new NotFoundException("Diary not found"));
    }


}
