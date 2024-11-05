package com.yeojiphap.choki.domain.user.dto;

import com.yeojiphap.choki.domain.user.domain.User;

public record ChildResponseDto(Long id, String userId, String nickname, int level, String address) {
    public static ChildResponseDto from (User user) {
        return new ChildResponseDto(user.getId(), user.getUserId(), user.getNickname(), user.getLevel(), user.getAddress());
    }
}
