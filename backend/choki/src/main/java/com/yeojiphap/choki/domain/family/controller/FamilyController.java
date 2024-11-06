package com.yeojiphap.choki.domain.family.controller;

import com.yeojiphap.choki.domain.family.service.FamilyService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.yeojiphap.choki.domain.family.message.FamilySuccessMessage.FAMILY_CREATION_SUCCESS;

@RestController
@RequestMapping("/api/family")
@RequiredArgsConstructor
public class FamilyController implements SpringDocFamilyController{
    private final FamilyService familyService;

    @PostMapping("")
    public ApiResponse createFamily() {
        return ApiResponse.success(HttpStatus.CREATED, familyService.createFamily(), FAMILY_CREATION_SUCCESS.getMessage());
    }

    @GetMapping("/invite-code")
    public ApiResponse getInviteCode() {
        return ApiResponse.success(HttpStatus.OK, familyService.getInviteCode());
    }
}
