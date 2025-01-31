package com.starbooks.backend.diary.service;

import com.starbooks.backend.diary.dto.request.DiaryCreateRequest;
import com.starbooks.backend.diary.dto.response.DiaryResponse;
import com.starbooks.backend.diary.model.*;
import com.starbooks.backend.diary.repository.DiaryRepository;
import com.starbooks.backend.diary.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final FileStorageService fileStorageService;
    private final HashtagRepository hashtagRepository;

    @Transactional
    public DiaryResponse createDiary(DiaryCreateRequest request, User user) {
        // 1. 다이어리 기본 정보 저장
        Diary diary = Diary.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .build();

        // 2. 내용 저장
        DiaryContent content = DiaryContent.builder()
                .title(request.title())
                .content(request.content())
                .diary(diary) // DiaryContent에 Diary 설정
                .build();
        diary.setContent(content); // Diary에 DiaryContent 설정

        // 3. 감정 저장
        request.emotions().forEach(emotion -> {
            DiaryEmotion diaryEmotion = DiaryEmotion.builder()
                    .xValue(emotion.getXValue())
                    .yValue(emotion.getYValue())
                    .diary(diary) // DiaryEmotion에 Diary 설정
                    .build();
            diary.addEmotion(diaryEmotion);
        });

        // 4. 해시태그 저장 (Hashtag 엔티티 사용)
        request.hashtags().forEach(tagName -> {
            // HashtagRepository 인스턴스 메서드로 변경
            Hashtag hashtag = hashtagRepository.findByName(tagName)
                    .orElseGet(() -> hashtagRepository.save(new Hashtag(tagName))); // save도 인스턴스 메서드

            DiaryHashtag diaryHashtag = DiaryHashtag.builder()
                    .diary(diary)
                    .tag(hashtag)
                    .build();
            diary.addHashtag(diaryHashtag);
        });

        // 5. 이미지 업로드 및 경로 저장
        List<DiaryImage> images = request.images().stream()
                .map(file -> {
                    String filePath = fileStorageService.upload(file);
                    return DiaryImage.builder()
                            .diary(diary)  // DiaryImage 빌더에 diary 설정
                            .saveFilePath(filePath)
                            .build();
                })
                .toList();

        diary.setImages(images);  //

        // 6. 다이어리 저장
        diaryRepository.save(diary);

        // 7. 응답 DTO 변환
        return DiaryResponse.from(diary);
    }

    public DiaryResponse getDiary(Long diaryId) {
        Diary diary = diaryRepository.findWithDetailsById(diaryId)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException("Diary not found"));
        return DiaryResponse.from(diary);
    }

    @Transactional
    public void deleteDiary(Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new ChangeSetPersister.NotFoundException("Diary not found"));
        diaryRepository.delete(diary);
    }
}