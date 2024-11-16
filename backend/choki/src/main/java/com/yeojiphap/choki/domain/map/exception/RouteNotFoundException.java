package com.yeojiphap.choki.domain.map.exception;

import org.springframework.http.HttpStatus;

public class RouteNotFoundException extends RuntimeException{
    @Override
    public String getMessage() {
        return MapExceptionMessage.ROUTE_NOT_FOUND.getMessage();
    }
    public HttpStatus getStatus() {
        return MapExceptionMessage.ROUTE_NOT_FOUND.getStatus();
    }
}
