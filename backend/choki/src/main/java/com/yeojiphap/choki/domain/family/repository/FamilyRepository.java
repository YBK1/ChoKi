package com.yeojiphap.choki.domain.family.repository;

import com.yeojiphap.choki.domain.family.domain.Family;
import com.yeojiphap.choki.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FamilyRepository extends JpaRepository<Family, Long> {
    Optional<Family> findByUsers_Username(String username);

    @Query("SELECT u FROM User u WHERE u.family.id = :familyId AND u.role = 'CHILD'")
    List<User> getChildren(@Param("familyId") Long familyId);

    Optional<Family> findByInviteCode(String inviteCode);
}
