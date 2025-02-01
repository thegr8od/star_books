package com.starbooks.backend.user.repository.jpa;

import com.starbooks.backend.user.model.ProfileImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileImageRepository extends JpaRepository<ProfileImage, Long> {
}
