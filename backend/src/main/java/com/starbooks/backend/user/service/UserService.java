package com.starbooks.backend.user.service;

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
     * 프로필 이미지 포함 전체 업데이트
     * (이미지 파일이 있다면 업로드, RequestUpdateDTO로 텍스트 정보도 함께 업데이트)
     */
    void updateUserProfile(String email, RequestUpdateDTO dto, MultipartFile profileImageFile) throws IOException;

    /**
     * 프로필 '텍스트 정보'만 업데이트 (이미지 제외)
     */
    void updateUserProfileText(RequestUpdateDTO dto);

    Authentication authenticateUser(String email, String password);

    boolean existsByEmail(String email);


}
