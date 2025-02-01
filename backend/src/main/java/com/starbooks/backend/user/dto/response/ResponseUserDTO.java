package com.starbooks.backend.user.dto.response;

import com.starbooks.backend.user.model.Gender;
import com.starbooks.backend.user.model.Role;
import com.starbooks.backend.user.model.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseUserDTO {

    private Long userId;
    private String email;
    private String nickname;
    private Gender gender;
    private String kakaoId;
    private Role role;
    private Boolean isActive;
    private String profileImagePath;

    public static ResponseUserDTO fromEntity(User user) {
        return ResponseUserDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .gender(user.getGender())
                .kakaoId(user.getKakaoId())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .profileImagePath(
                        user.getProfileImage() != null
                                ? user.getProfileImage().getSaveFilePath()
                                : null
                )
                .build();
    }
}
