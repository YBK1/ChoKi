package com.yeojiphap.choki.domain.collected.service;

import com.yeojiphap.choki.domain.character.domain.Animal;
import com.yeojiphap.choki.domain.character.dto.AnimalDto;
import com.yeojiphap.choki.domain.character.dto.AnimalListDto;
import com.yeojiphap.choki.domain.character.exception.AnimalNotFoundException;
import com.yeojiphap.choki.domain.character.repository.AnimalRepository;
import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.collected.exception.AnimalAlreadyExistException;
import com.yeojiphap.choki.domain.collected.exception.AnimalNotOwnedException;
import com.yeojiphap.choki.domain.collected.repository.CollectedRepository;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.yeojiphap.choki.domain.collected.message.CollectedSuccessMessage.*;

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

    @Transactional(readOnly = true)
    public AnimalListDto getCollectedAnimals() {
        User user = findCurrentUser();
        List<Collected> collectedAnimals = collectedRepository.findByUser(user.getId());
        List<AnimalDto> animalDtos = collectedAnimals.stream()
                .map(collected -> AnimalDto.from(collected.getAnimal()))
                .toList();

        return new AnimalListDto(animalDtos);
    }

    @Transactional
    public String updateMainAnimal(Long animalId) {
        User user = findCurrentUser();
        validateAnimalOwnership(user.getId(), animalId);

        user.updateMainAnimal(animalId);
        return MAIN_ANIMAL_UPDATE_SUCCESS.getMessage();
    }

    private void validateAnimalOwnership(Long userId, Long animalId) {
        if (!collectedRepository.existsByAnimalIdAndUserId(animalId, userId)) {
            throw new AnimalNotOwnedException();
        }
    }

    private User findCurrentUser() {
        return userRepository.findByUserId(SecurityUtil.getCurrentUserId()).orElseThrow(UserNotFoundException::new);
    }

    private User findByUserId(Long id) {
        return userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    private Animal findByAnimalId(Long id) {
        return animalRepository.findById(id).orElseThrow(AnimalNotFoundException::new);
    }
}
