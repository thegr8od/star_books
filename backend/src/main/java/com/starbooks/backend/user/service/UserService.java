package com.starbooks.backend.user.service;

import com.starbooks.backend.user.dto.request.RequestChangePasswordDTO;
import com.starbooks.backend.user.dto.request.RequestRegisterDTO;
import com.starbooks.backend.user.dto.request.RequestUpdateDTO;
import com.starbooks.backend.user.dto.response.ResponseUserDTO;
import com.starbooks.backend.user.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

public interface UserService {
    void registerUser(RequestRegisterDTO dto);

    Optional<User> findByEmail(String email);

    ResponseUserDTO getUserInfo(Long userId);

    void deleteUserByEmail(String email);

    /**
     * 프로필 '이미지'만 업데이트
     */
    void updateUserProfileImage(String email, MultipartFile profileImageFile) throws IOException;

    /**
     * 프로필 '텍스트 정보'만 업데이트 (이미지 제외)
     */
    void updateUserProfileText(RequestUpdateDTO dto);

    Authentication authenticateUser(String email, String password);

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    void changePassword(RequestChangePasswordDTO dto);
}
