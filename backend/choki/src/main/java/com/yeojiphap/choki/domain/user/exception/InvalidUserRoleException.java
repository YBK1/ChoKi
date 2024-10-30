package com.yeojiphap.choki.domain.user.exception;

public class InvalidUserRoleException extends RuntimeException {
    @Override
    public String getMessage() {
        return InvalidUserRoleExceptionMessage.INVALID_USER_ROLE.getMessage();
    }

    public int getStatus() {
        return InvalidUserRoleExceptionMessage.INVALID_USER_ROLE.getStatus();
    }
}
