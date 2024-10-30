package com.yeojiphap.choki.domain.user.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum InvalidTokenExceptionMessage {
    INVALID_TOKEN("토큰이 유효하지 않습니다.", HttpStatus.UNAUTHORIZED.value());

    private final String message;
    private final int status;

    InvalidTokenExceptionMessage(final String message, final int status) {
        this.message = message;
        this.status = status;
    }
}
