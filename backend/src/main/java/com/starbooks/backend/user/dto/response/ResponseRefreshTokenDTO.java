package com.starbooks.backend.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResponseRefreshTokenDTO {
    private String accessToken;
    private String refreshToken;
}
