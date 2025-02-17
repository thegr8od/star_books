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

        // 🔹 인증이 필요 없는 경로는 필터를 거치지 않도록 설정
        if (uri.startsWith("/api/member") || uri.startsWith("/oauth2")|| uri.startsWith("/api/radio/**")|| uri.startsWith("/ws/**")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = getJwtFromRequest(request);

            // 🔹 JWT 유효성 검사
            if (StringUtils.hasText(token) && Boolean.TRUE.equals(jwtTokenProvider.validateToken(token))) {
                String userEmail = jwtTokenProvider.getUserEmail(token);

                // ✅ 타입 체크 및 변환
                if (!(userEmail instanceof String)) {
                    throw new IllegalArgumentException("JWT에서 가져온 userEmail이 String이 아님.");
                }

                // ✅ 사용자 정보 로드
                CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(userEmail);
                log.info("✅ JWT 인증 완료: userId={}, email={}", userDetails.getUserId(), userEmail);

                // ✅ SecurityContext에 인증 정보 저장
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.info("✅ SecurityContext에 인증 정보 저장 완료");
            } else {
                log.warn("🚨 JWT가 없거나 유효하지 않음");
            }

        } catch (TokenExpiredException e) {
            log.warn("⏳ JWT 토큰이 만료되었습니다: {}", e.getMessage());
            sendErrorResponse(response, "JWT 토큰이 만료되었습니다.");
            return;
        } catch (IllegalArgumentException e) {
            log.error("🚨 JWT 파싱 오류: {}", e.getMessage());
            sendErrorResponse(response, "잘못된 JWT 형식입니다.");
            return;
        } catch (Exception e) {
            log.error("🚨 JWT 인증 필터에서 에러 발생: {}", e.getMessage());
            sendErrorResponse(response, "인증 실패: " + e.getMessage());
            return;
        }

        // 🔹 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setContentType("application/json; charset=UTF-8"); // 🔹 인코딩 추가
        response.setCharacterEncoding("UTF-8"); // 🔹 한글 깨짐 방지
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" + message + "\"}");
    }


    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
