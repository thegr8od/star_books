package com.starbooks.backend.diary.service;

//import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
import com.starbooks.backend.diary.dto.request.DiaryContentRequest;
import com.starbooks.backend.diary.dto.response.DiaryResponse;
import com.starbooks.backend.diary.exception.NotFoundException;
import com.starbooks.backend.diary.model.*;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.diary.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {

    private final DiaryRepository diaryRepository;

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
    public void addHashtags(Long diaryId, List<Diary.HashtagType> hashtags) {
        Diary diary = getDiaryEntity(diaryId);
        hashtags.forEach(tag -> {
            DiaryHashtag diaryHashtag = DiaryHashtag.builder()
                    .diary(diary)
                    .hashtag(tag)
                    .build();
            diary.addHashtag(diaryHashtag);
        });
    }

    /**
     * 4️⃣ 다이어리 내용 입력
     */
    @Transactional
    public void addContentAndImages(Long diaryId, DiaryContentRequest contentRequest, List<String> imageUrls) {
        Diary diary = getDiaryEntity(diaryId);

        // 내용 저장
        DiaryContent content = DiaryContent.builder()
                .diary(diary)
                .title(contentRequest.getTitle())
                .content(contentRequest.getContent())
                .build();
        diary.setContent(content);

        // 이미지 저장
        List<DiaryImage> images = new ArrayList<>();
        for (String url : imageUrls) {
            DiaryImage diaryImage = DiaryImage.builder()
                    .diary(diary)
                    .imageUrl(url)
                    .build();
            images.add(diaryImage);
        }
        diary.setImages(images);
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
