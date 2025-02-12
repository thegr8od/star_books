package com.starbooks.backend.config;

import com.starbooks.backend.common.JwtTokenProvider;
import com.starbooks.backend.exception.TokenExpiredException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT를 검사하는 커스텀 필터.
 * Swagger 경로 등 화이트리스트는 여기서 검사 제외 처리.
 */
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ─────────────────────────────────────────────
        // 1) Swagger 등 화이트리스트 경로는 바로 통과
        // ─────────────────────────────────────────────
        String uri = request.getRequestURI();
        if (isSwaggerRequest(uri)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ─────────────────────────────────────────────
        // 2) 나머지 경로는 JWT 검사
        // ─────────────────────────────────────────────
        try {
            String token = getJwtFromRequest(request);
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                String userEmail = jwtTokenProvider.getUserEmail(token);

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 인증 정보 세팅
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (TokenExpiredException e) {
            log.warn("JWT 토큰이 만료되었습니다: {}", e.getMessage());
        } catch (Exception e) {
            log.error("JWT 인증 필터에서 에러 발생: {}", e.getMessage());
        }

        // 필터 체인의 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    /**
     * "Authorization: Bearer ~~" 헤더에서 JWT 부분만 파싱
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 이후
        }
        return null;
    }

    /**
     * Swagger 문서 관련 경로인지 판별
     */
    private boolean isSwaggerRequest(String uri) {
        return uri.startsWith("/swagger-ui")
                || uri.startsWith("/v3/api-docs")
                || uri.startsWith("/swagger-resources")
                || uri.startsWith("/webjars");
    }
}
