package com.starbooks.backend.universe.dto.response;

import com.starbooks.backend.universe.model.PersonalUniv;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class ResponsePersonalUnivDTO {
    private Long universeId;
    private Long diaryEmotionId;  // ✅ Key 역할
    private Long diaryId;  // ✅ diaryEmotion이 참조하는 diary_id
    private Float xCoord;
    private Float yCoord;
    private LocalDateTime updatedAt;

    public ResponsePersonalUnivDTO(PersonalUniv personalUniv) {
        this.universeId = personalUniv.getUniverseId();
        this.diaryEmotionId = personalUniv.getDiaryEmotion().getDiaryEmotionId();  // ✅ diaryEmotion 객체에서 ID 추출
        this.diaryId = personalUniv.getDiaryEmotion().getDiary().getDiaryId();  // ✅ diaryEmotion이 참조하는 diary_id 가져오기
        this.xCoord = personalUniv.getXCoord();
        this.yCoord = personalUniv.getYCoord();
        this.updatedAt = personalUniv.getUpdatedAt();
    }
}
