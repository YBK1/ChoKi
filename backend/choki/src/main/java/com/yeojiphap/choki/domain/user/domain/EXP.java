package com.yeojiphap.choki.domain.user.domain;

import lombok.Getter;

@Getter
public enum EXP {
    MAX_EXP(100),;

    private final int exp;

    EXP(int exp) {
        this.exp = exp;
    }
}
