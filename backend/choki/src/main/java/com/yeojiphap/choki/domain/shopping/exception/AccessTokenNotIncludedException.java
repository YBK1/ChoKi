package com.yeojiphap.choki.domain.shopping.exception;

import org.springframework.http.HttpStatus;

public class AccessTokenNotIncludedException extends RuntimeException {
	@Override
	public String getMessage() {
		return "인증이 필요합니다.";
	}
	public HttpStatus getStatus() {
		return HttpStatus.FORBIDDEN;
	}
}
