package com.starbooks.backend.diary.dto.request;

import com.starbooks.backend.diary.model.Diary;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DiaryHashtagRequest {

    @NotEmpty(message = "해시태그 목록은 비어 있을 수 없습니다.")
    private List<Diary.HashtagType> hashtags;
}
