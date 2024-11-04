package com.yeojiphap.choki.domain.shopping.controller;

import org.springframework.web.bind.annotation.RequestBody;

import com.yeojiphap.choki.domain.shopping.dto.ShoppingCreateRequestDto;
import com.yeojiphap.choki.domain.user.dto.signUpRequest;
import com.yeojiphap.choki.global.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "장보기 컨트롤러", description = "장보기 생성 및 상품 정보 검색과 비교를 담당하는 클래스")
public interface SpringDocShoppingController {
	@Operation(
		summary = "장보기 생성",
		description = "정보를 입력해 장보기를 생성한다.."
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "장보기 생성 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
                                    {
                                      "status": 201,
                                      "message": "장보기 생성 성공",
                                      "data": null
                                    }"""
				)
			)
		),
	})
	public ApiResponse create(@RequestBody ShoppingCreateRequestDto shoppingCreateRequestDto);
}
