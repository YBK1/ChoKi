package com.yeojiphap.choki.domain.user.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum InvalidUserRoleExceptionMessage {
    INVALID_USER_ROLE("유저의 역할이 적절하지 않습니다.", HttpStatus.FORBIDDEN.value());

    private final String message;
    private final int status;

    InvalidUserRoleExceptionMessage(final String message, final int status) {
        this.message = message;
        this.status = status;
    }
}
