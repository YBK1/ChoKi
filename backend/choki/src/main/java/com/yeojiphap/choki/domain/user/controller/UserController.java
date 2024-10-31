package com.yeojiphap.choki.domain.user.controller;

import com.yeojiphap.choki.domain.user.dto.signUpRequest;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // @PostMapping("/signup")
    // public ApiResponse signup(signUpRequest signUpRequest) {
    //     return ApiResponse.success(HttpStatus.CREATED, userService.signUp(signUpRequest));
    // }
}
