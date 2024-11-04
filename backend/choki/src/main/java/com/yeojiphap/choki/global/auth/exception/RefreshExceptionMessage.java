package com.yeojiphap.choki.global.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum RefreshExceptionMessage {
    NOT_FOUND_REFRESH_TOKEN("리프레시 토큰을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    EXPIRED_REFRESH_TOKEN("리프레시 토큰이 만료되었습니다.", HttpStatus.BAD_REQUEST),
    INVALID_REFRESH_TOKEN("유효하지 않은 리프레시 토큰입니다.", HttpStatus.BAD_REQUEST);

    private final String message;
    private final HttpStatus status;

    RefreshExceptionMessage(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
