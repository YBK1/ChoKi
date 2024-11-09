package com.yeojiphap.choki.domain.shopping.exception;

import org.springframework.http.HttpStatus;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UnauthorizedRoleException extends RuntimeException {
	@Override
	public String getMessage() {
		return "현재 로그인한 사용자는 이용할 수 없는 기능입니다.";
	}
	public HttpStatus getStatus() {
		return HttpStatus.FORBIDDEN;
	}
}