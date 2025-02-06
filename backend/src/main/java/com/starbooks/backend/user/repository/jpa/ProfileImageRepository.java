package com.starbooks.backend.user.repository.jpa;

import com.starbooks.backend.user.model.ProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileImageRepository extends JpaRepository<ProfileImage, Long> {
    Optional<ProfileImage> findByUser_UserId(Long userId); // 특정 사용자와 연관된 ProfileImage 검색
}
