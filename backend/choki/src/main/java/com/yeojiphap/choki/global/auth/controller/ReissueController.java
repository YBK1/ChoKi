package com.yeojiphap.choki.global.auth.controller;

import com.yeojiphap.choki.global.ApiResponse;
import com.yeojiphap.choki.global.auth.service.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ReissueController {

    private final TokenService tokenService; ;

    @PostMapping("/api/reissue")
    public ApiResponse<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        return tokenService.reissueAccessToken(request, response);
    }
}
