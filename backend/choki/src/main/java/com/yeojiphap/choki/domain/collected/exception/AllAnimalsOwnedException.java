package com.yeojiphap.choki.domain.collected.exception;

import org.springframework.http.HttpStatus;

import static com.yeojiphap.choki.domain.collected.exception.CollectedExceptionMessage.*;

public class AllAnimalsOwnedException extends RuntimeException {
    @Override
    public String getMessage() {
        return ALL_ANIMAL_OWNED.getMessage();
    }
    public HttpStatus getStatus() {
        return ALL_ANIMAL_OWNED.getStatus();
    }
}
