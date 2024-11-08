package com.yeojiphap.choki.domain.collected.domain;

import java.util.Arrays;
import java.util.List;

public enum AnimalGrade {
    UNIQUE(Arrays.asList(1L, 2L, 3L, 4L, 5L, 6L, 7L)),
    RARE(Arrays.asList(8L, 9L, 10L, 11L, 12L, 13L, 14L, 15L, 16L, 17L, 18L, 19L)),
    COMMON(Arrays.asList(20L, 21L, 22L, 23L, 24L, 25L, 26L, 27L, 28L, 29L, 30L, 31L, 32L, 33L, 34L));

    private final List<Long> animalIds;

    AnimalGrade(List<Long> animalIds) {
        this.animalIds = animalIds;
    }

    public List<Long> getCharacterIds() {
        return animalIds;
    }
}
