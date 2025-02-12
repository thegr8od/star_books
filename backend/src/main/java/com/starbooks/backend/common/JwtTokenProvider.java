package com.starbooks.backend.common;

import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import com.starbooks.backend.config.CustomUserDetailsService;
import com.starbooks.backend.exception.TokenExpiredException;
import com.starbooks.backend.user.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Component
@Getter
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final CustomUserDetailsService customUserDetailsService;

    @Value("${jwt.accessToken-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refreshToken-expiration}")
    private long refreshTokenExpiration;

    @Value("${jwt.oauth-sign-up-expiration}")
    private long oauthTokenExpiration;

    @Value("${jwt.secret}")
    private String secretKeyString;

    private SecretKey secretKey;

    @PostConstruct
    protected void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKeyString);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // 일반 액세스 토큰 생성 (user_id 추가)
    public String generateAccessToken(User user) {
        return generateToken(user.getUserId(), user.getEmail(), accessTokenExpiration);
    }

    // 리프레시 토큰 생성 (user_id 추가)
    public String generateRefreshToken(User user) {
        return generateToken(user.getUserId(), user.getEmail(), refreshTokenExpiration);
    }

    // OAuth 가입용 토큰 생성 (user_id 추가)
    public String generateOAuthSignUpToken(User user) {
        return Jwts.builder()
                .issuer("StarBooks")
                .subject("JWT Token")
                .claim("user_id", user.getUserId())  // user_id 수정
                .claim("userEmail", user.getEmail())
                .claim("email", user.getEmail())
                .claim("nickname", user.getNickname())  // name → nickname 수정
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + oauthTokenExpiration))
                .signWith(secretKey)
                .compact();
    }

    // JWT 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException("JWT token is expired.", e);
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    // JWT에서 클레임 추출
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // JWT에서 인증 정보 추출
    public Authentication getAuthentication(String token) {
        String userEmail = getUserEmail(token);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // "userEmail" 또는 "email" 클레임에서 이메일 정보 가져오기
    public String getUserEmail(String token) {
        Claims claims = getClaims(token);
        String email = claims.get("userEmail", String.class);
        if (email == null) {
            email = claims.get("email", String.class);
        }
        return email;
    }

    // "user_id" 클레임에서 user_id 가져오기
    public Long getUserId(String token) {
        Claims claims = getClaims(token);
        return claims.get("user_id", Long.class);
    }

    // JWT 생성 (user_id 포함)
    private String generateToken(Long userId, String userEmail, long expiration) {
        return Jwts.builder()
                .issuer("StarBooks")
                .subject("JWT Token")
                .claim("user_id", userId)   // user_id 추가
                .claim("userEmail", userEmail)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }
}
