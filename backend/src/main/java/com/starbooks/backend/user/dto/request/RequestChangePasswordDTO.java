package com.starbooks.backend.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestChangePasswordDTO {
    private String email;
    private String oldPassword;
    private String newPassword;
}
