package com.starbooks.backend.user.service;

import com.starbooks.backend.user.dto.request.RequestChangePasswordDTO;
import com.starbooks.backend.user.dto.request.RequestRegisterDTO;
import com.starbooks.backend.user.dto.request.RequestUpdateDTO;
import com.starbooks.backend.user.dto.response.ResponseUserDTO;
import com.starbooks.backend.user.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Optional;

public interface UserService {
    void registerUser(RequestRegisterDTO dto);

    Optional<User> findByEmail(String email);

    ResponseUserDTO getUserInfo(Long userId);

    ResponseUserDTO getCurrentUser(String email);

    void deleteUserByEmail(String email);

    /**
     * 프로필 '이미지'만 업데이트
     */
    void updateUserProfileImage(String email, MultipartFile profileImageFile) throws IOException;

    /**
     * 프로필 '텍스트 정보'만 업데이트 (이미지 제외)
     */
    void updateUserProfileText(RequestUpdateDTO dto);

    /**
     * ✅ 일반 로그인 - Refresh Token을 HttpOnly 쿠키에 저장
     */
    Authentication authenticateUser(String email, String password, HttpServletResponse response); // <-- 추가됨

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    void changePassword(RequestChangePasswordDTO dto);

    String getUserProfileImage(String email);

    void updatePassword(User user, String newPassword);

    /**
     * 로그아웃 - Refresh Token을 블랙리스트에 추가 후 쿠키 제거
     */
    void logoutUser(String refreshToken, HttpServletResponse response);

    /**
     * 회원 탈퇴 - Refresh Token을 블랙리스트에 추가 후 사용자 삭제
     */
    void withdrawUser(String email, HttpServletResponse response);


}
