package com.starbooks.backend.oauth2.service;

import java.util.Optional;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.starbooks.backend.oauth2.dto.GoogleResponse;
import com.starbooks.backend.oauth2.dto.NaverResponse;
import com.starbooks.backend.oauth2.dto.OAuth2Response;
import com.starbooks.backend.oauth2.dto.CustomOAuth2User;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.model.Role;
import com.starbooks.backend.user.repository.jpa.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. 공급자에서 사용자 정보 획득
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response;

        if ("google".equalsIgnoreCase(registrationId)) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else if ("naver".equalsIgnoreCase(registrationId)) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("지원하지 않는 공급자: " + registrationId);
        }

        // 2. 이메일을 고유 식별자로 사용하여 회원 존재 여부 확인
        String email = oAuth2Response.getEmail();
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // 기존 회원의 이름(닉네임) 업데이트 (필요에 따라 추가 업데이트 가능)
            user.setNickname(oAuth2Response.getName());
            userRepository.save(user);
        } else {
            // 신규 회원 가입 (비밀번호는 OAuth2 전용이므로 빈 문자열 또는 임의의 값 할당)
            user = User.builder()
                    .email(email)
                    .password("") // OAuth2 로그인용이므로 실제 패스워드는 사용하지 않음
                    .nickname(oAuth2Response.getName())
                    .gender(null)  // 기본값 (필요하면 default 값 지정)
                    .kakaoId(null)
                    .role(Role.member)  // 기본 회원 권한
                    .isActive(true)
                    .build();
            userRepository.save(user);
        }

        // 3. OAuth2User 구현체(CustomOAuth2User) 반환 (기존 User 엔티티와 공급자에서 받은 전체 attributes 전달)
        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }
}
