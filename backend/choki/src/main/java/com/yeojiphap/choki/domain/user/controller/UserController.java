package com.yeojiphap.choki.domain.user.controller;

import com.yeojiphap.choki.domain.user.dto.response.ChildProfileDto;
import com.yeojiphap.choki.domain.user.dto.response.OtherChildResponseDto;
import com.yeojiphap.choki.domain.user.service.JWTService;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JWTService jwtService;

    @GetMapping("/user/myPage")
    public ApiResponse<ChildProfileDto> getMyInfo(@RequestHeader("Authorization") String token) {
        return ApiResponse.success(jwtService.getUserByToken(token));
    }

    @GetMapping(value = "/user/{userId:[0-9]+}")
    public ApiResponse<OtherChildResponseDto> getUser(@PathVariable Long userId) {
        return ApiResponse.success(userService.getOtherChildInfo(userId));
    }
}
