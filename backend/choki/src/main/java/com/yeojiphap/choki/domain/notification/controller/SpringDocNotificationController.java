package com.yeojiphap.choki.domain.notification.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.yeojiphap.choki.domain.notification.dto.DeleteNotificationRequestDto;
import com.yeojiphap.choki.global.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "알림 컨트롤러", description = "알림 내용 조회 및 삭제를 담당하는 클래스")
public interface SpringDocNotificationController {
	@Operation(
		summary = "알림 조회",
		parameters = {
			@Parameter(
				name = "access",
				description = "JWT 토큰",
				in = ParameterIn.HEADER,
				required = true,
				example = "eyJhbGciOiJ..."
			)
		},
		description = "모든 알림을 조회한다."
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "알림 조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
					{
					    "status": 200,
					    "message": "알림 조회 성공",
					    "data": [
					        {
					            "childId": 2,
					            "content": "아이가 장보기를 시작했어요!",
					            "missionId": "6729f965c8062c548663c21d",
					            "type": "SHOP",
					            "time": "2024-11-05T20:14:49.671834"
					        }
					    ]
					}"""
				)
			)
		),
	})
	public ApiResponse listNotification(@PathVariable Long childId);

	@Operation(
		summary = "알림 삭제",
		parameters = {
			@Parameter(
				name = "access",
				description = "JWT 토큰",
				in = ParameterIn.HEADER,
				required = true,
				example = "eyJhbGciOiJ..."
			)
		},
		description = "선택한 알림을 삭제한다."
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "알림 삭제 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
					{
					    "status": 200,
					    "message": "알림 삭제 성공",
					    "data": null
					}"""
				)
			)
		),
	})
	public ApiResponse deleteNotification(@RequestBody DeleteNotificationRequestDto deleteNotificationRequestDtongCreateRequestDto);
}
