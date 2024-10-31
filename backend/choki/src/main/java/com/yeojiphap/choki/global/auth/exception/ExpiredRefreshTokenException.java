package com.yeojiphap.choki.global.auth.exception;

import org.springframework.http.HttpStatus;

public class ExpiredRefreshTokenException extends RuntimeException {
    @Override
    public String getMessage() {
        return RefreshExceptionMessage.EXPIRED_REFRESH_TOKEN.getMessage();
    }
    public HttpStatus getStatus() {
        return RefreshExceptionMessage.EXPIRED_REFRESH_TOKEN.getStatus();
    }
}
