package com.yeojiphap.choki.domain.user.dto.response;

public record UserLevelDto(int level, int exp, boolean isLevelUp, Long drawAnimalId) {
    public static UserLevelDto of(int currentLevel, int pastLevel, int exp) {
        return new UserLevelDto(currentLevel, exp, currentLevel > pastLevel, 0L);
    }

    public UserLevelDto withDrawnAnimal(Long animalId) {
        return new UserLevelDto(this.level, this.exp, this.isLevelUp, animalId);
    }
}