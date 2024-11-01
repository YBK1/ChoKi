package com.yeojiphap.choki.domain.chore.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yeojiphap.choki.domain.chore.domain.Chore;
import com.yeojiphap.choki.domain.chore.service.ChoreService;
import com.yeojiphap.choki.global.ApiResponse;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/chore")
public class ChoreController {
	private final ChoreService choreService;

	@PostMapping("/create")
	public ApiResponse create(@RequestBody Chore chore) {
		return ApiResponse.success(HttpStatus.CREATED, "a");
	}

	@GetMapping("/item")
	public ApiResponse searchByName(@RequestParam("itemName") String itemName, Pageable pageable) {
		return ApiResponse.success(HttpStatus.OK, choreService.searchProductByName(itemName, pageable), "상품 조회 성공");
	}

	@GetMapping("/barcode/{barcode}")
	public ApiResponse searchByBarcode(@PathVariable("barcode") String barcode) {
		return ApiResponse.success(HttpStatus.OK, choreService.searchProductByBarcode(barcode), "상품 조회 성공");
	}

	@GetMapping("/test")
	public ApiResponse test() {
		return ApiResponse.success(HttpStatus.OK, "성공!!");
	}
}
