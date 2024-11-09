package com.yeojiphap.choki.domain.user.dto.response;

import com.yeojiphap.choki.domain.user.domain.User;

public record ChildResponseDto (Long id, String nickname, Long mainAnimalId, int level, int exp, boolean isLevelUp) {
    public static ChildResponseDto from (User user) {
        return new ChildResponseDto(user.getId(), user.getNickname(), user.getMainAnimal(), user.getLevel(), user.getExp(), levelUpValidation(user.getLevel(), user.getPastLevel()));
    }

    private static boolean levelUpValidation (int level, int pastLevel) {
        return level > pastLevel;
    }
}
