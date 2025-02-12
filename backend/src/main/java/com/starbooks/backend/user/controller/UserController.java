package com.starbooks.backend.user.controller;

import com.starbooks.backend.common.ApiResponse;
import com.starbooks.backend.common.ErrorCode;
import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.user.dto.request.RequestLoginDTO;
import com.starbooks.backend.user.dto.request.RequestRegisterDTO;
import com.starbooks.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.starbooks.backend.user.dto.response.ResponseUserDTO;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.service.TokenService;
import com.starbooks.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("api/member")
@RequiredArgsConstructor
@Tag(name = "User API", description = "회원 관련 API")
public class UserController {

    private final UserService userService;
    private final TokenService tokenService;
    private final JwtTokenProvider jwtTokenProvider;

    // == 로그인 ==
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody RequestLoginDTO requestDTO, HttpServletResponse response) {
        Authentication authentication = userService.authenticateUser(requestDTO.getEmail(), requestDTO.getPassword());
        if (authentication.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 사용자 조회
            Optional<User> userOpt = userService.findByEmail(requestDTO.getEmail());
            if (userOpt.isEmpty()) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }
            User user = userOpt.get();

            // JWT 생성 (user_id 포함)
            String accessToken = tokenService.generateAccessToken(user);
            String refreshToken = tokenService.generateRefreshToken(user);

            // Refresh Token을 쿠키에 저장
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(60L * 60 * 24 * 14)
                    .domain("localhost")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            // AccessToken -> 헤더
            response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);

            // 사용자 정보 반환
            ResponseUserDTO responseUser = ResponseUserDTO.fromEntity(user);
            return ApiResponse.createSuccess(responseUser, "로그인 성공");
        }
        return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
    }

    // == 토큰 재발급 ==
    @Operation(summary = "토큰 재발급", description = "Refresh Token을 이용하여 새로운 Access Token을 발급합니다.")
    @PostMapping("/refresh")
    public ApiResponse<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                       HttpServletResponse response) {
        try {
            if (refreshToken == null || refreshToken.isEmpty()) {
                return ApiResponse.createError(ErrorCode.REFRESH_TOKEN_BLACKLISTED);
            }

            ResponseRefreshTokenDTO tokenDto = tokenService.refreshToken(refreshToken);
            if (tokenDto == null) {
                return ApiResponse.createError(ErrorCode.REFRESH_TOKEN_BLACKLISTED);
            }

            // 새 refreshToken 쿠키 설정
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokenDto.getRefreshToken())
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(60L * 60 * 24 * 14)
                    .domain("localhost")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            // 새 AccessToken 헤더 설정
            response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenDto.getAccessToken());

            return ApiResponse.createSuccessWithNoContent("Access Token 재발급 성공");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
        }
    }
}
