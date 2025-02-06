package com.starbooks.backend.user.dto.request;

import com.starbooks.backend.user.model.Gender;
import com.starbooks.backend.user.model.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestUpdateDTO {

    private String email;      // <== 추가

    private String nickname;
    private Gender gender;
    private String kakaoId;
    private Role role;
    private Boolean isActive;
}
