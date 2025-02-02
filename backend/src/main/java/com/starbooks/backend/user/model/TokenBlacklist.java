package com.starbooks.backend.user.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "token_blacklist")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenBlacklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Long expiration; // 토큰 만료 시간 (UNIX timestamp)
}
