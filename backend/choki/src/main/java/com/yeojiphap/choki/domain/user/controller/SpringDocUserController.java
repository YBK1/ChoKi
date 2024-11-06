package com.yeojiphap.choki.domain.user.controller;

import com.yeojiphap.choki.domain.user.dto.signUpRequest;
import com.yeojiphap.choki.global.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Tag(name = "회원 컨트롤러", description = "회원 생성, 조회, 삭제 등 회원을 관리하는 클래스")
public interface SpringDocUserController {
    @Operation(
            summary = "회원가입",
            description = "회원 정보를 입력하여 새로운 사용자를 등록합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "회원가입 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 201,
                                      "message": "회원가입 성공",
                                      "data": null
                                    }"""
                            )
                    )
            ),
    })
    public ApiResponse signup(@RequestBody signUpRequest signUpRequest,  HttpServletResponse response);

    @Operation(
            summary = "회원 아이디 검증",
            description = "사용 가능한 회원 아이디인지에 대한 유효성 검사를 진행합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "아이디 유효성 검사 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": "사용 가능한 아이디입니다.",
                                      "data": null
                                    }"""
                            )
                    )
            ),
    })
    public ApiResponse checkUserId(@RequestParam String userId);
}
