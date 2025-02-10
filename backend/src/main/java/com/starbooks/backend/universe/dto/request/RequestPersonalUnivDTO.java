package com.starbooks.backend.universe.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RequestPersonalUnivDTO {
    private Long diaryEmotionId;  // ✅ FK (필수)
    private LocalDate logMonth;

    @JsonProperty("xCoord")
    private Float xCoord;

    @JsonProperty("yCoord")
    private Float yCoord;
}
