package com.yeojiphap.choki.domain.user.controller;

import com.yeojiphap.choki.domain.user.dto.request.signUpRequest;
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
    ApiResponse signup(@RequestBody signUpRequest signUpRequest, HttpServletResponse response);

    @Operation(
            summary = "내 정보 조회",
            description = "현재 접속한 유저의 상세 정보를 조회합니다."
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
                                        "message": "정보 조회 성공",
                                        "data": {
                                              "userId": "1",
                                              "nickname": "테스터",
                                              "address": "광주 하남신단로",
                                              "name": "홍길동",
                                              "tel": "010-1234-5678",
                                              "role": "Parent",
                                              "inviteCode": "uuid-123-1123",
                                              "familyId": 2,
                                              "level": 1,
                                              "exp": 50,
                                              "pastLevel": 1,
                                              "mainAnimal": 3,
                                              "animals": [2, 3, 4]
                                        }
                                    }"""

                            )
                    )
            ),
    })
    ApiResponse myPage();

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
                                        "id": "2",
                                        "nickname": "아이",
                                        "address": "광주 하남신단로",
                                        "level": 1,
                                        "mainAnimalId": 3,
                                        "animals": [2,3,4]
                                      },
                                      "message": "정보 조회 성공"
                                    }
                                    """)
                    )
            )
    })
    ApiResponse getUserInfo(@PathVariable Long userId);

    @Operation(
            summary = "회원 아이디 검증",
            description = "사용 가능한 회원 아이디인지에 대한 유효성 검사를 진행합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
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
    ApiResponse checkUserId(@RequestParam String userId);

    @Operation(
            summary = "내 주변에 있는 유저 검색",
            description = "내 주변에 있는 유저를 조회해서 위치와 동물을 반환합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "주변 사용자들 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                        "status": 200,
                                        "message": "주변 사용자들 조회 성공",
                                        "data": {
                                            "users": [
                                                {
                                                    "userId": 6,
                                                    "username": "123",
                                                    "latitude": 35.2053043,
                                                    "longitude": 126.8117272,
                                                    "animalId": 21,
                                                    "animalImage": "image.com"
                                                },
                                                {
                                                    "userId": 7,
                                                    "username": "1234",
                                                    "latitude": 35.1939822,
                                                    "longitude": 126.8143431,
                                                    "animalId": 21,
                                                    "animalImage": "image.com"
                                                },
                                                {
                                                    "userId": 11,
                                                    "username": "12345678",
                                                    "latitude": 35.2007347,
                                                    "longitude": 126.8216869,
                                                    "animalId": 21,
                                                    "animalImage": "image.com"
                                                }
                                            ]
                                        }
                                    }
                                    """
                            )
                    )
            )
    })
    ApiResponse getNearbyUsers();

//    @Operation(
//            summary = "내 주변에 있는 유저 검색",
//            description = "내 주변에 있는 유저를 조회해서 위치와 동물을 반환합니다."
//    )
//    @ApiResponses(value = {
//            @io.swagger.v3.oas.annotations.responses.ApiResponse(
//                    responseCode = "200",
//                    description = "회원 레벨 조회 성공",
//                    content = @Content(
//                            mediaType = "application/json",
//                            examples = @ExampleObject(value = """
//                                    {
//                                            "status": 200,
//                                            "message": "회원 레벨 조회 성공",
//                                            "data": {
//                                                    "level" : 1,
//                                                    "exp" : 50,
//                                                    "isLevelEqual": true
//                                            }
//                                    }"""
//                            )
//                    )
//            ),
//    })
//    ApiResponse getUserLevel();
}