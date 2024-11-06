package com.yeojiphap.choki.domain.collected.repository;

import com.yeojiphap.choki.domain.character.domain.Animal;
import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CollectedRepository extends JpaRepository<Collected, Long> {
    Optional<Collected> findByUserAndAnimal(User user, Animal animal);
}
