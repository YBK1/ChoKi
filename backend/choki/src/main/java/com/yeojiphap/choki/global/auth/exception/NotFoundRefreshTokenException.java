package com.yeojiphap.choki.global.auth.exception;

public class NotFoundRefreshTokenException extends RuntimeException {

    @Override
    public String getMessage() {
        return RefreshExceptionMessage.NOT_FOUND_REFRESH_TOKEN.getMessage();
    }
    public int getStatus() {
        return RefreshExceptionMessage.NOT_FOUND_REFRESH_TOKEN.getStatus();
    }
}
