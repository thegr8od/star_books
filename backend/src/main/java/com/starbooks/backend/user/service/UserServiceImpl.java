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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public

class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProfileImageRepository profileImageRepository;
    private final S3Service s3Service;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    // == 회원가입 ==
    @Override
    @Transactional
    public void registerUser(RequestRegisterDTO dto) {

        // 이메일 중복 체크
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(
                    ErrorCode.EMAIL_ALREADY_EXIST.getHttpStatus(),
                    ErrorCode.EMAIL_ALREADY_EXIST.getMessage()
            );
        }

        // snsAccount 기본값 설정
        if (dto.getSnsAccount() == null) {
            dto.setSnsAccount(false);
        }

        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        User user = dto.toEntity();
        userRepository.save(user);

        log.info("신규 회원 가입: email={}, snsAccount={}", user.getEmail(), user.getSnsAccount());
    }

    // == 이메일로 회원 검색 ==
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // == 유저 정보 조회 ==
    @Override
    public ResponseUserDTO getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));
        return ResponseUserDTO.fromEntity(user);
    }

    // == 회원 삭제 ==
    @Override
    @Transactional
    public void deleteUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));
        userRepository.delete(user);
        log.info("회원 탈퇴: email={}", email);
    }

    // == 프로필 이미지 업데이트 ==
    @Override
    @Transactional
    public void updateUserProfileImage(String email, MultipartFile profileImageFile) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            // S3 업로드 후 URL 획득
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

    // == 프로필 텍스트만 업데이트 ==
    @Override
    @Transactional
    public void updateUserProfileText(RequestUpdateDTO dto) {
        if (dto.getEmail() == null) {
            throw new IllegalArgumentException("이메일이 없습니다. 프로필 수정 불가");
        }

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

        // 오직 닉네임과 성별만 업데이트
        if (dto.getNickname() != null) user.setNickname(dto.getNickname());
        if (dto.getGender() != null) user.setGender(dto.getGender());

        userRepository.save(user);
    }

    // == 로그인용 인증 ==
    @Override
    public Authentication authenticateUser(String email, String password) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
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
        // 이메일로 사용자 조회
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage()
                ));

        // 기존 비밀번호 확인
        if (!passwordEncoder.matches(dto.getOldPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "현재 비밀번호가 올바르지 않습니다."
            );
        }

        // 새 비밀번호 암호화 후 업데이트
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        log.info("비밀번호 변경 완료: email={}", dto.getEmail());
    }
}
