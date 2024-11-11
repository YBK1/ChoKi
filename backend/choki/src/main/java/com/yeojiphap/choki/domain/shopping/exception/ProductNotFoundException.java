package com.yeojiphap.choki.domain.shopping.exception;

import org.springframework.http.HttpStatus;

public class ProductNotFoundException extends RuntimeException {
	@Override
	public String getMessage() {
		return "존재하지 않는 상품 데이터 입니다.";
	}
	public HttpStatus getStatus() {
		return HttpStatus.NOT_FOUND;
	}
}
