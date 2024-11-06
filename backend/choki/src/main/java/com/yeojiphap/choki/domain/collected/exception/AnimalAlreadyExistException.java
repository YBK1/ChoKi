package com.yeojiphap.choki.domain.collected.exception;

import com.yeojiphap.choki.domain.user.exception.UserExceptionMessage;
import org.springframework.http.HttpStatus;

public class AnimalAlreadyExistException extends RuntimeException {
    @Override
    public String getMessage() {
        return CollectedExceptionMessage.ANIMAL_ALREADY_EXIST.getMessage();
    }
    public HttpStatus getStatus() {
        return CollectedExceptionMessage.ANIMAL_ALREADY_EXIST.getStatus();
    }
}
