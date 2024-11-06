package com.yeojiphap.choki.domain.user.exception;

import org.springframework.http.HttpStatus;

import static com.yeojiphap.choki.domain.user.exception.UserExceptionMessage.*;

public class UserIdDuplicatedException extends RuntimeException {

    @Override
    public String getMessage() {
        return USER_ID_DUPLICATED.getMessage();
    }
    public HttpStatus getStatus() {
        return USER_ID_DUPLICATED.getStatus();
    }
}
