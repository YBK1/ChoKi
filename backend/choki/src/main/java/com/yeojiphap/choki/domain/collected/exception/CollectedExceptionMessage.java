package com.yeojiphap.choki.domain.collected.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum CollectedExceptionMessage {
    ANIMAL_ALREADY_EXIST("이미 보유중인 동물입니다.", HttpStatus.BAD_REQUEST);

    private final String message;
    private final HttpStatus status;

    CollectedExceptionMessage(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
