package com.starbooks.backend.user.dto.request;

import com.starbooks.backend.user.model.Gender;
import com.starbooks.backend.user.model.Role;
import com.starbooks.backend.user.model.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestRegisterDTO {

    private String email;
    private String password;
    private String nickname;
    private Gender gender;
    private String kakaoId;
    private Role role;    // 기본 member
    private Boolean isActive;

    public User toEntity() {
        return User.builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                .gender(gender)
                .kakaoId(kakaoId)
                .role(role != null ? role : Role.member)
                .isActive(isActive != null ? isActive : true)
                .build();
    }
}
