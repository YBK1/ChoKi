package com.yeojiphap.choki.domain.map.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum MapExceptionMessage {
    ROUTE_NOT_FOUND("요청한 경로가 존재하지 않습니다.", HttpStatus.NOT_FOUND),
    ;

    private final String message;
    private final HttpStatus status;

    MapExceptionMessage(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }
}
