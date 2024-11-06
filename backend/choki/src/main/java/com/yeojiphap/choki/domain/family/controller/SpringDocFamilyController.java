package com.yeojiphap.choki.domain.family.controller;

import com.yeojiphap.choki.domain.family.dto.InviteCodeDto;
import com.yeojiphap.choki.global.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestBody;

@Tag(name = "가족 컨트롤러", description = "가족 및 초대코드를 생성, 조회하는 등 가족을 관리하는 클래스")
public interface SpringDocFamilyController {
    @Operation(
            summary = "가족 생성",
            description = "가족을 생성하고 초대 코드를 발급받습니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "가족 생성 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 201,
                                      "message": "가족 생성 성공",
                                      "data": {
                                        "inviteCode": "123456"
                                      }
                                    }"""
                            )
                    )
            ),
    })
    public ApiResponse createFamily();

    @Operation(
            summary = "초대 코드 조회",
            description = "가족 초대를 위한 초대 코드를 조회합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "초대 코드 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": null,
                                      "data": {
                                        "inviteCode": "123456"
                                      }
                                    }"""
                            )
                    )
            ),
    })
    public ApiResponse getInviteCode();

    @Operation(
            summary = "초대 코드 입력, 가족 등록",
            description = "초대 코드를 입력하여 가족에 가입합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "가족 등록 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": 가족 등록 성공,
                                      "data": null
                                    }"""
                            )
                    )
            ),
    })
    public ApiResponse acceptInviteCode(@RequestBody InviteCodeDto request);
}
