package com.yeojiphap.choki.global.auth.exception;

public class ExpiredRefreshToken extends RuntimeException {
    @Override
    public String getMessage() {
        return RefreshExceptionMessage.EXPIRED_REFRESH_TOKEN.getMessage();
    }
    public int getStatus() {
        return RefreshExceptionMessage.EXPIRED_REFRESH_TOKEN.getStatus();
    }
}
