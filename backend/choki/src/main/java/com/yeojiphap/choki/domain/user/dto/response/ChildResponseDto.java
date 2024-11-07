package com.yeojiphap.choki.domain.user.dto.response;

import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;

public record ChildResponseDto(Long id, String nickname, String address, String name, String tel, Role role, int level, int exp, int pastLevel, Long mainAnimalId) {
    public static ChildResponseDto from (User user) {
        return new ChildResponseDto(user.getId(), user.getNickname(), user.getAddress(), user.getName(), user.getTel(), user.getRole(), user.getLevel(), user.getExp(), user.getPastLevel(), user.getMainAnimal());
    }
}