package com.yeojiphap.choki.domain.family.dto;

import com.yeojiphap.choki.domain.user.domain.User;

public record ChildrenResponseDto(Long id, String userId, String nickname, int level, String address) {
    public static ChildrenResponseDto from (User user) {
        return new ChildrenResponseDto(user.getId(), user.getUserId(), user.getNickname(), user.getLevel(), user.getAddress());
    }
}

