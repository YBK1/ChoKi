package com.yeojiphap.choki.domain.user.service;

import java.util.Optional;

import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.dto.TokenResponse;
import com.yeojiphap.choki.domain.user.dto.UserIdRequest;
import com.yeojiphap.choki.domain.user.exception.UserIdDuplicatedException;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.message.UserSuccessMessage;
import com.yeojiphap.choki.global.auth.jwt.JWTUtil;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.dto.signUpRequest;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.global.auth.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JWTUtil jwtUtil;
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public TokenResponse signUp(signUpRequest signUpRequest) {
        String encodedPassword = bCryptPasswordEncoder.encode(signUpRequest.userPassword());
        User user = signUpRequest.toEntity(encodedPassword);
        userRepository.save(user);

        return createToken(user.getUserId(), user.getRole());
    }

    @Transactional(readOnly = true)
    public String validateUserId(UserIdRequest request) {
        userRepository.findByUserId(request.userId())
                .ifPresent(user -> {
                    throw new UserIdDuplicatedException();
                });
        return UserSuccessMessage.USER_ID_VALIDATION_SUCCESS.getMessage();
    }

    @Transactional(readOnly = true)
    public User findByUserId(String userId) {
        return userRepository.findByUserId(userId).orElseThrow(UserNotFoundException::new);
    }

    private TokenResponse createToken(String username, Role role) {
        String access = jwtUtil.createJwt("access", username, Role.valueOf(role.toString()), 86400000L);
        String refresh = jwtUtil.createJwt("refresh", username, Role.valueOf(role.toString()), 86400000L);

        tokenService.addRefreshToken(username, refresh, 86400000L);
        return new TokenResponse(access, refresh);
    }

    // 아이디로 유저 정보 조회하기
    @Transactional(readOnly = true)
    public User findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }
}
