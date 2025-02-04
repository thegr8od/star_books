package com.starbooks.backend.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestLoginDTO {
    private String email;
    private String password;
}
