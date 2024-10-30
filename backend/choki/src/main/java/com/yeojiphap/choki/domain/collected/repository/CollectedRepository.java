package com.yeojiphap.choki.domain.collected.repository;

import com.yeojiphap.choki.domain.collected.domain.Collected;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollectedRepository extends JpaRepository<Collected, Long> {
    List<Collected> findAllByUserId(Long userId);
}
