package com.yeojiphap.choki.domain.user.dto;

import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;

public record UserDto(String userId, String password, Role role) {
    public static UserDto from(User user) {
        return new UserDto(user.getUserId(), user.getUserPassword() ,user.getRole());
    }
}
