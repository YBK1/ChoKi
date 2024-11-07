package com.yeojiphap.choki.domain.collected.exception;

import org.springframework.http.HttpStatus;

public class AnimalNotOwnedException extends RuntimeException {
    @Override
    public String getMessage() {
        return CollectedExceptionMessage.ANIMAL_NOT_OWNED.getMessage();
    }
    public HttpStatus getStatus() {
        return CollectedExceptionMessage.ANIMAL_NOT_OWNED.getStatus();
    }
}
