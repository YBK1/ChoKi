package com.yeojiphap.choki.domain.collected.service;

import com.yeojiphap.choki.domain.character.domain.Animal;
import com.yeojiphap.choki.domain.character.exception.AnimalNotFoundException;
import com.yeojiphap.choki.domain.character.repository.AnimalRepository;
import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.collected.exception.AnimalAlreadyExistException;
import com.yeojiphap.choki.domain.collected.repository.CollectedRepository;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CollectedService {
    private final CollectedRepository collectedRepository;
    private final UserRepository userRepository;
    private final AnimalRepository animalRepository;

    @Transactional
    public void addBaseAnimalToUser(Long userId, Long animalId) {
        User user = findByUserId(userId);
        Animal animal = findByAnimalId(animalId);

        if (collectedRepository.findByUserAndAnimal(user, animal).isPresent()) {
            throw new AnimalAlreadyExistException();
        }

        Collected collected = Collected.builder()
                .user(user)
                .animal(animal)
                .build();

        collectedRepository.save(collected);
    }

    private User findByUserId(Long id) {
        return userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    private Animal findByAnimalId(Long id) {
        return animalRepository.findById(id).orElseThrow(AnimalNotFoundException::new);
    }
}
