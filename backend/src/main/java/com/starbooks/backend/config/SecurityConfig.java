package com.starbooks.backend.config;

import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.oauth2.dto.CustomOAuth2User;
import com.starbooks.backend.oauth2.service.CustomOAuth2UserService;
import com.starbooks.backend.user.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final TokenService tokenService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(CustomUserDetailsService customUserDetailsService,
                                                       PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(authProvider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF, CORS 설정 (필요에 따라 조정)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable())
                // 세션을 STATELESS로 설정
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 기본적으로 /member, /member/login 등은 인증 없이 접근 가능
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/member", "/member/login", "/oauth2/**").permitAll()
                        .anyRequest().authenticated()
                )
                // OAuth2 로그인 설정 추가 (JWT 필터와 함께 사용)
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler((request, response, authentication) -> {
                            // OAuth2 인증 성공 시 CustomOAuth2User 객체를 추출
                            CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();
                            String email = oauthUser.getEmail();

                            // TokenService를 통해 JWT 토큰 생성
                            String accessToken = tokenService.generateAccessToken(email);
                            String refreshToken = tokenService.generateRefreshToken(email);

                            // refreshToken을 쿠키에 저장 (환경에 따라 secure, domain 등 설정)
                            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                                    .httpOnly(true)
                                    .secure(true)  // HTTPS 사용 시 true (개발 환경에 맞게 조정)
                                    .maxAge(60 * 60 * 24 * 14)  // 14일
                                    .path("/")
                                    .sameSite("None")
                                    .build();

                            // accessToken은 HTTP 헤더에 설정
                            response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
                            response.setHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

                            // 인증 성공 후 프론트엔드 URL로 리다이렉트 (예: http://localhost:3000/)
                            response.sendRedirect("http://localhost:3000/");
                        })
                )
                // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 전에 추가
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider, customUserDetailsService);
    }
}
