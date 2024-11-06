package com.yeojiphap.choki.domain.map.message;

public enum MapSuccessMessage {
    GUIDED_ROUTE_SAVE_SUCCESS("예습 경로 저장 성공"),
    GUIDED_ROUTES_SEARCH_SUCCESS("가이드 경로 목록 조회 성공");
    private final String message;

    MapSuccessMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
