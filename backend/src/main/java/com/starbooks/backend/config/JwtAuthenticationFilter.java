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

        String uri = request.getRequestURI();
        if (uri.startsWith("/api/member") || uri.startsWith("/api/member/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = getJwtFromRequest(request);
            if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                String userEmail = jwtTokenProvider.getUserEmail(token);

                // ✅ CustomUserDetails 로드
                CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(userEmail);

                log.info("✅ JWT 인증 완료: userId={}, email={}", userDetails.getUserId(), userEmail);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // ✅ SecurityContext에 CustomUserDetails 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        } catch (TokenExpiredException e) {
            log.warn("JWT 토큰이 만료되었습니다: {}", e.getMessage());
        } catch (Exception e) {
            log.error("JWT 인증 필터에서 에러 발생: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
