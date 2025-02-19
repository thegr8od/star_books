package com.starbooks.backend.oauth2.service;

import com.starbooks.backend.oauth2.dto.CustomOAuth2User;
import com.starbooks.backend.oauth2.dto.GoogleResponse;
import com.starbooks.backend.oauth2.dto.NaverResponse;
import com.starbooks.backend.oauth2.dto.OAuth2Response;
import com.starbooks.backend.user.model.Gender;
import com.starbooks.backend.user.model.Role;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final EntityManager entityManager; // 추가

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info(" OAuth2 로그인 요청: {}", userRequest.getClientRegistration().getRegistrationId());

        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info(" OAuth2User Attributes: {}", oAuth2User.getAttributes());

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response;

        if ("google".equalsIgnoreCase(registrationId)) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        } else if ("naver".equalsIgnoreCase(registrationId)) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("지원하지 않는 OAuth Provider: " + registrationId);
        }

        String email = oAuth2Response.getEmail();
        log.info("📧 가져온 OAuth2 이메일: {}", email);

        if (email == null || email.isEmpty()) {
            log.error("🚨 이메일 값이 null이거나 비어 있습니다.");
            throw new OAuth2AuthenticationException("이메일이 없습니다.");
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user;

        if (optionalUser.isPresent()) {
            user = optionalUser.get();
            log.info("✅ 기존 유저 로그인: {}", user.getEmail());
        } else {
            user = User.builder()
                    .email(email)
                    .password(null)  // OAuth 로그인 사용자는 비밀번호 없음
                    .nickname(oAuth2Response.getName() != null ? oAuth2Response.getName() : "Unknown User")
                    .gender(Gender.OTHER)  // 기본값 설정
                    .snsAccount(true)  // ✅ 소셜 로그인 계정임을 명확히 설정
                    .role(Role.member)  // ✅ 일반 사용자와 동일하게 설정
                    .isActive(true)  // ✅ 활성화된 계정으로 설정
                    .build();

            userRepository.save(user);
            log.info("✅ 소셜 로그인 사용자 저장 완료: {}", user);


            log.info("📥 새 유저 등록 시도: {}", user);
            try {
                userRepository.save(user);
                entityManager.flush(); // 강제 Flush (JPA 영속성 컨텍스트 반영)
                log.info("🎉 새 유저 등록 성공: {}", user.getEmail());
            } catch (Exception e) {
                log.error("🚨 유저 저장 실패! 에러: {}", e.getMessage(), e);
            }
        }

        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }
}
