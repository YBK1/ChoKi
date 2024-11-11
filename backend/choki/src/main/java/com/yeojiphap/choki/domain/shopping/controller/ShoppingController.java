package com.yeojiphap.choki.domain.shopping.controller;

import com.yeojiphap.choki.domain.shopping.dto.ProductCompareRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ProductNameSearchDto;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.yeojiphap.choki.domain.shopping.dto.ProductCompareResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.ShoppingCreateRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.FinishShoppingRequestDto;
import com.yeojiphap.choki.domain.shopping.service.ShoppingService;
import com.yeojiphap.choki.global.ApiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/shopping")
public class ShoppingController implements SpringDocShoppingController{
	private final ShoppingService shoppingService;
	@PostMapping("/create")
	public ApiResponse create(@RequestBody ShoppingCreateRequestDto shoppingCreateRequestDto) {
		// 장보기를 생성한다.
		shoppingService.createShopping(shoppingCreateRequestDto);

		// FCM도 만들어야 겠지?;;

		return ApiResponse.success(HttpStatus.CREATED, "장보기 생성 성공");
	}

	// 상품 이름으로 검색
	@PostMapping("/item/search")
	public ApiResponse searchByName(@RequestBody ProductNameSearchDto productNameSearchDto) {
		return ApiResponse.success(HttpStatus.OK, shoppingService.searchProductByName(productNameSearchDto), "상품 조회 성공");
	}

	// 상품 바코드로 검색
	@GetMapping("/barcode/{barcode}")
	public ApiResponse searchByBarcode(@PathVariable("barcode") String barcode) {
		return ApiResponse.success(HttpStatus.OK, shoppingService.searchProductByBarcode(barcode), "상품 조회 성공");
	}

	// 상품 비교 하기
	@PostMapping("/item/compare")
	public ApiResponse compareProduct(@RequestBody ProductCompareRequestDto productCompareRequestDto) {
		// api 명세서를 어떻게 해야 하려나 이걸..
		ProductCompareResponseDto dto =  shoppingService.compareBarcode(productCompareRequestDto);
		return ApiResponse.success(HttpStatus.OK, dto, shoppingService.compareMessage(dto));
	}

	// 아이가 장보기 종료 하기
	@PostMapping(value = "/finish", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	public ApiResponse finishShopping(
		@RequestPart("data") FinishShoppingRequestDto requestData,
		@RequestPart("image") MultipartFile completeImage) {
		shoppingService.finishShopping(requestData, completeImage);
		return ApiResponse.success(HttpStatus.OK,"장보기가 종료 되었습니다.");
	}
}
