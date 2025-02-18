package com.starbooks.backend.universe.dto.response;

import com.starbooks.backend.universe.model.PersonalUniv;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ResponsePersonalUnivDTO {
    private Long universeId;
    private Long diaryEmotionId;
    private Long diaryId;
    private Float xCoord;
    private Float yCoord;
    private Float xValue;  // ✅ diaryEmotion의 x_value 추가
    private Float yValue;  // ✅ diaryEmotion의 y_value 추가
    private LocalDateTime updatedAt;

    public ResponsePersonalUnivDTO(PersonalUniv personalUniv) {
        this.universeId = personalUniv.getUniverseId();
        this.diaryEmotionId = personalUniv.getDiaryEmotion().getDiaryEmotionId();
        this.diaryId = personalUniv.getDiaryEmotion().getDiary().getDiaryId();
        this.xCoord = personalUniv.getXCoord();
        this.yCoord = personalUniv.getYCoord();
        this.updatedAt = personalUniv.getUpdatedAt();

        // ✅ diaryEmotion의 x_value, y_value 추가
        this.xValue = personalUniv.getDiaryEmotion().getXValue();
        this.yValue = personalUniv.getDiaryEmotion().getYValue();
    }
}
