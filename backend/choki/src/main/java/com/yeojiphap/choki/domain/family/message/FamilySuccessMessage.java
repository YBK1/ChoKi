package com.yeojiphap.choki.domain.family.message;

public enum FamilySuccessMessage {
    FAMILY_CREATION_SUCCESS("가족 생성 성공"),
    GET_CHILD_INFO_SUCCESS("자녀 정보 조회 성공"),
    FAMILY_ASSIGN_SUCCESS("가족 등록 성공");
    private final String message;

    FamilySuccessMessage(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
}
