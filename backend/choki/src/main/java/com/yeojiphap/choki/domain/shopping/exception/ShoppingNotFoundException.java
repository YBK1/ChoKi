package com.yeojiphap.choki.domain.shopping.exception;

import org.springframework.http.HttpStatus;

import com.yeojiphap.choki.domain.user.exception.UserExceptionMessage;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ShoppingNotFoundException extends RuntimeException {
	@Override
	public String getMessage() {
		return "검색 결과가 존재하지 않습니다.";
	}
	public HttpStatus getStatus() {
		return HttpStatus.NOT_FOUND;
	}
}
