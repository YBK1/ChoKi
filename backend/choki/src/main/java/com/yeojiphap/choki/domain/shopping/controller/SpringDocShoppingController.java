package com.yeojiphap.choki.domain.shopping.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.yeojiphap.choki.domain.shopping.dto.ProductCompareRequestDto;
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

	@Operation(
		summary = "이름으로 상품 정보 검색",
		description = "상품 DB에서 이름으로 상품을 검색합니다."
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "상품 조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
					{
					    "status": 200,
					    "message": "상품 조회 성공",
					    "data": [
					        {
					            "barcode": "8801115141112",
					            "category": "가공식품>유제품>우유>기타우유",
					            "productName": "서울우유 맛단지 바나나우유",
					            "image": "https://www.koreannet.or.kr/front/allproduct/photoView.do?gtin=8801115141112&fileName=8801115141112_250.png"
					        }
					    ]
					}"""
				)
			)
		),
	})
	public ApiResponse searchByName(@RequestParam("itemName") String itemName, Pageable pageable);

	@Operation(
		summary = "바코드로 상품 정보 조회",
		description = "상품 DB에서 바코드로 상품을 검색합니다."
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "상품 조회 성공",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
					{
					    "status": 200,
					    "message": "상품 조회 성공",
					    "data": {
					        "barcode": "8801155744496",
					        "category": "가공식품>유제품>우유>일반우유",
					        "productName": "1974 우유 1.8L",
					        "image": "https://www.koreannet.or.kr/front/allproduct/photoView.do?gtin=8801155744496&fileName=8801155744496_250.png"
					    }
					}"""
				)
			)
		),
	})
	public ApiResponse searchByBarcode(@PathVariable("barcode") String barcode);

	@Operation(
		summary = "상품 유사도 비교하기",
		description = "2개의 바코드를 입력해 유사한 상품인지 확인합니다."
	)
	@ApiResponses(value = {
		@io.swagger.v3.oas.annotations.responses.ApiResponse(
			responseCode = "200",
			description = "비교 결과",
			content = @Content(
				mediaType = "application/json",
				examples = @ExampleObject(value = """
					{
					    "status": 200,
					    "message": "비교 결과",
					    "data": {
					        "matchStatus": "MATCH"
					    }
					}"""
				)
			)
		),
	})
	public ApiResponse compareProduct(@RequestBody ProductCompareRequestDto productCompareRequestDto);
}


