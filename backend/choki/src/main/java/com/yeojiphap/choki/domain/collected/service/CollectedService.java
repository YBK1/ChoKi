package com.yeojiphap.choki.domain.collected.service;

import com.yeojiphap.choki.domain.character.domain.Animal;
import com.yeojiphap.choki.domain.character.dto.AnimalDto;
import com.yeojiphap.choki.domain.character.dto.AnimalListDto;
import com.yeojiphap.choki.domain.character.service.AnimalService;
import com.yeojiphap.choki.domain.collected.domain.AnimalGrade;
import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.collected.dto.UnownedAnimalsDto;
import com.yeojiphap.choki.domain.collected.exception.AllAnimalsOwnedException;
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
import java.util.Random;

import static com.yeojiphap.choki.domain.collected.domain.AnimalGrade.*;
import static com.yeojiphap.choki.domain.collected.message.CollectedSuccessMessage.*;

@Service
@RequiredArgsConstructor
public class CollectedService {
    private final CollectedRepository collectedRepository;
    private final UserRepository userRepository;
    private final AnimalService animalService;
    private static final Random random = new Random();

    @Transactional
    public void addBaseAnimalToUser(Long userId, Long animalId) {
        User user = findByUserId(userId);
        Animal animal = findAnimalById(animalId);

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

    public AnimalDto drawRandomAnimal() {
        UnownedAnimalsDto unownedAnimalsDtos = getUnownedAnimals();
        Long animalId = pickUnownedAnimal(unownedAnimalsDtos.unownedUnique(), unownedAnimalsDtos.unownedRare(), unownedAnimalsDtos.unownedCommon());
        Animal animal = findAnimalById(animalId);
        createCollected(animal);

        return AnimalDto.from(animal);
    }

    private void createCollected(Animal animal) {
        User user = findCurrentUser();
        Collected collected = Collected.builder()
                .user(user)
                .animal(animal)
                .build();

        collectedRepository.save(collected);
    }

    private Long pickUnownedAnimal(List<Long> unownedUnique, List<Long> unownedRare, List<Long> unownedCommon) {
        AnimalGrade grade = pickGrade();
        List<Long> characters;

        switch (grade) {
            case UNIQUE -> characters = unownedUnique;
            case RARE -> characters = unownedRare;
            default -> characters = unownedCommon;
        }

        if (characters.isEmpty()) {
            characters = !unownedCommon.isEmpty() ? unownedCommon
                    : !unownedRare.isEmpty() ? unownedRare : unownedUnique;
        }

        if (characters.isEmpty()) {
            throw new AllAnimalsOwnedException();
        }

        return characters.get(random.nextInt(characters.size()));
    }

    private UnownedAnimalsDto getUnownedAnimals() {
        User user = findCurrentUser();
        List<Long> collectedAnimalIds = collectedRepository.findAnimalIdsByUserId(user.getId());

        List<Long> unownedUnique = UNIQUE.getCharacterIds().stream()
                .filter(id -> !collectedAnimalIds.contains(id))
                .toList();
        List<Long> unownedRare = RARE.getCharacterIds().stream()
                .filter(id -> !collectedAnimalIds.contains(id))
                .toList();
        List<Long> unownedCommon = COMMON.getCharacterIds().stream()
                .filter(id -> !collectedAnimalIds.contains(id))
                .toList();

        return new UnownedAnimalsDto(unownedUnique, unownedRare, unownedCommon);
    }

    private AnimalGrade pickGrade() {
        int randomValue = random.nextInt(100) + 1;

        if (randomValue <= 10) {
            return UNIQUE;
        }
        if (randomValue <= 40) {
            return RARE;
        }

        return COMMON;
    }

    private void validateAnimalOwnership(Long userId, Long animalId) {
        if (!collectedRepository.existsByAnimalIdAndUserId(animalId, userId)) {
            throw new AnimalNotOwnedException();
        }
    }

    private User findCurrentUser() {
        return userRepository.findByUsername(SecurityUtil.getCurrentUsername()).orElseThrow(UserNotFoundException::new);
    }

    private User findByUserId(Long id) {
        return userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    private Animal findAnimalById(Long id) {
        return animalService.findById(id);
    }
}
