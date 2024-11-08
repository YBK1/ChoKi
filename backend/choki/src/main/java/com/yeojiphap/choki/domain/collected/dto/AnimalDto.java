package com.yeojiphap.choki.domain.collected.dto;

import com.yeojiphap.choki.domain.character.domain.Animal;

public record AnimalDto(Long animalId) {
    public static AnimalDto from(Animal animal) {
        return new AnimalDto(animal.getId());
    }
}
