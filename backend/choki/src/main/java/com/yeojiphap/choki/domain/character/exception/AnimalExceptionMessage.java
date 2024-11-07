package com.yeojiphap.choki.domain.character.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum AnimalExceptionMessage {
    ANIMAL_NOT_FOUND("해당 동물이 존재하지 않습니다.", HttpStatus.NOT_FOUND);

    private final String message;
    private final HttpStatus status;

    AnimalExceptionMessage(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
