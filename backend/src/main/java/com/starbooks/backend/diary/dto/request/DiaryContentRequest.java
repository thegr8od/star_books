package com.starbooks.backend.diary.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DiaryContentRequest {
    private String title;
    private String content;
}
