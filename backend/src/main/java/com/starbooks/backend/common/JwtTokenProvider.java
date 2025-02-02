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

    public String generateAccessToken(String userEmail) {
        return generateToken(userEmail, accessTokenExpiration);
    }

    public String generateRefreshToken(String userEmail) {
        return generateToken(userEmail, refreshTokenExpiration);
    }

    // OAuth 가입용 토큰 생성 시 "userEmail" 클레임 추가(인증 시 getUserEmail 사용)
    public String generateOAuthSignUpToken(String userEmail, String userName) {
        return Jwts.builder()
                .issuer("StarBooks")
                .subject("JWT Token")
                .claim("userEmail", userEmail)    // 추가
                .claim("email", userEmail)
                .claim("name", userName)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + oauthTokenExpiration))
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

    public Authentication getAuthentication(String token) {
        String userEmail = getUserEmail(token);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }

    // "userEmail" 클레임을 우선 조회하고, 없으면 "email" 클레임으로 대체하여 반환
    public String getUserEmail(String token) {
        Claims claims = getClaims(token);
        String email = claims.get("userEmail", String.class);
        if (email == null) {
            email = claims.get("email", String.class);
        }
        return email;
    }

    private String generateToken(String userEmail, long expiration) {
        return Jwts.builder()
                .issuer("StarBooks")
                .subject("JWT Token")
                .claim("userEmail", userEmail)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }
}
