package com.yeojiphap.choki.domain.mission.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.yeojiphap.choki.domain.shopping.dto.ProductCompareRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ShoppingCreateRequestDto;
import com.yeojiphap.choki.global.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "미션 컨트롤러", description = "추가 미션 생성 및 미션의 조회와 삭제를 담당하는 클래스")
public interface SpringDocMissionController {
	@Operation(
		summary = "현재 진행중인 미션 조회",
		parameters = {
			@Parameter(
				name = "access",
				description = "JWT 토큰",
				in = ParameterIn.HEADER,
				required = true,
				example = "eyJhbGciOiJ..."
			)
		},
		description = "현재 진행중인 미션을 조회한다"
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "미션 조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
					{
					    "status": 200,
					    "message": "미션 조회 성공",
					    "data": [
					        {
					            "content": "동네 마트 장보기",
					            "completedAt": null,
					            "image": null,
					            "type": "SHOP",
					            "shoppingId": "672b1a3be4b4173b0d027ea6"
					        }
					    ]
					}"""
				)
			)
		),
	})
	public ApiResponse getInProgressMission(@RequestParam("userId") Long userId);
}


