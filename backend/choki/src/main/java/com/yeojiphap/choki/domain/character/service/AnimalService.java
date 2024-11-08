package com.yeojiphap.choki.domain.character.service;

import com.yeojiphap.choki.domain.character.domain.Animal;
import com.yeojiphap.choki.domain.character.exception.AnimalNotFoundException;
import com.yeojiphap.choki.domain.character.repository.AnimalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnimalService {
    private final AnimalRepository animalRepository;

    public Animal findById(Long id) {
        return animalRepository.findById(id).orElseThrow(AnimalNotFoundException::new);
    }
}
