package com.yeojiphap.choki.domain.character.dto;

import com.yeojiphap.choki.domain.character.domain.Animal;
import com.yeojiphap.choki.domain.character.domain.Degree;

public record AnimalDto(Long id, Degree degree, String enName, String koName, String animalImage) {
    public static AnimalDto from(Animal animal){
        return new AnimalDto(animal.getId(), animal.getDegree(), animal.getEnName(), animal.getKoName(), animal.getAnimalImage());
    }
}
