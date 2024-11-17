package com.yeojiphap.choki.domain.user.dto.response;

public record UserLevelDto(int level, int pastLevel, boolean isLevelUp, Long drawAnimalId) {
    public static UserLevelDto of(int currentLevel, int pastLevel) {
        return new UserLevelDto(currentLevel, pastLevel,currentLevel > pastLevel, 0L);
    }

    public UserLevelDto withDrawnAnimal(Long animalId) {
        return new UserLevelDto(this.level, this.pastLevel, this.isLevelUp, animalId);
    }
}