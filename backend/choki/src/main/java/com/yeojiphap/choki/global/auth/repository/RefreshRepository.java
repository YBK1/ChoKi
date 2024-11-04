package com.yeojiphap.choki.global.auth.repository;

import com.yeojiphap.choki.global.auth.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

public interface RefreshRepository extends CrudRepository<RefreshToken, String> {
    Boolean existsByRefresh(String refresh);

    @Transactional
    void deleteByRefresh(String refresh);
}
