package com.yeojiphap.choki.domain.map.controller;

import com.yeojiphap.choki.domain.map.dto.request.RouteRequest;
import com.yeojiphap.choki.global.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "지도 컨트롤러", description = "지도의 경로를 저장, 조회, 삭제 등 관리하는 클래스")
public interface SpringDocMapController {

    @Operation(
            summary = "가이드 경로 저장",
            description = "아이에게 미리 장보기 경로를 학습시키기 위해 가이드 경로를 저장합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "예습 경로 저장 완료",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 201,
                                      "message": "예습 경로 저장 성공",
                                      "data": null
                                    }
                                    """
                            ))
            )
    })
    public ApiResponse saveGuidedRoute(RouteRequest request);

    @Operation(
            summary = "가이드 경로 목록 조회",
            description = "저장되어있는 가이드 경로 목록을 조회합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "가이드 경로 목록 조회 성공",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": "가이드 경로 목록 조회 성공",
                                      "data": {
                                          "routes": [
                                            {
                                              "destination": {
                                                "buildingName": "Library",
                                                "latitude": 37.5665,
                                                "longitude": 126.978
                                              },
                                              "objectId": "672b6fbd29765e734a94dafb"
                                            },
                                            {
                                              "destination": {
                                                "buildingName": "Library",
                                                "latitude": 37.5665,
                                                "longitude": 126.978
                                              },
                                              "objectId": "672b6fbd29765e734a94dafb"
                                            }
                                          ]
                                      }
                                    }
                                    """
                            ))
            )
    })
    public ApiResponse getGuidedRoutes();

    @Operation(
            summary = "가이드 경로 조회",
            description = "저장되어있는 가이드 경로를 조회합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "가이드 경로 조회 성공",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": "가이드 경로 조회 성공",
                                      "data": {
                                          "startPoint": {
                                              "buildingName": "123 Sample Street, Sample City, SS 12345",
                                              "latitude": 37.5665,
                                              "longitude": 126.978
                                          },
                                          "destination": {
                                              "buildingName": "Library",
                                              "latitude": 37.5665,
                                              "longitude": 126.978
                                          },
                                          "routes": [
                                              {
                                                  "buildingName": "Cafe",
                                                  "latitude": 37.5651,
                                                  "longitude": 126.9782
                                              },
                                              {
                                                  "buildingName": "Park",
                                                  "latitude": 37.5652,
                                                  "longitude": 126.9779
                                              }
                                          ]
                                      }
                                    }
                                    """
                            ))
            )
    })
    public ApiResponse getGuidedRoute(@PathVariable ObjectId guidedRouteId);
}
