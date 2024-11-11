package com.yeojiphap.choki.domain.family.dto;

import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;

public record ChildDetailResponseDto (Long id, String username, String nickname, String address, String name, String tel, Role role, int level, int exp, int pastLevel, Long mainAnimalId) {
    public static ChildDetailResponseDto from (User user) {
        return new ChildDetailResponseDto(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getAddress(),
                user.getName(),
                user.getTel(),
                user.getRole(),
                user.getLevel(),
                user.getExp(),
                user.getPastLevel(),
                user.getMainAnimal()
        );
    }
}
