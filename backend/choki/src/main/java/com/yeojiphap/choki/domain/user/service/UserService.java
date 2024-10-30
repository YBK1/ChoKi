package com.yeojiphap.choki.domain.user.service;

import com.yeojiphap.choki.domain.collected.repository.CollectedRepository;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.dto.response.OtherChildResponseDto;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CollectedRepository collectedRepository;

    // 다른 유저의 정보를 가져오는 로직
    public OtherChildResponseDto getOtherChildInfo(Long userId) {
        User user = findByUserId(userId);

        List<Long> animalIds = collectedRepository.findAllByUserId(user.getId())
                .stream()
                .map(collected -> collected.getAnimal().getId())
                .toList();

        return OtherChildResponseDto.builder()
                .userId(user.getId())
                .nickname(user.getNickname())
                .address(user.getAddress())
                .level(user.getLevel())
                .mainAnimal(user.getMainAnimal())
                .animals(animalIds)
                .build();
    }

    private User findByUserId(Long userId) {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }
}
