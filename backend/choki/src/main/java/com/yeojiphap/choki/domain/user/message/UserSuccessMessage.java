package com.yeojiphap.choki.domain.user.message;

public enum UserSuccessMessage {
    SIGN_UP_SUCCESS("회원가입 성공"),
    USER_ID_VALIDATION_SUCCESS("사용 가능한 아이디입니다."),
    ;

    private final String message;

    UserSuccessMessage(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
}
