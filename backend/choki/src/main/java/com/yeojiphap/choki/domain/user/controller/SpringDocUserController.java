package com.yeojiphap.choki.domain.user.controller;

import com.yeojiphap.choki.domain.user.dto.signUpRequest;
import com.yeojiphap.choki.global.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PathVariable;
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
            summary = "내 정보 조회",
            description = "현재 접속한 유저의 상세 정보를 조회합니다."
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
                                      "message": "정보 조회 성공",
                                       “data” : {
                                              “userId” : “1”,
                                              “nickname” : “테스터”,
                                              “address” : “광주 하남신단로”,
                                              “name” : “홍길동”,
                                              “tel” : “010-1234-5678”,
                                              “role” : “Parent”,
                                              “inviteCode” : “uuid-123-1123”,
                                              “familyId” : 2,
                                              “level” : 1,
                                              “exp” : 50,
                                              “pastLevel” : 1,
                                              “mainAnimal” : 3,
                                              “animals”: [2,3,4]
                                        },
                                      "message": "사용 가능한 아이디입니다.",
                                      "data": null
                                    }"""
                            )
                    )
            ),
    })
    public ApiResponse myPage();

    @Operation(
            summary = "자녀 정보 조회",
            description = "특정 userId를 기반으로 자녀 정보를 조회합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "정보 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "data": {
                                        "userId": "2",
                                        "nickname": "아이",
                                        "address": "광주 하남신단로",
                                        "name": "홍길동",
                                        "tel": "010-1234-5678",
                                        "role": "Child",
                                        "level": 1,
                                        "exp": 50,
                                        "pastLevel": 1,
                                        "mainAnimalId": 3
                                      },
                                      "message": "정보 조회 성공"
                                    }
                                    """)
                    )
            )
    })
    public ApiResponse getChildInfo(@PathVariable Long userId);

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