package com.yeojiphap.choki.domain.map.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum MapExceptionMessage {
    GUIDED_ROUTE_NOT_FOUND("존재하지 않는 가이드 경로입니다.", HttpStatus.NOT_FOUND),
    ;

    private final String message;
    private final HttpStatus status;

    MapExceptionMessage(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
