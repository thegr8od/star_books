package com.starbooks.backend.oauth2.dto;

import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
public class GoogleResponse implements OAuth2Response {

    private final Map<String, Object> attributes;

    public GoogleResponse(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProvider() {
        return "google";
    }

    @Override
    public String getProviderId() {
        // Google의 경우 "sub" 필드가 고유 식별자입니다.
        return attributes.get("sub").toString();
    }

    @Override
    public String getEmail() {
        log.info("GoogleResponse Attributes: {}", attributes);
        Object emailObj = attributes.get("email");
        if (emailObj == null) {
            log.error("Google에서 이메일 정보를 가져올 수 없습니다. 응답: {}", attributes);
            throw new RuntimeException("구글 로그인 시 이메일을 가져올 수 없습니다.");
        }
        return emailObj.toString();
    }

    @Override
    public String getName() {
        return attributes.get("name").toString();
    }
}
