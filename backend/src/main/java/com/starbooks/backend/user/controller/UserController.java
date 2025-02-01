package com.starbooks.backend.user.controller;

import com.starbooks.backend.common.ApiResponse;
import com.starbooks.backend.common.ErrorCode;
import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.user.dto.request.RequestLoginDTO;
import com.starbooks.backend.user.dto.request.RequestRegisterDTO;
import com.starbooks.backend.user.dto.request.RequestUpdateDTO;
import com.starbooks.backend.user.dto.response.ResponseRefreshTokenDTO;
import com.starbooks.backend.user.dto.response.ResponseUserDTO;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.service.TokenService;
import com.starbooks.backend.user.service.UserService;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TokenService tokenService;
    private final JwtTokenProvider jwtTokenProvider;

    // == 회원가입 (이미지 X) ==
    @PostMapping
    public ApiResponse<?> registerUser(@RequestBody RequestRegisterDTO requestDTO) {
        try {
            log.info("RegisterUser Request DTO: {}", requestDTO);

            // 회원가입 (이메일, 비밀번호, 닉네임 등 텍스트만 처리)
            userService.registerUser(requestDTO);

            return ApiResponse.createSuccessWithNoContent("회원가입이 완료되었습니다.");
        } catch (Exception e) {
            log.error("회원가입 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_REGISTER_FAILED);
        }
    }

    // == 프로필 이미지 업로드/수정 (이미지만 별도) ==
    @PostMapping("/profile-image")
    public ApiResponse<?> uploadProfileImage(
            @RequestParam("email") String email,
            @RequestPart("profileImage") MultipartFile profileImageFile
    ) {
        try {
            log.info("프로필 이미지 업로드 요청: email={}, file={}",
                    email,
                    (profileImageFile != null ? profileImageFile.getOriginalFilename() : "No file uploaded"));

            // 이미지 파일을 받아서 Service 계층으로 전달
            // 프로필 이미지만 업데이트하는 로직
            userService.updateUserProfile(email, new RequestUpdateDTO(), profileImageFile);

            return ApiResponse.createSuccessWithNoContent("프로필 이미지 업로드(수정) 성공");
        } catch (Exception e) {
            log.error("프로필 이미지 업로드 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_UPDATE_FAILED);
        }
    }

    // == 로그인 ==
    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody RequestLoginDTO requestDTO, HttpServletResponse response) {
        Authentication authentication = userService.authenticateUser(requestDTO.getEmail(), requestDTO.getPassword());
        if (authentication.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = tokenService.generateAccessToken(authentication.getName());
            String refreshToken = tokenService.generateRefreshToken(authentication.getName());

            // RefreshToken -> 쿠키 저장
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

            // 사용자 정보
            Optional<User> userOpt = userService.findByEmail(requestDTO.getEmail());
            if (userOpt.isEmpty()) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }
            ResponseUserDTO responseUser = ResponseUserDTO.fromEntity(userOpt.get());
            return ApiResponse.createSuccess(responseUser, "로그인 성공");
        }
        return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
    }

    // == 로그아웃 ==
    @PostMapping("/logout")
    public ApiResponse<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshToken(request);
        if (refreshToken != null && jwtTokenProvider.validateToken(refreshToken)) {
            tokenService.blacklistRefreshToken(refreshToken);

            // 쿠키 제거
            Cookie deleteCookie = new Cookie("refreshToken", null);
            deleteCookie.setMaxAge(0);
            deleteCookie.setPath("/");
            deleteCookie.setSecure(true);
            deleteCookie.setHttpOnly(true);
            response.addCookie(deleteCookie);

            return ApiResponse.createSuccessWithNoContent("로그아웃이 완료되었습니다.");
        }
        return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
    }

    // == 토큰 재발급 ==
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

            // 새 refreshToken 쿠키
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokenDto.getRefreshToken())
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(60L * 60 * 24 * 14)
                    .domain("localhost")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            // 새 AccessToken 헤더
            response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + tokenDto.getAccessToken());

            return ApiResponse.createSuccessWithNoContent("Access Token 재발급 성공");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
        }
    }

    // == 사용자 정보 조회 ==
    @GetMapping("/detail")
    public ApiResponse<?> getUserInfo(@RequestParam Long userId) {
        try {
            ResponseUserDTO userInfo = userService.getUserInfo(userId);
            return ApiResponse.createSuccess(userInfo, "유저 정보 조회 성공");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
    }

    // == 프로필 수정 (이미지 제외) ==
    @PutMapping("/detail")
    public ApiResponse<?> updateProfile(@RequestBody RequestUpdateDTO requestDTO) {
        try {
            // 이미지는 제외하고, 닉네임 등 텍스트 정보만 업데이트
            // RequestUpdateDTO 내부 필드를 활용
            log.info("프로필 텍스트 업데이트: {}", requestDTO);

            userService.updateUserProfileText(requestDTO);
            return ApiResponse.createSuccessWithNoContent("프로필 텍스트 업데이트 성공");
        } catch (Exception e) {
            log.error("프로필 업데이트 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_UPDATE_FAILED);
        }
    }

    // == 회원 탈퇴 ==
    @DeleteMapping
    public ApiResponse<?> withdrawUser(@RequestParam("email") String email, HttpServletResponse response) {
        try {
            userService.deleteUserByEmail(email);

            // refresh 쿠키 제거
            Cookie deleteCookie = new Cookie("refreshToken", null);
            deleteCookie.setMaxAge(0);
            deleteCookie.setPath("/");
            deleteCookie.setSecure(true);
            deleteCookie.setHttpOnly(true);
            response.addCookie(deleteCookie);

            return ApiResponse.createSuccessWithNoContent("회원 탈퇴가 완료되었습니다.");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.USER_DELETE_FAILED);
        }
    }

    // == Refresh Token 쿠키 추출 ==
    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if ("refreshToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
