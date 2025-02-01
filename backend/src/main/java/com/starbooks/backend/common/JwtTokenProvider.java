package com.starbooks.backend.common;

import com.starbooks.backend.config.CustomUserDetailsService;
import com.starbooks.backend.exception.TokenExpiredException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.util.Base64;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Getter
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final CustomUserDetailsService customUserDetailsService;

    @Value("${jwt.accessToken-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refreshToken-expiration}")
    private long refreshTokenExpiration;

    @Value("${jwt.secret}")
    private String secretKeyString;

    private SecretKey secretKey;

    @PostConstruct
    protected void init() {
        try {
            byte[] keyBytes;
            if (secretKeyString.contains("-") || secretKeyString.contains("_")) {
                // Base64 URL-Safe 디코딩 사용
                keyBytes = Base64.getUrlDecoder().decode(secretKeyString);
            } else {
                // 일반 Base64 디코딩 사용
                keyBytes = Base64.getDecoder().decode(secretKeyString);
            }
            this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException ex) {
            throw new RuntimeException("Invalid JWT secret key: Ensure it is properly Base64-encoded.", ex);
        }
    }
    public String generateAccessToken(String userEmail) {
        return generateToken(userEmail, accessTokenExpiration);
    }

    public String generateRefreshToken(String userEmail) {
        return generateToken(userEmail, refreshTokenExpiration);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)  // 최신 버전 0.12.x 방식
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException("JWT token is expired.", e);
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    public Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)  // 최신 버전 0.12.x 방식
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException ex) {
            throw new RuntimeException("Failed to parse JWT claims.", ex);
        }
    }

    public Authentication getAuthentication(String token) {
        String userEmail = this.getUserEmail(token);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    public String getUserEmail(String token) {
        return getClaims(token).get("userEmail", String.class);
    }

    private String generateToken(String userEmail, long expiration) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject("JWT Token")
                .claim("userEmail", userEmail)
                .issuedAt(new Date(now))
                .expiration(new Date(now + expiration))
                .signWith(secretKey, Jwts.SIG.HS256)  // 최신 버전 0.12.x 방식
                .compact();
    }
}
