package com.yeojiphap.choki.domain.user.controller;

import com.yeojiphap.choki.domain.user.dto.signUpRequest;
import com.yeojiphap.choki.domain.user.service.FamilyService;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.yeojiphap.choki.domain.user.message.UserSuccessMessage.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController implements SpringDocUserController {
    private final UserService userService;
    private final FamilyService familyService;

    @PostMapping("/signup")
    public ApiResponse signup(@RequestBody signUpRequest signUpRequest) {
        return ApiResponse.success(HttpStatus.CREATED, userService.signUp(signUpRequest));
    }

    @PostMapping("/family")
    public ApiResponse createFamily() {
        return ApiResponse.success(HttpStatus.CREATED, familyService.createFamily(), FAMILY_CREATION_SUCCESS.getMessage());
    }

    @GetMapping("/invite-code")
    public ApiResponse getInviteCode() {
        return ApiResponse.success(HttpStatus.OK, familyService.getInviteCode());
    }
}
