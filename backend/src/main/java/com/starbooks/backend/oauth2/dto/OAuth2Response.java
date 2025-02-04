package com.starbooks.backend.oauth2.dto;

public interface OAuth2Response {
    // 공급자(ex. google, naver)
    String getProvider();
    // 공급자가 발급한 고유 아이디
    String getProviderId();
    // 이메일
    String getEmail();
    // 사용자 이름
    String getName();
}
