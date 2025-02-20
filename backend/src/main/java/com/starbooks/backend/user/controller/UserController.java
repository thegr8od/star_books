package com.starbooks.backend.user.controller;

import com.starbooks.backend.common.ApiResponse;
import com.starbooks.backend.common.ErrorCode;
import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.user.dto.request.RequestChangePasswordDTO;
import com.starbooks.backend.user.dto.request.RequestLoginDTO;
import com.starbooks.backend.user.dto.request.RequestRegisterDTO;
import com.starbooks.backend.user.dto.request.RequestUpdateDTO;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
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

    // == 회원가입 ==
    @Operation(summary = "회원가입", description = "회원 정보를 입력하여 가입합니다.")
    @PostMapping
    public ApiResponse<?> registerUser(@RequestBody RequestRegisterDTO requestDTO) {
        try {
            log.info("RegisterUser Request DTO: {}", requestDTO);
            if (requestDTO.getSnsAccount() == null) {
                requestDTO.setSnsAccount(false);
            }

            userService.registerUser(requestDTO);
            return ApiResponse.createSuccessWithNoContent("회원가입이 완료되었습니다.");
        } catch (Exception e) {
            log.error("회원가입 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_REGISTER_FAILED);
        }
    }

    // == 이메일 중복 검사 API ==
    @Operation(summary = "이메일 중복 검사", description = "이메일이 이미 존재하는지 확인합니다.")
    @GetMapping("/check-email")
    public ApiResponse<?> checkEmailDuplicate(@RequestParam String email) {
        boolean isDuplicate = userService.existsByEmail(email);
        if (isDuplicate) {
            return ApiResponse.createError(ErrorCode.EMAIL_ALREADY_EXIST);
        }
        return ApiResponse.createSuccessWithNoContent("사용 가능한 이메일입니다.");
    }

    // == 닉네임 중복 검사 API ==
    @Operation(summary = "닉네임 중복 검사", description = "닉네임이 이미 존재하는지 확인합니다.")
    @GetMapping("/check-nickname")
    public ApiResponse<?> checkNicknameDuplicate(@RequestParam String nickname) {
        boolean isDuplicate = userService.existsByNickname(nickname);
        if (isDuplicate) {
            return ApiResponse.createError(ErrorCode.NICKNAME_ALREADY_EXIST);
        }
        return ApiResponse.createSuccessWithNoContent("사용 가능한 닉네임입니다.");
    }

    // == 로그인 ==
    @Operation(summary = "로그인", description = "이메일과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody RequestLoginDTO requestDTO, HttpServletResponse response) {
        Authentication authentication = userService.authenticateUser(requestDTO.getEmail(), requestDTO.getPassword(), response);

        if (authentication.isAuthenticated()) {
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 사용자 조회
            Optional<User> userOpt = userService.findByEmail(requestDTO.getEmail());
            if (userOpt.isEmpty()) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }
            User user = userOpt.get();

            // 탈퇴(논리삭제)된 회원은 로그인 불가
            if (!user.getIsActive()) {
                return ApiResponse.createError(ErrorCode.USER_INACTIVE);
            }

            // JWT 생성 (user_id 포함)
            String accessToken = tokenService.generateAccessToken(user);

            // AccessToken -> 헤더
            response.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);

            // 사용자 정보 변환
            ResponseUserDTO responseUser = ResponseUserDTO.fromEntity(user);

            // JSON 응답 본문에 사용자 정보와 Access Token 추가
            Map<String, Object> data = new HashMap<>();
            data.put("user", responseUser);
            data.put("accessToken", accessToken);

            return ApiResponse.createSuccess(data, "로그인 성공");
        }
        return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
    }


    // == 로그아웃 ==
    @Operation(summary = "로그아웃", description = "Refresh Token을 사용하여 로그아웃합니다.")
    @PostMapping("/logout")
    public ApiResponse<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshToken(request);
        if (refreshToken != null && jwtTokenProvider.validateToken(refreshToken)) {
            tokenService.blacklistRefreshToken(refreshToken);

            // 쿠키 제거
            ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                    .maxAge(0)
                    .path("/")
                    .secure(true)
                    .httpOnly(true)
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

            return ApiResponse.createSuccessWithNoContent("로그아웃이 완료되었습니다.");
        }
        return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
    }


    @Operation(summary = "현재 로그인한 사용자 정보 조회", description = "Access Token을 이용해 현재 로그인한 회원 정보를 조회합니다.")
    @GetMapping("/my")
    public ApiResponse<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            log.info("🔹 [getCurrentUser] Authorization 헤더: {}", token);

            if (token == null || !token.startsWith("Bearer ")) {
                log.warn("🚨 Authorization 헤더가 올바르지 않음. token={}", token);
                return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
            }

            String accessToken = token.replace("Bearer ", "").trim();
            log.info("🔹 [getCurrentUser] Access Token: {}", accessToken);

            // ✅ JWT 유효성 검증
            if (!jwtTokenProvider.validateToken(accessToken)) {
                log.error("🚨 JWT 토큰이 유효하지 않음.");
                return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
            }

            // 3. JWT에서 이메일 추출
            String email = jwtTokenProvider.getUserEmail(accessToken);
            log.info("🔹 [getCurrentUser] 추출된 이메일: {}", email);

            if (email == null) {
                log.error("🚨 JWT에서 이메일을 가져올 수 없음.");
                return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
            }

            // ✅ 사용자 정보 조회
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                log.error("🚨 이메일로 사용자 조회 실패: {}", email);
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }

            User user = userOpt.get();
            log.info("✅ [getCurrentUser] 사용자 정보 조회 성공: userId={}, email={}", user.getUserId(), user.getEmail());

            return ApiResponse.createSuccess(ResponseUserDTO.fromEntity(user), "현재 로그인한 사용자 정보 조회 성공");
        } catch (Exception e) {
            log.error("🚨 현재 사용자 정보 조회 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
    }




    // == 회원 탈퇴 (논리 삭제) ==
    @Operation(summary = "회원 탈퇴", description = "회원 탈퇴(논리 삭제)를 수행합니다.")
    @DeleteMapping("/withdraw")
    public ApiResponse<?> withdrawUser(@RequestParam String email, HttpServletResponse response) {
        try {
            userService.withdrawUser(email, response);
            return ApiResponse.createSuccessWithNoContent("회원 탈퇴(논리 삭제)가 완료되었습니다.");
        } catch (Exception e) {
            log.error("회원 탈퇴 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_DELETE_FAILED);
        }
    }


    /// == 토큰 재발급 ==
    @PostMapping("/refresh")
    public ApiResponse<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken,
                                       HttpServletResponse response) {
        log.info("🔹 Received refreshToken: {}", refreshToken);

        try {
            if (refreshToken == null || refreshToken.isEmpty()) {
                log.error("🚨 Refresh Token이 없습니다.");
                return ApiResponse.createError(ErrorCode.REFRESH_TOKEN_BLACKLISTED);
            }

            ResponseRefreshTokenDTO tokenDto = tokenService.refreshToken(refreshToken);
            if (tokenDto == null || tokenDto.getAccessToken() == null) {
                log.error("🚨 Refresh Token이 유효하지 않음.");
                return ApiResponse.createError(ErrorCode.REFRESH_TOKEN_BLACKLISTED);
            }

            // ✅ 새 Access Token을 응답 JSON에 포함
            Map<String, Object> data = new HashMap<>();
            data.put("accessToken", tokenDto.getAccessToken());

            return ApiResponse.createSuccess(data, "Access Token 재발급 성공");
        } catch (Exception e) {
            log.error("🚨 Refresh Token 재발급 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.INVALID_JWT_TOKEN);
        }
    }



    // == 사용자 정보 조회 ==
    @Operation(summary = "사용자 정보 조회", description = "회원 ID를 기반으로 사용자 정보를 조회합니다.")
    @GetMapping("/detail")
    public ApiResponse<?> getUserInfo(@RequestParam Long userId) {
        try {
            ResponseUserDTO userInfo = userService.getUserInfo(userId);
            return ApiResponse.createSuccess(userInfo, "유저 정보 조회 성공");
        } catch (Exception e) {
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
    }

    // ===== 프로필 업데이트 API 추가 =====

    // == 프로필 이미지 업데이트 ==
    @Operation(summary = "프로필 이미지 업데이트", description = "회원의 프로필 이미지를 업데이트합니다.")
    @PostMapping(value = "/profile/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<?> updateProfileImage(
            @RequestParam String email,
            @RequestPart("profileImageFile") MultipartFile profileImageFile) {
        try {
            userService.updateUserProfileImage(email, profileImageFile);
            return ApiResponse.createSuccessWithNoContent("프로필 이미지 업데이트 성공");
        } catch (IOException e) {
            log.error("프로필 이미지 업데이트 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_REGISTER_FAILED);
        } catch (Exception e) {
            log.error("프로필 이미지 업데이트 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
    }

    // == 프로필 텍스트 업데이트 ==
    @Operation(summary = "프로필 텍스트 업데이트", description = "회원의 프로필 텍스트 정보를 업데이트합니다.")
    @PutMapping("/profile/text")
    public ApiResponse<?> updateProfileText(@RequestBody RequestUpdateDTO dto) {
        try {
            userService.updateUserProfileText(dto);
            return ApiResponse.createSuccessWithNoContent("프로필 텍스트 업데이트 성공");
        } catch (Exception e) {
            log.error("프로필 텍스트 업데이트 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
    }

    // == 프로필 이미지 조회 ==
    @Operation(summary = "프로필 이미지 조회", description = "회원의 프로필 이미지를 조회합니다.")
    @GetMapping("/profile/image")
    public ApiResponse<?> getProfileImage(@RequestParam String email) {
        try {
            String imageUrl = userService.getUserProfileImage(email);
            if (imageUrl == null || imageUrl.isEmpty()) {
                return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
            }
            return ApiResponse.createSuccess(imageUrl, "프로필 이미지 조회 성공");
        } catch (Exception e) {
            log.error("프로필 이미지 조회 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
    }


    @PostMapping("/change-password")
    public ApiResponse<?> changePassword(@RequestBody RequestChangePasswordDTO dto) {
        try {
            userService.changePassword(dto);
            return ApiResponse.createSuccessWithNoContent("비밀번호 변경이 완료되었습니다.");
        } catch (Exception e) {
            log.error("비밀번호 변경 실패: {}", e.getMessage());
            return ApiResponse.createError(ErrorCode.USER_UPDATE_FAILED);
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
