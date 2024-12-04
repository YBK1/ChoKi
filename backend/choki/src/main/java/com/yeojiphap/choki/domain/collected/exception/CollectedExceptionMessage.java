package com.yeojiphap.choki.domain.collected.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum CollectedExceptionMessage {
    ANIMAL_ALREADY_EXIST("이미 보유중인 동물입니다.", HttpStatus.BAD_REQUEST),
    ANIMAL_NOT_OWNED("보유한 동물이 아닙니다.", HttpStatus.FORBIDDEN),
    ALL_ANIMAL_OWNED("모든 동물을 보유하고 있습니다.", HttpStatus.NOT_FOUND);

    private final String message;
    private final HttpStatus status;

    CollectedExceptionMessage(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
