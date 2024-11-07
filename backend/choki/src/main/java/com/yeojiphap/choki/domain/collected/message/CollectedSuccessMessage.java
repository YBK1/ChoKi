package com.yeojiphap.choki.domain.collected.message;

public enum CollectedSuccessMessage {
    COLLECTED_REGIST_SUCCESS("캐릭터 등록 성공");

    private final String message;

    CollectedSuccessMessage(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
}
