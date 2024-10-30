package com.yeojiphap.choki.domain.user.service;

import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public ResponseEntity<?> getChildInfo(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
    }
}
