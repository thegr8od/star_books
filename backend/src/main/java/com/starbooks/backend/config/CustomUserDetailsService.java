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
        User userEntity = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        // 권한 부여: Role enum -> Spring Security 권한(GrantedAuthority) 변환
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(userEntity.getRole().name())
        );

        // 스프링 시큐리티의 User 객체로 반환
        // (엔티티 User와 구분하기 위해 fully-qualified name 사용)
        return new org.springframework.security.core.userdetails.User(
                userEntity.getEmail(),
                userEntity.getPassword(),
                authorities
        );
    }
}
