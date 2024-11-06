package com.yeojiphap.choki.domain.family.exception;

import org.springframework.http.HttpStatus;

public class FamilyNotFoundException extends RuntimeException {

    @Override
    public String getMessage() {
        return FamilyExceptionMessage.FAMILY_NOT_FOUND.getMessage();
    }
    public HttpStatus getStatus() {
        return FamilyExceptionMessage.FAMILY_NOT_FOUND.getStatus();
    }
}
