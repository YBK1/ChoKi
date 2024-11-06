package com.yeojiphap.choki.domain.user.exception;

import org.springframework.http.HttpStatus;

public class ChildNotExistException extends RuntimeException {

    @Override
    public String getMessage() {
        return FamilyExceptionMessage.CHILD_NOT_FOUND.getMessage();
    }
    public HttpStatus getStatus() {
        return FamilyExceptionMessage.CHILD_NOT_FOUND.getStatus();
    }
}
