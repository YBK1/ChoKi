package com.yeojiphap.choki.domain.map.exception;

import org.springframework.http.HttpStatus;

public class GuidedRouteNotFoundException extends RuntimeException{
    @Override
    public String getMessage() {
        return MapExceptionMessage.GUIDED_ROUTE_NOT_FOUND.getMessage();
    }
    public HttpStatus getStatus() {
        return MapExceptionMessage.GUIDED_ROUTE_NOT_FOUND.getStatus();
    }
}
