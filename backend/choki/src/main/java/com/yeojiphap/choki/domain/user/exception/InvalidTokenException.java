package com.yeojiphap.choki.domain.user.exception;

public class InvalidTokenException extends RuntimeException {
    @Override
    public String getMessage() {
        return InvalidTokenExceptionMessage.INVALID_TOKEN.getMessage();
    }

    public int getStatus() {
        return InvalidTokenExceptionMessage.INVALID_TOKEN.getStatus();
    }
}
