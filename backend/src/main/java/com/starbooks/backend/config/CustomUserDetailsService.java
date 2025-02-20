package com.starbooks.backend.config;

import com.starbooks.backend.user.model.User;
import com.starbooks.backend.user.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        // DB에서 사용자 정보 조회
        System.out.println(userEmail + ": userEmail");
        User userEntity = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        // 권한 부여
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(userEntity.getRole().name())
        );

        // 소셜 로그인 사용자의 경우 비밀번호가 없을 수 있으므로 null이면 빈 문자열로 대체
        String password = userEntity.getPassword() != null ? userEntity.getPassword() : "";

        // CustomUserDetails 반환 (userId 포함)
        return new CustomUserDetails(
                userEntity.getUserId(),
                userEntity.getEmail(),
                password,
                authorities
        );
    }
}
