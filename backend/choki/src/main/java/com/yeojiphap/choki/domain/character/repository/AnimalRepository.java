package com.yeojiphap.choki.domain.character.repository;

import com.yeojiphap.choki.domain.character.domain.Animal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
}
