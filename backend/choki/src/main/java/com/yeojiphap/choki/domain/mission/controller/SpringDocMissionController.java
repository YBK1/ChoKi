package com.yeojiphap.choki.domain.mission.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import com.yeojiphap.choki.domain.mission.domain.Status;
import com.yeojiphap.choki.domain.mission.dto.MissionCommentRequestDto;
import com.yeojiphap.choki.domain.mission.dto.MissionImageRequestDto;
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
		summary = "현재 진행중인 미션 목록 조회",
		parameters = {
			@Parameter(
				name = "access",
				description = "JWT 토큰",
				in = ParameterIn.HEADER,
				required = true,
				example = "eyJhbGciOiJ..."
			)
		},
		description = "현재 진행중인 미션 목록을 조회한다"
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
					        	"missionId" : "672df1def4c5cb7ca5d36531",
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

	@Operation(
		summary = "미션 상세 조회",
		parameters = {
			@Parameter(
				name = "access",
				description = "JWT 토큰",
				in = ParameterIn.HEADER,
				required = true,
				example = "eyJhbGciOiJ..."
			)
		},
		description = "선택한 미션의 상세정보를 조회합니다."
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
						"data": {
							"content": "동네 마트 장보기",
							"completedAt": "2024-11-11T14:56:03.066819800",
							"status": "COMPLETED",
							"type": "SHOP",
							"image": null,
							"comment": "참 잘했어요"
						}
					}"""
				)
			)
		),
	})
	public ApiResponse getMission(@PathVariable("missionId") String missionId);

	@Operation(
		summary = "미션을 완료시키고 코멘트를 입력한다.",
		parameters = {
			@Parameter(
				name = "access",
				description = "JWT 토큰",
				in = ParameterIn.HEADER,
				required = true,
				example = "eyJhbGciOiJ..."
			)
		},
		description = "미션을 완전히 완료시키고 코멘트를 입력한다."
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
					    "message": "미션 완료 성공",
					    "data": null
					}"""
				)
			)
		),
	})
	public ApiResponse commentMission(@RequestBody MissionCommentRequestDto commentRequestDto);

	@Operation(
		summary = "완료 미션 목록 조회",
		parameters = {
			@Parameter(
				name = "access",
				description = "JWT 토큰",
				in = ParameterIn.HEADER,
				required = true,
				example = "eyJhbGciOiJ..."
			)
		},
		description = "완료한 미션의 목록을 조회합니다."
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
					        	"missionId" : "672df1def4c5cb7ca5d36531",
					            "content": "동네 마트 장보기",
					            "completedAt": "2024-11-12T16:49:38.178365600",
					            "image": null,
					            "type": "SHOP",
					            "shoppingId": "672ac87827240114e20e01d0"
					        }
					    ]
					}"""
				)
			)
		),
	})
	public ApiResponse getCompletedMissions(@RequestParam("userId") Long userId);

	@Operation(
		summary = "미션에 이미지 등록",
		parameters = {
			@Parameter(
				name = "access",
				description = "JWT 토큰",
				in = ParameterIn.HEADER,
				required = true,
				example = "eyJhbGciOiJ..."
			)
		},
		description = "미션 이미지 등록하기"
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
					    "message": "미션 사진 등록 성공",
					}"""
				)
			)
		),
	})
	public ApiResponse addImage(
		@RequestPart("data") MissionImageRequestDto missionImageRequestDto,
		@RequestPart("image") MultipartFile image);
}


