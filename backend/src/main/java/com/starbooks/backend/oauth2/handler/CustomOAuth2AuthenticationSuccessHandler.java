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

        if (principal instanceof DefaultOidcUser) {
            DefaultOidcUser oidcUser = (DefaultOidcUser) principal;
            email = oidcUser.getAttribute("email");
            name = oidcUser.getAttribute("name");
        } else if (principal instanceof CustomOAuth2User) {
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

        final String fixedName = (name != null) ? name : "Unknown User";

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .password(null)
                    .nickname(fixedName)
                    .gender(Gender.OTHER)
                    .snsAccount(true)
                    .role(Role.member)
                    .isActive(true)
                    .build();
            userRepository.save(newUser);
            log.info("🎉 신규 사용자 등록 성공: {}", email);
            return newUser;
        });

        log.info("✅ 로그인한 사용자: {}", user.getEmail());

        // ✅ JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        // ✅ 액세스 토큰은 URL 쿼리 파라미터로 전달 (보안에 유의, 필요 시 암호화 고려)
        String targetUrl = UriComponentsBuilder.fromUriString("https://starbooks.site")
                .queryParam("accessToken", accessToken)
                .build().toUriString();

        // ✅ Refresh Token을 HttpOnly Secure 쿠키에 저장
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .maxAge(60 * 60 * 24 * 14)
                .path("/")
                .domain("starbooks.site")
                .build();
        response.setHeader("Set-Cookie", refreshTokenCookie.toString());

        log.info("✅ OAuth 로그인 완료, 리다이렉트 URL: {}", targetUrl);
        response.sendRedirect(targetUrl);
    }
}
