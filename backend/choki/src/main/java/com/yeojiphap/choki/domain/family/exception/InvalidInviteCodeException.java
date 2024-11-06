package com.yeojiphap.choki.domain.family.exception;

import org.springframework.http.HttpStatus;

import static com.yeojiphap.choki.domain.family.exception.FamilyExceptionMessage.*;

public class InvalidInviteCodeException extends RuntimeException {

    @Override
    public String getMessage() {
        return INVALID_INVITE_CODE.getMessage();
    }
    public HttpStatus getStatus() {
        return INVALID_INVITE_CODE.getStatus();
    }
}
