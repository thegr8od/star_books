package com.starbooks.backend.oauth2.handler;

import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.oauth2.dto.CustomOAuth2User;
import com.starbooks.backend.user.model.Gender;
import com.starbooks.backend.user.model.Role;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.UserRepository;
import com.starbooks.backend.user.service.TokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
@Slf4j
@RequiredArgsConstructor
public class CustomOAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();
        String email;
        String name = null;

        log.info("✅ OAUTH 연동 성공, Principal: {}", principal);

        // OIDC (구글) 로그인 처리
        if (principal instanceof DefaultOidcUser) {
            DefaultOidcUser oidcUser = (DefaultOidcUser) principal;
            email = oidcUser.getAttribute("email");
            name = oidcUser.getAttribute("name");
        }
        // 커스텀 OAuth2 사용자 처리 (예: 네이버 등)
        else if (principal instanceof CustomOAuth2User) {
            CustomOAuth2User customUser = (CustomOAuth2User) principal;
            email = customUser.getEmail();
            name = customUser.getName();
        } else {
            throw new IllegalStateException("알 수 없는 사용자 유형");
        }

        if (email == null || email.isEmpty()) {
            log.error("🚨 로그인 성공했지만 이메일 정보를 가져올 수 없습니다.");
            response.sendRedirect("https://starbooks.site/error");
            return;
        }

        // ✅ `final`로 고정된 변수 선언
        final String fixedName = (name != null) ? name : "Unknown User";

        // ✅ 회원가입 또는 로그인 처리 (기존 사용자 확인)
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .password(null) // OAuth2 로그인이므로 비밀번호는 null 처리
                    .nickname(fixedName) // ✅ `final String fixedName` 사용하여 오류 해결
                    .gender(Gender.OTHER) // 기본값 (필요 시 수정)
                    .snsAccount(true) // OAuth2 로그인 사용자는 snsAccount = true
                    .role(Role.member)
                    .isActive(true)
                    .build();
            userRepository.save(newUser);
            log.info("🎉 신규 사용자 등록 성공: {}", email);
            return newUser;
        });

        log.info("✅ 로그인한 사용자: {}", user.getEmail());

        // ✅ JWT 토큰 생성 (user_id, role, nickname 포함)
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        // ✅ Refresh Token을 HttpOnly Secure 쿠키에 저장
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .maxAge(60 * 60 * 24 * 14) // 14일 유지
                .path("/")
                .domain("starbooks.site")
                .build();
        response.setHeader("Set-Cookie", refreshTokenCookie.toString());

        // ✅ Access Token을 URL 파라미터로 전달
        String targetUrl = UriComponentsBuilder.fromUriString("https://starbooks.site/")
                .queryParam("token", accessToken)
                .build().toUriString();

        log.info("✅ OAuth 로그인 완료, 리다이렉트 URL: {}", targetUrl);

        // ✅ 백엔드에서 프론트엔드로 리다이렉트
        response.sendRedirect(targetUrl);
    }
}
