package com.starbooks.backend.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId; // PK

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Column(nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;  // MALE, FEMALE, OTHER

    @Column(name = "kakao_id")
    private String kakaoId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;  // member, manager

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    private String token; // 필요시 사용

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ProfileImage profileImage;

    // == 편의 메서드 == //
    public void assignProfileImage(ProfileImage image) {
        this.profileImage = image;
        image.setUser(this);
    }
}
