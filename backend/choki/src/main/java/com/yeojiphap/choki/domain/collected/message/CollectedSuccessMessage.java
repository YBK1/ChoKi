package com.yeojiphap.choki.domain.collected.message;

import lombok.Getter;

@Getter
public enum CollectedSuccessMessage {
    COLLECTED_REGIST_SUCCESS("캐릭터 등록 성공"),
    COLLECTED_SEARCH_MESSAGE("보유 캐릭터 조회 성공"),
    MAIN_ANIMAL_UPDATE_SUCCESS("메인 캐릭터 변경 성공");

    private final String message;

    CollectedSuccessMessage(String message) {
        this.message = message;
    }
}
