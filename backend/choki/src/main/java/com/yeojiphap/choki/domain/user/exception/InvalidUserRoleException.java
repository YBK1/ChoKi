package com.yeojiphap.choki.domain.user.exception;

import org.springframework.http.HttpStatus;

public class InvalidUserRoleException extends RuntimeException {
    @Override
    public String getMessage() {
        return UserExceptionMessage.INVALID_USER_ROLE.getMessage();
    }
    public HttpStatus getStatus() {
        return UserExceptionMessage.INVALID_USER_ROLE.getStatus();
    }
}
