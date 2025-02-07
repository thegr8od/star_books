package com.starbooks.backend.diary.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String nickname;

    @Column(length = 10)
    private String gender;

    @Column(name = "kakao_id", length = 255)
    private String kakaoId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.MEMBER; // 기본값: MEMBER

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true; // 기본값: 활성화

    @Column(length = 255)
    private String token;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Builder
    public User(String email, String password, String nickname, String gender, String kakaoId, Role role, String token) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.gender = gender;
        this.kakaoId = kakaoId;
        this.role = role;
        this.token = token;
    }

    // 비밀번호 변경 메서드 (테스트용)
    public void changePassword(String newPassword) {
        this.password = newPassword;
    }

    // 계정 활성화/비활성화 메서드 (테스트용)
    public void toggleActive() {
        this.isActive = !this.isActive;
    }

    // 역할 Enum
    public enum Role {
        MEMBER, MANAGER
    }
}
