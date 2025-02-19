package com.starbooks.backend.user.service;

import com.starbooks.backend.common.ErrorCode;
import com.starbooks.backend.common.service.S3Service;
import com.starbooks.backend.user.dto.request.RequestChangePasswordDTO;
import com.starbooks.backend.user.dto.request.RequestRegisterDTO;
import com.starbooks.backend.user.dto.request.RequestUpdateDTO;
import com.starbooks.backend.user.dto.response.ResponseUserDTO;
import com.starbooks.backend.user.model.ProfileImage;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.ProfileImageRepository;
import com.starbooks.backend.user.repository.jpa.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProfileImageRepository profileImageRepository;
    private final S3Service s3Service;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    // == 로그아웃 ==
    @Override
    public void logoutUser(String refreshToken, HttpServletResponse response) {
        if (refreshToken != null && tokenService.isRefreshTokenValid(refreshToken)) {
            tokenService.blacklistRefreshToken(refreshToken);
        }

        // Refresh Token 쿠키 삭제
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .maxAge(0)
                .path("/")
                .secure(true)
                .httpOnly(true)
                .sameSite("None")
                .domain("localhost")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

        log.info("사용자 로그아웃 완료: Refresh Token 블랙리스트 처리됨");
    }

    // == 회원 탈퇴 ==
    @Override
    @Transactional
    public void withdrawUser(String email, HttpServletResponse response) {
        // 사용자의 모든 Refresh Token 블랙리스트 처리
        tokenService.invalidateAllUserTokens(email);

        // 사용자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

        // 논리 삭제: 실제 삭제 대신 is_active 값을 false로 변경
        user.setIsActive(false);
        userRepository.save(user);

        // Refresh Token 쿠키 삭제
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .maxAge(0)
                .path("/")
                .secure(true)
                .httpOnly(true)
                .sameSite("None")
                .domain("localhost")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

        log.info("회원 탈퇴 완료(논리삭제): 이메일={} | 모든 Refresh Token 블랙리스트 처리됨", email);
    }


    // == 회원가입 ==
    @Override
    @Transactional
    public void registerUser(RequestRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException(ErrorCode.EMAIL_ALREADY_EXIST.getMessage());
        }
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        User user = dto.toEntity();
        userRepository.save(user);
        log.info("신규 회원 가입: email={}", user.getEmail());
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public ResponseUserDTO getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));
        return ResponseUserDTO.fromEntity(user);
    }

    @Override
    @Transactional
    public void deleteUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));
        userRepository.delete(user);
        log.info("회원 탈퇴: email={}", email);
    }

    @Override
    @Transactional
    public void updateUserProfileImage(String email, MultipartFile profileImageFile) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            String fileUrl = s3Service.uploadFile(profileImageFile);

            ProfileImage profileImage = user.getProfileImage();
            if (profileImage == null) {
                profileImage = ProfileImage.builder().saveFilePath(fileUrl).build();
                user.assignProfileImage(profileImage);
                profileImageRepository.save(profileImage);
            } else {
                profileImage.updateImagePath(fileUrl);
                profileImageRepository.save(profileImage);
            }
        }
        userRepository.save(user);
    }

    @Override
    public String getUserProfileImage(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

        ProfileImage profileImage = user.getProfileImage();
        return (profileImage != null) ? profileImage.getSaveFilePath() : null;
    }

    @Override
    @Transactional
    public void updateUserProfileText(RequestUpdateDTO dto) {
        if (dto.getEmail() == null) {
            throw new IllegalArgumentException("이메일이 없습니다. 프로필 수정 불가");
        }

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

        if (dto.getNickname() != null) user.setNickname(dto.getNickname());
        if (dto.getGender() != null) user.setGender(dto.getGender());

        userRepository.save(user);
    }

    @Override
    public Authentication authenticateUser(String email, String password) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
    }

    // ... (다른 메서드들 사이에 추가)
    @Override
    public void updatePassword(User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("비밀번호 업데이트 완료: {}", user.getEmail());
    }


    @Override
    public boolean existsByNickname(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public void changePassword(RequestChangePasswordDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 올바르지 않습니다.");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        log.info("비밀번호 변경 완료: email={}", dto.getEmail());
    }
}
