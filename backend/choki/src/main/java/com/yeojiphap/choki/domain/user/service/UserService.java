package com.yeojiphap.choki.domain.user.service;

import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.collected.repository.CollectedRepository;
import com.yeojiphap.choki.domain.collected.service.CollectedService;
import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.dto.response.ChildResponseDto;
import com.yeojiphap.choki.domain.user.dto.response.OtherUserResponseDto;
import com.yeojiphap.choki.domain.user.dto.response.TokenResponse;
import com.yeojiphap.choki.domain.user.dto.response.UserResponseDto;
import com.yeojiphap.choki.domain.user.dto.request.UserIdRequest;
import com.yeojiphap.choki.domain.user.exception.UserIdDuplicatedException;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.message.UserSuccessMessage;
import com.yeojiphap.choki.global.auth.jwt.JWTUtil;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.dto.request.signUpRequest;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.global.auth.service.TokenService;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final JWTUtil jwtUtil;
    private final TokenService tokenService;
    private final CollectedService collectedService;
    private final CollectedRepository collectedRepository;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public TokenResponse signUp(signUpRequest signUpRequest) {
        String encodedPassword = bCryptPasswordEncoder.encode(signUpRequest.userPassword());
        User user = signUpRequest.toEntity(encodedPassword);
        userRepository.save(user);

        // 기본 캐릭터 추가
        collectedService.addBaseAnimalToUser(user.getId(), 20L);
        return createToken(user.getUserId(), user.getRole());
    }

    public ChildResponseDto getChildInfo(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        return ChildResponseDto.from(user);
    }

    public UserResponseDto getUserDetailInfo() {
        User currentUser = findByUserId(SecurityUtil.getCurrentUserId());
        List<Collected> collected = collectedRepository.findByUser(currentUser.getId());

        return UserResponseDto.from(currentUser, collected);
    }

    // 아이디로 유저 정보 조회하기
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

    public OtherUserResponseDto getOtherUserInfo(String userId) {
        User user = findByUserId(userId);
        List<Collected> collected = collectedRepository.findByUser(user.getId());

        return OtherUserResponseDto.from(user, collected);
    }
}