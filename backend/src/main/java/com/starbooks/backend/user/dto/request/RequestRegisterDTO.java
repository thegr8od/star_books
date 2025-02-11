package com.starbooks.backend.user.dto.request;

import com.starbooks.backend.user.model.Gender;
import com.starbooks.backend.user.model.Role;
import com.starbooks.backend.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "회원가입 요청 DTO")
public class RequestRegisterDTO {

    @Schema(description = "사용자 이메일 (필수)", example = "user@example.com")
    private String email;

    @Schema(description = "비밀번호 (필수)", example = "password123")
    private String password;

    @Schema(description = "닉네임 (필수)", example = "star_user")
    private String nickname;

    @Schema(description = "성별", example = "MALE", allowableValues = {"MALE", "FEMALE", "OTHER"})
    private Gender gender;

    @Schema(description = "SNS 계정 여부 (기본값: false)", example = "false", defaultValue = "false")
    private Boolean snsAccount;

    @Schema(description = "사용자 역할 (기본값: member)", example = "member", defaultValue = "member", allowableValues = {"member", "admin"})
    private Role role;

    @Schema(description = "계정 활성화 여부 (기본값: true)", example = "true", defaultValue = "true")
    private Boolean isActive;

    public User toEntity() {
        return User.builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                .gender(gender)
                .snsAccount(snsAccount != null ? snsAccount : false)
                .role(role != null ? role : Role.member)
                .isActive(isActive != null ? isActive : true)
                .build();
    }
}
