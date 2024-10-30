package com.yeojiphap.choki.domain.user.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum UserNotFoundExceptionMessage {
    USER_NOT_FOUND("유저가 존재하지 않습니다.", HttpStatus.NOT_FOUND.value());

    private final String message;
    private final int status;

    UserNotFoundExceptionMessage(final String message, final int status) {
        this.message = message;
        this.status = status;
    }
}
