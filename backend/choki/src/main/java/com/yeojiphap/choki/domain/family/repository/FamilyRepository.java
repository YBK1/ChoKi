package com.yeojiphap.choki.domain.family.repository;

import com.yeojiphap.choki.domain.family.domain.Family;
import com.yeojiphap.choki.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyRepository extends JpaRepository<Family, Long> {

}
