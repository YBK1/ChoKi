package com.yeojiphap.choki.domain.family.controller;

import com.yeojiphap.choki.domain.family.dto.InviteCodeDto;
import com.yeojiphap.choki.domain.family.service.FamilyService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.yeojiphap.choki.domain.family.message.FamilySuccessMessage.FAMILY_CREATION_SUCCESS;
import static com.yeojiphap.choki.domain.family.message.FamilySuccessMessage.GET_CHILD_INFO_SUCCESS;

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

    @GetMapping("/info")
    public ApiResponse getFamily() {
        return ApiResponse.success(HttpStatus.OK, familyService.getChildInfoByFamilyId(), GET_CHILD_INFO_SUCCESS.getMessage());
    }

    @PostMapping("/invite-code/accept")
    public ApiResponse acceptInviteCode(@RequestBody InviteCodeDto request) {
        return ApiResponse.success(HttpStatus.ACCEPTED, familyService.acceptInviteCode(request));
    }
}
