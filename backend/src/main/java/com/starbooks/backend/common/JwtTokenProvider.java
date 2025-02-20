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

    @Value("${jwt.secret}")
    private String secretKeyString;

    private SecretKey secretKey;

    @PostConstruct
    protected void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKeyString);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    // ✅ 일반 로그인 & OAuth 로그인 동일한 JWT 생성 방식
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .issuer("StarBooks")
                .subject("JWT Token")
                .claim("user_id", user.getUserId())  // ✅ user_id 추가
                .claim("email", user.getEmail())
                .claim("nickname", user.getNickname())
                .claim("role", user.getRole().name()) // ✅ role 추가
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .issuer("StarBooks")
                .subject("Refresh Token")
                .claim("user_id", user.getUserId())  // ✅ user_id 추가
                .claim("email", user.getEmail())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(secretKey)
                .compact();
    }

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

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ✅ user_id 가져오기 추가
    public Long getUserId(String token) {
        Claims claims = getClaims(token);
        return claims.get("user_id", Long.class);
    }

    // ✅ email 가져오기 추가
    public String getUserEmail(String token) {
        Claims claims = getClaims(token);
        return claims.get("email", String.class);
    }

    public Authentication getAuthentication(String token) {
        String email = getUserEmail(token);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }
}
