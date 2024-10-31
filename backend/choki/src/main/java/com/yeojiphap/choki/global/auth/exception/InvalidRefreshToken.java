package com.yeojiphap.choki.global.auth.exception;

public class InvalidRefreshToken extends RuntimeException {
    @Override
    public String getMessage() {
        return RefreshExceptionMessage.INVALID_REFRESH_TOKEN.getMessage();
    }
    public int getStatus() {
        return RefreshExceptionMessage.INVALID_REFRESH_TOKEN.getStatus();
    }
}
