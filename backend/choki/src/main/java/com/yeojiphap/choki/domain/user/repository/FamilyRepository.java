package com.yeojiphap.choki.domain.user.repository;

import com.yeojiphap.choki.domain.user.domain.Family;
import com.yeojiphap.choki.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FamilyRepository extends JpaRepository<Family, Long> {
    Optional<Family> findByUsers_UserId(String userId);

    @Query("SELECT u FROM User u WHERE u.family.id = :familyId AND u.role = 'CHILD'")
    public List<User> getChildren(@Param("familyId") Long familyId);

}
