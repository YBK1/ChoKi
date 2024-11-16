package com.yeojiphap.choki.domain.user.dto.response;

import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;

import java.util.List;

public record UserResponseDto (Long userId, String nickname, String address, String name, String tel, Role role, String inviteCode, Long familyId, int level, int exp, boolean isLevelUp, Long mainAnimalId, List<Long> animals, Long drawAnimalId) {

    public static UserResponseDto from(User user, List<Collected> animalList, UserLevelDto levelInfo) {
        return new UserResponseDto(
                user.getId(),
                user.getNickname(),
                user.getAddress(),
                user.getName(),
                user.getTel(),
                user.getRole(),
                user.getFamily().getInviteCode(),
                user.getFamily().getId(),
                levelInfo.level(),
                levelInfo.exp(),
                levelInfo.isLevelUp(),
                user.getMainAnimal(),
                animalList.stream()
                        .map(collected -> collected.getAnimal().getId())
                        .toList(),
                levelInfo.drawAnimalId()
        );
    }
}
