package com.yeojiphap.choki.domain.user.dto.response;

import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;

public record UserRoleDto(Role role) {
    public static UserRoleDto from(User user) {
        return new UserRoleDto(user.getRole());
    }
}
