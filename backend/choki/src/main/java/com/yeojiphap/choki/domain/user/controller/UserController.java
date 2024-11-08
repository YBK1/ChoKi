package com.yeojiphap.choki.domain.user.controller;

import com.yeojiphap.choki.domain.user.dto.response.TokenResponse;
import com.yeojiphap.choki.domain.user.dto.request.UserIdRequest;
import com.yeojiphap.choki.domain.user.dto.request.signUpRequest;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.ApiResponse;
import com.yeojiphap.choki.global.auth.service.CookieService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.yeojiphap.choki.domain.user.message.UserSuccessMessage.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController implements SpringDocUserController {
    private final UserService userService;
    private final CookieService cookieService;

    @PostMapping("/signup")
    public ApiResponse signup(@RequestBody signUpRequest signUpRequest, HttpServletResponse response) {
        TokenResponse tokenResponse = userService.signUp(signUpRequest);
        response.setHeader("access", tokenResponse.accessToken());
        response.addCookie(cookieService.createCookie("refresh", tokenResponse.refreshToken()));
        return ApiResponse.success(HttpStatus.CREATED, SIGN_UP_SUCCESS.getMessage());
    }

    @GetMapping("/child/{userId}")
    public ApiResponse getChildInfo(@PathVariable String userId) {
        return ApiResponse.success(HttpStatus.OK, userService.getChildInfo(userId), GET_CHILD_INFO_SUCCESS.getMessage());
    }

    @GetMapping("/mypage")
    public ApiResponse myPage() {
        return ApiResponse.success(HttpStatus.OK, userService.getUserDetailInfo(), GET_USER_DETAIL_INFO_SUCCESS.getMessage());
    }

    @GetMapping("/validation/id")
    public ApiResponse checkUserId(@RequestParam String userId) {
        return ApiResponse.success(HttpStatus.OK, userService.validateUserId(new UserIdRequest(userId)));
    }

    @GetMapping("/profile/{userId}")
    public ApiResponse getUserInfo(@PathVariable String userId) {
        return ApiResponse.success(HttpStatus.OK, userService.getOtherUserInfo(userId), GET_USER_DETAIL_INFO_SUCCESS.getMessage());
    }

    @GetMapping("/nearby")
    public ApiResponse getNearbyUsers() {
        return ApiResponse.success(HttpStatus.OK, userService.findNearbyUsers(), NEARBY_USERS_FOUND.getMessage());

    @GetMapping("/level")
    public ApiResponse getUserLevel() {
        return ApiResponse.success(HttpStatus.OK, userService.getLevel(), USER_LEVEL_SEARCH_SUCCESS.getMessage());
    }
}
