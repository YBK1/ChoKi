package com.yeojiphap.choki.domain.user.service;

import static com.yeojiphap.choki.domain.user.message.UserSuccessMessage.*;

import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.dto.signUpRequest;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public String signUp(signUpRequest signUpRequest) {
        User user = signUpRequest.toEntity();
        userRepository.save(user);
        return SIGN_UP_SUCCESS.getMessage();
    }
}
