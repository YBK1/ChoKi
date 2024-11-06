package com.yeojiphap.choki.domain.family.repository;

import com.yeojiphap.choki.domain.family.domain.Family;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FamilyRepository extends JpaRepository<Family, Long> {
    Optional<Family> findByUsers_UserId(String userId);
}
