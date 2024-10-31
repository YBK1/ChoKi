package com.yeojiphap.choki.domain.user.service;

import static com.yeojiphap.choki.domain.user.message.UserSuccessMessage.*;

import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.dto.signUpRequest;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    // private final UserRepository userRepository;
    // private final BCryptPasswordEncoder bCryptPasswordEncoder;
    //
    // public String signUp(signUpRequest signUpRequest) {
    //     String encodedPassword = bCryptPasswordEncoder.encode(signUpRequest.userPassword());
    //     User user = signUpRequest.toEntity(encodedPassword);
    //     userRepository.save(user);
    //     return SIGN_UP_SUCCESS.getMessage();
    // }
}
