package com.starbooks.backend.user.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "profile_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long imageId;

    @Column(name = "save_file_path", nullable = false)
    private String saveFilePath;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 이미지 경로 업데이트 메서드 추가
    public void updateImagePath(String newFilePath) {
        this.saveFilePath = newFilePath;
    }
}
