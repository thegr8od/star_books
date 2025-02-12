package com.starbooks.backend.user.service;

import com.starbooks.backend.common.ErrorCode;
import com.starbooks.backend.user.dto.request.RequestRegisterDTO;
import com.starbooks.backend.user.dto.request.RequestUpdateDTO;
import com.starbooks.backend.user.dto.response.ResponseUserDTO;
import com.starbooks.backend.user.model.ProfileImage;
import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.ProfileImageRepository;
import com.starbooks.backend.user.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
public class UserServiceImpl implements UserService {

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

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        dto.setPassword(encodedPassword);

        // User 엔티티 생성 & 저장
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

    // == 프로필 (이미지 + 텍스트) 업데이트 ==
    @Override
    @Transactional
    public void updateUserProfile(String email, RequestUpdateDTO dto, MultipartFile profileImageFile) throws IOException {
        // 1) 유저 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(ErrorCode.USER_NOT_FOUND.getMessage()));

        // 2) 프로필 이미지 업로드/갱신
        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            // S3 업로드 후 URL 획득
            String fileUrl = s3Service.upload(profileImageFile.getOriginalFilename(), profileImageFile);

            // DB에 ProfileImage 엔티티 생성 또는 수정
            ProfileImage profileImage = user.getProfileImage();
            if (profileImage == null) {
                // 새로운 프로필 이미지 생성
                profileImage = ProfileImage.builder()
                        .saveFilePath(fileUrl)
                        .build();
                user.assignProfileImage(profileImage);  // User와 연결
                profileImageRepository.save(profileImage);
            } else {
                // 기존 프로필 이미지 업데이트
                profileImage.updateImagePath(fileUrl);
                profileImageRepository.save(profileImage);
            }
        }

        // 3) 텍스트 정보 업데이트 (RequestUpdateDTO)
        if (dto.getNickname() != null)  user.setNickname(dto.getNickname());
        if (dto.getGender() != null)    user.setGender(dto.getGender());
        if (dto.getSnsAccount() != null) user.setSnsAccount(dto.getSnsAccount()); // 변경된 부분
        if (dto.getRole() != null)      user.setRole(dto.getRole());
        if (dto.getIsActive() != null)  user.setIsActive(dto.getIsActive());

        userRepository.save(user);
    }

    // == 프로필 텍스트만 업데이트 (이미지 제외) ==
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
        if (dto.getSnsAccount() != null) user.setSnsAccount(dto.getSnsAccount()); // boolean 체크 가능
        if (dto.getRole() != null) user.setRole(dto.getRole());
        if (dto.getIsActive() != null) user.setIsActive(dto.getIsActive());

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
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
