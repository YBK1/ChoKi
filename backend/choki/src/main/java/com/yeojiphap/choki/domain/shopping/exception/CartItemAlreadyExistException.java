package com.yeojiphap.choki.domain.shopping.exception;

import org.springframework.http.HttpStatus;

public class CartItemAlreadyExistException extends RuntimeException {
	@Override
	public String getMessage() {
		return "이미 담은 상품은 수량 변경만 가능합니다.";
	}
	public HttpStatus getStatus() {
		return HttpStatus.BAD_REQUEST;
	}
}
