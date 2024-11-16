package com.yeojiphap.choki.domain.user.service;

import com.yeojiphap.choki.domain.character.domain.Animal;
import com.yeojiphap.choki.domain.character.dto.AnimalDto;
import com.yeojiphap.choki.domain.character.service.AnimalService;
import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.collected.repository.CollectedRepository;
import com.yeojiphap.choki.domain.collected.service.CollectedService;
import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.dto.response.*;
import com.yeojiphap.choki.domain.user.dto.request.UserIdRequest;
import com.yeojiphap.choki.domain.user.dto.response.UserLevelDto;
import com.yeojiphap.choki.domain.user.exception.UserIdDuplicatedException;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.message.UserSuccessMessage;
import com.yeojiphap.choki.global.auth.jwt.JWTUtil;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.dto.request.signUpRequest;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.global.auth.service.TokenService;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    @PersistenceContext
    private EntityManager em;

    private final JWTUtil jwtUtil;
    private final TokenService tokenService;
    private final AnimalService animalService;
    private final UserRepository userRepository;
    private final CollectedService collectedService;
    private final CollectedRepository collectedRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    private static final Double SEARCH_RADIUS_KM = 1.5;

    @Transactional
    public TokenResponse signUp(signUpRequest signUpRequest) {
        String encodedPassword = bCryptPasswordEncoder.encode(signUpRequest.userPassword());
        User user = signUpRequest.toEntity(encodedPassword);
        userRepository.save(user);

        // 기본 캐릭터 추가
        collectedService.addBaseAnimalToUser(user.getId(), 21L);
        return createToken(user.getUsername(), user.getRole());
    }

    @Transactional(readOnly = true)
    public ChildResponseDto getChildInfo(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
        return ChildResponseDto.from(user);
    }

    @Transactional
    public UserResponseDto getUserDetailInfo() {
        User currentUser = findByUsername(SecurityUtil.getCurrentUsername());
        // 레벨 비교를 위한 변수 저장 (영속성 컨텍스트와 분리된 값)
        int currentLevel = currentUser.getLevel();
        int pastLevel = currentUser.getPastLevel();
        UserLevelDto levelInfo = UserLevelDto.of(currentLevel, pastLevel);
        log.info("현재 레벨 : {}, 이전 레벨 : {}, isLevelUp : {}", currentLevel, pastLevel, levelInfo.isLevelUp());
        AnimalDto drawnAnimal = null;
        if (levelInfo.isLevelUp()) {
            drawnAnimal = collectedService.drawRandomAnimal();
            levelInfo = levelInfo.withDrawnAnimal(drawnAnimal.animalId());
        }
        currentUser.updatePastLevel(currentLevel);
        List<Collected> collected = collectedRepository.findByUser(currentUser.getId());
        return UserResponseDto.from(currentUser, collected, levelInfo);
    }

    @Transactional(readOnly = true)
    public String validateUserId(UserIdRequest request) {
        userRepository.findByUsername(request.username())
                .ifPresent(user -> {
                    throw new UserIdDuplicatedException();
                });
        return UserSuccessMessage.USER_ID_VALIDATION_SUCCESS.getMessage();
    }

    @Transactional(readOnly = true)
    public NearbyUsersDto findNearbyUsers() {
        //Todo: 나의 정보를 한번 더 검색하는 것 filter에서 제외된 이미 검색된 동물을 사용하는걸로 수정
        User user = findCurrentUser();
        List<User> users = userRepository.findUsersWithinRadius(user.getLatitude(), user.getLongitude(), SEARCH_RADIUS_KM);
        List<UserMainCharacterDto> userMainCharacterDtos = users.stream()
                .filter(foundUser -> !foundUser.getId().equals(user.getId()))
                .map(foundUser -> {
                    Animal animal = animalService.findById(foundUser.getMainAnimal());
                    return new UserMainCharacterDto(foundUser.getId(), foundUser.getUsername(), foundUser.getLatitude(), foundUser.getLongitude(), foundUser.getMainAnimal(), animal.getAnimalImage());
                }).toList();
        Animal animal = animalService.findById(user.getMainAnimal());
        return new NearbyUsersDto(user.getLatitude(), user.getLongitude(), animal.getAnimalImage(), userMainCharacterDtos);
    }

    // 아이디로 유저 정보 조회하기
    @Transactional(readOnly = true)
    public User findById(Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    // 아이 입장에서 부모의 username 조회하기
    @Transactional(readOnly = true)
    public String findParentUsernameByChildUsername(String childUsername) {
        return userRepository.findParentUsernameByChildUsername(childUsername).orElseThrow(UserNotFoundException::new);
    }

    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    }

    @Transactional(readOnly = true)
    public User findCurrentUser() {
        return userRepository.findByUsername(SecurityUtil.getCurrentUsername()).orElseThrow(UserNotFoundException::new);
    }

    @Transactional
    public void saveUser(User user) {
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public OtherUserResponseDto getOtherUserInfo(Long userId) {
        User user = findById(userId);
        List<Collected> collected = collectedRepository.findByUser(user.getId());

        return OtherUserResponseDto.from(user, collected);
    }

    public ChildResponseDto getChildInfo() {
        User user = findCurrentUser();
        return ChildResponseDto.from(user);
    }

    private TokenResponse createToken(String username, Role role) {
        String access = jwtUtil.createJwt("access", username, Role.valueOf(role.toString()), 86400000L);
        String refresh = jwtUtil.createJwt("refresh", username, Role.valueOf(role.toString()), 86400000L);

        tokenService.addRefreshToken(username, refresh, 86400000L);
        return new TokenResponse(access, refresh);
    }
}