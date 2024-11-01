package com.yeojiphap.choki.global.auth.jwt;

import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.global.auth.dto.CustomUserDetails;
import com.yeojiphap.choki.global.auth.repository.RefreshRepository;
import com.yeojiphap.choki.global.auth.service.CookieService;
import com.yeojiphap.choki.global.auth.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final JWTUtil jwtUtil;
    private final TokenService tokenService;
    private final CookieService cookieService;
    private final AuthenticationManager authenticationManager;

    public LoginFilter(JWTUtil jwtUtil, TokenService tokenService, CookieService cookieService, AuthenticationManager authenticationManager) {
        super.setFilterProcessesUrl("/api/user/login");
        this.jwtUtil = jwtUtil;
        this.tokenService = tokenService;
        this.cookieService = cookieService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        String username = obtainUsername(request);
        String password = obtainPassword(request);

        //스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);

        System.out.println("username: " + username);
        System.out.println("password: " + password);

        //token에 담은 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException {

        //유저 정보
        String username = authentication.getName();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성
        String access = jwtUtil.createJwt("access", username, Role.valueOf(role), 600000L);
        String refresh = jwtUtil.createJwt("refresh", username, Role.valueOf(role), 86400000L);

        tokenService.addRefreshToken(username, refresh, 86400000L);

        //응답 설정
        response.setHeader("access", access);
        response.addCookie(cookieService.createCookie("refresh", refresh));
        response.setStatus(HttpStatus.OK.value());

        System.out.println("refresh: " + refresh);
        System.out.println("access: " + access);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(401);
    }
}
