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
import java.io.PrintWriter;
import java.util.Map;

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

        String token = getJwtFromRequest(request);

        if (!StringUtils.hasText(token)) {
            log.warn("🚨 요청에 JWT 토큰이 포함되지 않음. 필터 체인 계속 진행.");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (Boolean.TRUE.equals(jwtTokenProvider.validateToken(token))) {
                Map<String, Object> claims = jwtTokenProvider.getClaims(token);

                if (claims == null) {
                    log.error("🚨 JWT 토큰 클레임이 null입니다. 인증 실패.");
                    sendJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 토큰입니다.");
                    return;
                }

                String userEmail = (String) claims.get("email");
                Number userIdNumber = (Number) claims.get("user_id");
                Long userId = userIdNumber != null ? userIdNumber.longValue() : null;
                String role = (String) claims.get("role");

                if (userEmail == null || userId == null || role == null) {
                    log.error("🚨 JWT에서 사용자 정보를 가져올 수 없음: email={}, userId={}, role={}", userEmail, userId, role);
                    sendJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 사용자 정보입니다.");
                    return;
                }

                System.out.println("11111111111111");
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);
                System.out.println("2222222222222");

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                System.out.println("33333333333333333");

                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.info("✅ JWT 인증 성공: userId={}, email={}, role={}", userId, userEmail, role);
            } else {
                log.warn("🚨 JWT 토큰이 유효하지 않음.");
                sendJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "유효하지 않은 토큰입니다.");
                return;
            }

        } catch (TokenExpiredException e) {
            log.warn("⏳ JWT 토큰이 만료되었습니다: {}", e.getMessage());
            sendJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "JWT 토큰이 만료되었습니다.");
            return;

        }//        } catch (Exception e) {
//            log.error("🚨 JWT 인증 필터에서 예외 발생: {}", e.getMessage());
//            sendJsonErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "JWT 인증 중 오류가 발생했습니다.");
//            return;
//        }
//

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (!StringUtils.hasText(bearerToken)) {
            log.warn("🚨 요청에 JWT 토큰이 포함되지 않음.");
            return null;
        }

        if (bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 제거 후 토큰 반환
        }

        log.warn("🚨 Authorization 헤더가 올바르지 않음: {}", bearerToken);
        return null;
    }


    private void sendJsonErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter writer = response.getWriter();
        writer.write("{\"error\": \"" + message + "\"}");
        writer.flush();
    }
}
