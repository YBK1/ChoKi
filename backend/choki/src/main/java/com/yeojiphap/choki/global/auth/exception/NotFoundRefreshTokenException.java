package com.yeojiphap.choki.global.auth.exception;

import org.springframework.http.HttpStatus;

public class NotFoundRefreshTokenException extends RuntimeException {

    @Override
    public String getMessage() {
        return RefreshExceptionMessage.NOT_FOUND_REFRESH_TOKEN.getMessage();
    }
    public HttpStatus getStatus() {
        return RefreshExceptionMessage.NOT_FOUND_REFRESH_TOKEN.getStatus();
    }
}
