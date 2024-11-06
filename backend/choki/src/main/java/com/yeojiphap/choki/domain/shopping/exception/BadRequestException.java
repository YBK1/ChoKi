package com.yeojiphap.choki.domain.shopping.exception;

import org.springframework.http.HttpStatus;

import com.yeojiphap.choki.domain.user.exception.UserExceptionMessage;

import lombok.Getter;

public class BadRequestException extends RuntimeException {
	@Override
	public String getMessage() {
		return "";
	}
	public HttpStatus getStatus() {
		return UserExceptionMessage.USER_NOT_FOUND.getStatus();
	}
}