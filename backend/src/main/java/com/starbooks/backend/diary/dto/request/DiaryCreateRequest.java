package com.starbooks.backend.diary.dto.request;

import jakarta.persistence.SecondaryTable;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
public class DiaryCreateRequest {
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate diaryDate;
}
