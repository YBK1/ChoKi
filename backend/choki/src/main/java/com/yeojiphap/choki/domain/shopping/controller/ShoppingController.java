package com.yeojiphap.choki.domain.shopping.controller;

import com.yeojiphap.choki.domain.mission.service.MissionService;
import com.yeojiphap.choki.domain.shopping.dto.ProductCompareRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ProductNameSearchDto;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yeojiphap.choki.domain.shopping.dto.ProductCompareResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.ShoppingCreateRequestDto;
import com.yeojiphap.choki.domain.shopping.service.ShoppingService;
import com.yeojiphap.choki.global.ApiResponse;

import jakarta.transaction.Transactional;
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
}
