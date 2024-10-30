package com.yeojiphap.choki.domain.user.controller;

import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.dto.response.OtherChildResponseDto;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

//    @GetMapping("/user/myPage")
//    public ResponseEntity<?> getMyInfo() {
//        // 토큰으로 검증
//        try {
//
//        } catch (Exception e) {
//
//        }
//    }

    @GetMapping(value = "/user/{userId:[0-9]+}")
    public ApiResponse<OtherChildResponseDto> getUser(@PathVariable Long userId) {
        return ApiResponse.success(userService.getOtherChildInfo(userId));
    }
}
