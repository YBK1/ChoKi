package com.yeojiphap.choki.domain.user.repository;

import com.yeojiphap.choki.domain.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
