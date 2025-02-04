package com.starbooks.backend.oauth2.dto;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.model.Role;

/**
 * OAuth2 인증 후 스프링 시큐리티에 등록될 사용자 정보를 담는 클래스
 */
public class CustomOAuth2User implements OAuth2User {

    private final User user;
    private final Map<String, Object> attributes;

    public CustomOAuth2User(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    public User getUser() {
        return user;
    }

    public String getEmail() {
        return user.getEmail();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 기존 User의 role (ENUM) 을 "ROLE_MEMBER", "ROLE_MANAGER" 등 형식으로 변환
        return Collections.singleton(() -> "ROLE_" + user.getRole().name().toUpperCase());
    }

    @Override
    public String getName() {
        return user.getNickname();
    }
}
