package com.starbooks.backend.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetNewPasswordDTO {
    private String newPassword;
}
