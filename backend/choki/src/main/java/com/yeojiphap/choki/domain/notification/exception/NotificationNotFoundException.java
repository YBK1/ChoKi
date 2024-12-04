package com.yeojiphap.choki.domain.notification.exception;

import org.springframework.http.HttpStatus;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class NotificationNotFoundException extends RuntimeException {
	@Override
	public String getMessage() {
		return "검색 결과가 존재하지 않습니다.";
	}
	public HttpStatus getStatus() {
		return HttpStatus.NOT_FOUND;
	}
}
