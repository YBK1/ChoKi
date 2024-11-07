package com.yeojiphap.choki.domain.collected.repository;

import com.yeojiphap.choki.domain.character.domain.Animal;
import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CollectedRepository extends JpaRepository<Collected, Long> {
    Optional<Collected> findByUserAndAnimal(User user, Animal animal);

    @Query("SELECT c FROM Collected c JOIN FETCH c.animal WHERE c.user.id = :userId")
    List<Collected> findByUser(@Param("userId") Long userId);

    boolean existsByAnimalIdAndUserId(Long animalId, Long userId);

    @Query("SELECT c.animal.id FROM Collected c WHERE c.user.id = :userId")
    List<Long> findAnimalIdsByUserId(Long userId);
}
