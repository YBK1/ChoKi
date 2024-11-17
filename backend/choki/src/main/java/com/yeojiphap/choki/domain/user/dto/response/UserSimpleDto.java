package com.yeojiphap.choki.domain.user.dto.response;

import com.yeojiphap.choki.domain.user.domain.User;

public record UserSimpleDto(Long userId, String username) {
    public static UserSimpleDto from(User user) {
        return new UserSimpleDto(user.getId(), user.getUsername());
    }
}
