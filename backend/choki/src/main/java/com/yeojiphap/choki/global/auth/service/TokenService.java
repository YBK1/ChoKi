package com.yeojiphap.choki.global.auth.service;

import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.global.ApiResponse;
import com.yeojiphap.choki.global.auth.entity.RefreshToken;
import com.yeojiphap.choki.global.auth.exception.ExpiredRefreshTokenException;
import com.yeojiphap.choki.global.auth.exception.InvalidRefreshTokenException;
import com.yeojiphap.choki.global.auth.exception.NotFoundRefreshTokenException;
import com.yeojiphap.choki.global.auth.jwt.JWTUtil;
import com.yeojiphap.choki.global.auth.repository.RefreshRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {

    private final JWTUtil jwtUtil;
    private final CookieService cookieService;
    private final RefreshRepository refreshRepository;

    public void addRefreshToken(String username, String refreshToken, Long expiredMs) {

        Long expiration = System.currentTimeMillis() + expiredMs;

        RefreshToken refresh = RefreshToken.builder()
                .username(username)
                .refresh(refreshToken)
                .expiration(expiration)
                .build();

        refreshRepository.save(refresh);
    }

    public ApiResponse<?> reissueAccessToken(HttpServletRequest request, HttpServletResponse response){
        log.info("reissue 진입");
        String refresh = null;
        Cookie[] cookies = request.getCookies();

        log.info(cookies.toString());
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh")) {
                refresh = cookie.getValue();
                log.info("refresh = " + refresh);
            }
        }

        if (refresh == null) {
            log.info("refresh가 null");
            throw new NotFoundRefreshTokenException();
        }

        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            throw new ExpiredRefreshTokenException();
        }

        String category = jwtUtil.getCategory(refresh);

        Boolean isExist = refreshRepository.existsByRefresh(refresh);
        if (!isExist) {
            throw new InvalidRefreshTokenException();
        }

        if (!category.equals("refresh")) {
            throw new InvalidRefreshTokenException();
        }

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);

        String newAccess = jwtUtil.createJwt("access", username, Role.valueOf(role), 600000000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, Role.valueOf(role), 86400000L);

        refreshRepository.deleteByRefresh(refresh);
        addRefreshToken(username, newRefresh, 86400000L);

        response.setHeader("access", newAccess);
        response.addHeader(HttpHeaders.SET_COOKIE, cookieService.createCookie("refresh", newRefresh).toString());

        System.out.println("access: " + newAccess);

        return ApiResponse.success(HttpStatus.OK, "발급 완료");
    }
}
