package com.yeojiphap.choki.global.auth.exception;

import org.springframework.http.HttpStatus;

public class InvalidRefreshTokenException extends RuntimeException {
    @Override
    public String getMessage() {
        return RefreshExceptionMessage.INVALID_REFRESH_TOKEN.getMessage();
    }
    public HttpStatus getStatus() {
        return RefreshExceptionMessage.INVALID_REFRESH_TOKEN.getStatus();
    }
}
