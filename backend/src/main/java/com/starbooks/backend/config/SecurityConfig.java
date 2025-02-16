package com.starbooks.backend.config;

import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.oauth2.handler.CustomOAuth2AuthenticationSuccessHandler;
import com.starbooks.backend.oauth2.service.CustomOAuth2UserService;
import com.starbooks.backend.user.service.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.List;

/**
 * Spring Security 전체 설정
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final TokenService tokenService;
    private final CustomOAuth2AuthenticationSuccessHandler customOAuth2AuthenticationSuccessHandler;
    private final CustomUserDetailsService customUserDetailsService;

    /**
     * 비밀번호 암호화
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * AuthenticationManager 설정
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Spring Security 필터 체인
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // 1) CSRF, CORS, 세션 사용 안 함
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 2) 인증 실패 시 HTML이 아닌 JSON을 반환
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(customAuthenticationEntryPoint())
                )

                // 3) 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 3-1) 회원가입, 로그인, OAuth2 콜백 등은 토큰 없어도 접근 가능
                        .requestMatchers(
                                "/api/member",
                                "/api/member/login",
                                "/api/member/check-nickname",
                                "api/member/check-email",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/oauth_test.html",
                                "/index.html",
                                "/api/member/refresh"
                        ).permitAll()

                        // 3-2) 예: POST /api/chat/** 는 인증 필요
                        .requestMatchers(HttpMethod.POST, "/api/chat/**").authenticated()

                        // 3-3) 관리자 페이지
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // 3-4) 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )

                // 4) OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(customOAuth2AuthenticationSuccessHandler)
                )

                // 5) JWT 필터 등록 (인증 처리)
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS 설정
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("https://i12d206.p.ssafy.io", "http://localhost:5173")); // 허용할 도메인
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Swagger 경로 등 특정 요청은 Security 필터 체인 자체에서 제외
     * → JWT 필터도 안 타므로 401 발생 X
     */
    @Bean
    public WebSecurityCustomizer securityCustomizer() {
        return web -> web.ignoring().requestMatchers(
                "/v3/api-docs",
                "/ws/**",
                "/radio/**",
                "/v3/api-docs/**",
                "/swagger-resources/**",
                "/swagger-ui/**",
                "/webjars/**",
                // 필요하다면 "/swagger-ui.html" 등 추가
                "/swagger/**"
        );
    }

    /**
     * JWT 인증 필터
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider, customUserDetailsService);
    }

    /**
     * 인증이 필요한 엔드포인트에 토큰이 없거나, 잘못된 토큰을 보냈을 때
     * HTML이 아닌 JSON 포맷으로 401 응답
     */
    @Bean
    public AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(
                    "{\"error\": \"Unauthorized\", \"message\": \"인증이 필요합니다.\"}"
            );
        };
    }
}
