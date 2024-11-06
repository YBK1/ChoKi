package com.yeojiphap.choki.domain.family.message;

public enum FamilySuccessMessage {
    FAMILY_CREATION_SUCCESS("가족 생성 성공");
    private final String message;

    FamilySuccessMessage(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
}
