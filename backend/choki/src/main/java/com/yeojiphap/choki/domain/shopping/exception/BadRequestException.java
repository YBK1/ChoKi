package com.yeojiphap.choki.domain.shopping.exception;

import org.springframework.http.HttpStatus;

import com.yeojiphap.choki.domain.user.exception.UserExceptionMessage;

import lombok.Getter;

public class BadRequestException extends RuntimeException {
	@Override
	public String getMessage() {
		return "입력 값이 일치하지 않습니다.";
	}
	public HttpStatus getStatus() {
		return HttpStatus.BAD_REQUEST;
	}
}