package com.starbooks.backend.user.dto.request;

import com.starbooks.backend.user.model.Gender;
import com.starbooks.backend.user.model.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "사용자 정보 업데이트 요청 DTO")
public class RequestUpdateDTO {

    @Schema(description = "사용자 이메일 (필수)", example = "user@example.com")
    private String email;

    @Schema(description = "닉네임 (선택)", example = "updated_nickname")
    private String nickname;

    @Schema(description = "성별 (선택)", example = "FEMALE", allowableValues = {"MALE", "FEMALE", "OTHER"})
    private Gender gender;

    @Schema(description = "SNS 계정 여부 (선택)", example = "true")
    private Boolean snsAccount;

    @Schema(description = "사용자 역할 (선택)", example = "admin", allowableValues = {"member", "admin"})
    private Role role;

    @Schema(description = "계정 활성화 여부 (선택)", example = "false")
    private Boolean isActive;
}
