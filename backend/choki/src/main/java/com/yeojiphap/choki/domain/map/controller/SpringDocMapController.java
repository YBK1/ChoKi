package com.yeojiphap.choki.domain.map.controller;

import com.yeojiphap.choki.domain.map.domain.Location;
import com.yeojiphap.choki.domain.map.dto.request.RouteRegisterRequest;
import com.yeojiphap.choki.global.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.ModelAttribute;

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
    public ApiResponse saveGuidedRoute(RouteRegisterRequest request);

    @Operation(
            summary = "경로 목록 조회",
            description = "저장되어있는 경로 목록을 조회합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "경로 목록 조회 성공",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": "경로 목록 조회 성공",
                                      "data": {
                                          "routeList": [
                                              {
                                                  "buildingName": "Myeongdong Cathedral",
                                                  "latitude": 37.5512,
                                                  "longitude": 126.9882
                                              },
                                              {
                                                  "buildingName": "Myeongdong Cathedral",
                                                  "latitude": 35.196141,
                                                  "longitude": 126.81511
                                              },
                                              {
                                                  "buildingName": "카카오 마트",
                                                  "latitude": 35.196141,
                                                  "longitude": 126.81511
                                              }
                                          ]
                                      }
                                    }
                                    """
                            ))
            )
    })
    ApiResponse getRoutes();

    @Operation(
            summary = "가이드 경로 조회",
            description = "저장되어있는 가이드 경로를 조회합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "경로 조회 성공",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": "경로 조회 성공",
                                      "data": {
                                              "startPoint": {
                                                  "buildingName": "광주 광산구 장덕동 1403",
                                                  "latitude": 35.193983439271,
                                                  "longitude": 126.814343249947
                                              },
                                              "destination": {
                                                  "buildingName": "카카오 마트",
                                                  "latitude": 35.196141,
                                                  "longitude": 126.81511
                                              },
                                              "routes": [
                                                  {
                                                      "buildingName": null,
                                                      "latitude": 35.2059393,
                                                      "longitude": 126.8187137
                                                  },
                                                  {
                                                      "buildingName": null,
                                                      "latitude": 35.2059394,
                                                      "longitude": 126.8187138
                                                  },
                                                  {
                                                      "buildingName": null,
                                                      "latitude": 35.2059395,
                                                      "longitude": 126.8187139
                                                  },
                                                  {
                                                      "buildingName": null,
                                                      "latitude": 35.2059396,
                                                      "longitude": 126.8187131
                                                  },
                                                  {
                                                      "buildingName": null,
                                                      "latitude": 35.2059397,
                                                      "longitude": 126.8187132
                                                  }
                                              ]
                                          }
                                    }
                                    """
                            ))
            )
    })
    ApiResponse getGuidedRoute(@ModelAttribute Location destination);

    @Operation(
            summary = "안전 경로 조회",
            description = "저장되어있는 안전 경로를 조회합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "경로 조회 성공",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": "경로 조회 성공",
                                      "data": {
                                              "startPoint": {
                                                  "buildingName": "광주 광산구 장덕동 1403",
                                                  "latitude": 35.193983439271,
                                                  "longitude": 126.814343249947
                                              },
                                              "destination": {
                                                  "buildingName": "카카오 마트",
                                                  "latitude": 35.196141,
                                                  "longitude": 126.81511
                                              },
                                              "routes": [
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1938852,
                                                      "longitude": 126.8142918
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1937682,
                                                      "longitude": 126.8144682
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.193634,
                                                      "longitude": 126.8147178
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1937121,
                                                      "longitude": 126.81475
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1938278,
                                                      "longitude": 126.8147629
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1940442,
                                                      "longitude": 126.8147569
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1945143,
                                                      "longitude": 126.8147556
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1947404,
                                                      "longitude": 126.8147491
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1947442,
                                                      "longitude": 126.814804
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1947447,
                                                      "longitude": 126.8153371
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1948841,
                                                      "longitude": 126.8153539
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1949853,
                                                      "longitude": 126.8147604
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1952182,
                                                      "longitude": 126.8147873
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1953069,
                                                      "longitude": 126.8147953
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1956719,
                                                      "longitude": 126.8149334
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1957763,
                                                      "longitude": 126.8149418
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1957836,
                                                      "longitude": 126.8151527
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1957832,
                                                      "longitude": 126.8151659
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1957792,
                                                      "longitude": 126.8151782
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1957722,
                                                      "longitude": 126.8151882
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1957629,
                                                      "longitude": 126.815195
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1958001,
                                                      "longitude": 126.8152446
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1960313,
                                                      "longitude": 126.8152497
                                                  }
                                              ]
                                          }
                                    }
                                    """
                            ))
            )
    })
    ApiResponse getSafeRoute(@ModelAttribute Location destination);

    @Operation(
            summary = "최단 경로 조회",
            description = "저장되어있는 최단 경로를 조회합니다."
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "경로 조회 성공",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                                    {
                                      "status": 200,
                                      "message": "경로 조회 성공",
                                      "data": {
                                              "startPoint": {
                                                  "buildingName": "광주 광산구 장덕동 1403",
                                                  "latitude": 35.193983439271,
                                                  "longitude": 126.814343249947
                                              },
                                              "destination": {
                                                  "buildingName": "카카오 마트",
                                                  "latitude": 35.196141,
                                                  "longitude": 126.81511
                                              },
                                              "routes": [
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1938852,
                                                      "longitude": 126.8142918
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1937682,
                                                      "longitude": 126.8144682
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.193634,
                                                      "longitude": 126.8147178
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1937121,
                                                      "longitude": 126.81475
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1938278,
                                                      "longitude": 126.8147629
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1940442,
                                                      "longitude": 126.8147569
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1945143,
                                                      "longitude": 126.8147556
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1947404,
                                                      "longitude": 126.8147491
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1947447,
                                                      "longitude": 126.8153371
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1948841,
                                                      "longitude": 126.8153539
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1948817,
                                                      "longitude": 126.8155827
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1950639,
                                                      "longitude": 126.8155872
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1955119,
                                                      "longitude": 126.8155802
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1960327,
                                                      "longitude": 126.8155683
                                                  },
                                                  {
                                                      "buildingName": "",
                                                      "latitude": 35.1960313,
                                                      "longitude": 126.8152497
                                                  }
                                              ]
                                          }
                                    }
                                    """
                            ))
            )
    })
    ApiResponse getShortestRoute(@ModelAttribute Location destination);
}
