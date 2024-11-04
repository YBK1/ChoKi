package com.yeojiphap.choki.domain.user.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum UserExceptionMessage {
    USER_NOT_FOUND("해당 유저가 존재하지 않습니다.", HttpStatus.NOT_FOUND),;

    private final String message;
    private final HttpStatus status;

    UserExceptionMessage(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
