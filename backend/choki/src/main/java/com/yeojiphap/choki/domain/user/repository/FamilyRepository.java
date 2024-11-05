package com.yeojiphap.choki.domain.user.repository;

import com.yeojiphap.choki.domain.user.domain.Family;
import com.yeojiphap.choki.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyRepository extends JpaRepository<Family,Long> {
    @Query("SELECT u FROM User u WHERE u.family.id = :familyId AND u.role = 'CHILD'")
    public List<User> getChildren(@Param("familyId") Long familyId);
}
