package com.yeojiphap.choki.domain.user.service;

import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.collected.repository.CollectedRepository;
import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.dto.response.ChildProfileDto;
import com.yeojiphap.choki.domain.user.exception.InvalidUserRoleException;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.domain.user.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JWTService {
    private final JWTUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final CollectedRepository collectedRepository;

    // Token으로 유저의 정보를 가져오는 로직
    public ChildProfileDto getUserByToken(String token) {
        User user = findByUserId(jwtUtil.getIdFromToken(token.split(" ")[1]));

        if (user.getRole() == Role.CHILD) {
            List<Long> animalIds = collectedRepository.findAllByUserId(user.getId())
                    .stream()
                    .map(collected -> collected.getAnimal().getId())
                    .toList();

            return ChildProfileDto.builder()
                    .userId(user.getId())
                    .nickname(user.getNickname())
                    .address(user.getAddress())
                    .name(user.getName())
                    .tel(user.getTel())
                    .role(user.getRole())
                    .inviteCode(user.getFamily().getInviteCode())
                    .familyId(user.getFamily().getId())
                    .level(user.getLevel())
                    .exp(user.getExp())
                    .pastLevel(user.getPastLevel())
                    .mainAnimal(user.getMainAnimal())
                    .animals(animalIds)
                    .build();
        } else {
            throw new InvalidUserRoleException();
        }
    }

    private User findByUserId(Long userId) {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }
}
