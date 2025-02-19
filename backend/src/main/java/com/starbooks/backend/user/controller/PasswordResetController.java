package com.starbooks.backend.user.controller;

import com.starbooks.backend.common.ApiResponse;
import com.starbooks.backend.common.ErrorCode;
import com.starbooks.backend.user.dto.request.PasswordResetRequestDTO;
import com.starbooks.backend.user.dto.request.PasswordResetNewPasswordDTO;
import com.starbooks.backend.user.model.PasswordResetToken;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.service.EmailService;
import com.starbooks.backend.user.service.PasswordResetTokenService;
import com.starbooks.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/api/password")
@RequiredArgsConstructor
public class PasswordResetController {

    private final UserService userService;
    private final PasswordResetTokenService tokenService;
    private final EmailService emailService;

    // 1. 비밀번호 재설정 요청 (이메일 발송)
    @PostMapping("/reset-request")
    public ApiResponse<?> requestPasswordReset(@RequestBody PasswordResetRequestDTO dto) {
        // 사용자 존재 확인 (Optional 처리)
        User user = userService.findByEmail(dto.getEmail()).orElse(null);
        if (user == null) {
            return ApiResponse.createError(ErrorCode.USER_NOT_FOUND);
        }
        // 토큰 생성
        PasswordResetToken token = tokenService.createToken(user);
        // 재설정 URL 구성 (실제 도메인으로 변경)
        String resetLink = "https://starbooks.site/api/password/reset?token=" + token.getToken();
        // 이메일 발송
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        log.info("비밀번호 재설정 이메일 발송: {}", user.getEmail());
        return ApiResponse.createSuccessWithNoContent("비밀번호 재설정 이메일이 발송되었습니다.");
    }

    // 2. 비밀번호 재설정 처리
    // 토큰은 URL 쿼리 파라미터에서, 새 비밀번호는 요청 본문에서 받음
    @PostMapping("/reset")
    public ApiResponse<?> resetPassword(@RequestParam("token") String token,
                                        @RequestBody PasswordResetNewPasswordDTO dto) {
        PasswordResetToken resetToken = tokenService.getToken(token)
                .orElseThrow(() -> new RuntimeException(ErrorCode.PASSWORD_RESET_TOKEN_NOT_VALID.getMessage()));
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ApiResponse.createError(ErrorCode.PASSWORD_RESET_TOKEN_NOT_VALID);
        }
        User user = resetToken.getUser();
        userService.updatePassword(user, dto.getNewPassword());
        tokenService.deleteToken(resetToken);
        log.info("비밀번호 재설정 완료: {}", user.getEmail());
        return ApiResponse.createSuccessWithNoContent("비밀번호가 성공적으로 변경되었습니다.");
    }
}
