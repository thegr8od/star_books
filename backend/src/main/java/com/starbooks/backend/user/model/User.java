package com.starbooks.backend.user.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nickname;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String kakaoId;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean isActive;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private ProfileImage profileImage;

    // 프로필 이미지 연결
    public void assignProfileImage(ProfileImage profileImage) {
        this.profileImage = profileImage;
        profileImage.setUser(this); // 양방향 연관 관계 설정
    }
}
