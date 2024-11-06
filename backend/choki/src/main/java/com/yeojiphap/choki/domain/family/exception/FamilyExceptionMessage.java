package com.yeojiphap.choki.domain.family.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum FamilyExceptionMessage {
    FAMILY_NOT_FOUND("해당 가족이 존재하지 않습니다.", HttpStatus.NOT_FOUND),
    CHILD_NOT_FOUND("자녀가 존재하지 않습니다.", HttpStatus.NOT_FOUND),
    INVALID_INVITE_CODE("유효하지 않은 초대코드입니다.", HttpStatus.BAD_REQUEST),
    ;

    private final String message;
    private final HttpStatus status;

    FamilyExceptionMessage(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
