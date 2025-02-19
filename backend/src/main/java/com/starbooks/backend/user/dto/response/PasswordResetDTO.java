package com.starbooks.backend.user.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetDTO {
    private String token;
    private String newPassword;
}
