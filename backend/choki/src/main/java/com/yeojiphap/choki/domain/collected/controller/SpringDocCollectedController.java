package com.yeojiphap.choki.domain.collected.controller;

import com.yeojiphap.choki.global.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "보유 캐릭터 컨트롤러", description = "보유한 캐릭터 조회, 추가 등 보유 캐릭터를 관리하는 클래스")
public interface SpringDocCollectedController {

    @Operation(
            summary = "보유한 캐릭터들을 조회합니다.",
            description = "현재 보유한 캐릭터들의 목록을 조회합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "보유 캐릭터 조회 성공",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": "보유 캐릭터 조회 성공",
                                      "data": {
                                              "animals": [
                                                  {
                                                      "id": 1,
                                                      "degree": "COMMON",
                                                      "enName": "lion",
                                                      "koName": "사자",
                                                      "animalImage": "image-route.com"
                                                  },
                                                  {
                                                      "id": 1,
                                                      "degree": "COMMON",
                                                      "enName": "lion",
                                                      "koName": "사자",
                                                      "animalImage": "image-route.com"
                                                  }
                                              ]
                                          }
                                    }"""
                            )
                    )
            ),
    })
    public ApiResponse getCollectedAnimals();
}
