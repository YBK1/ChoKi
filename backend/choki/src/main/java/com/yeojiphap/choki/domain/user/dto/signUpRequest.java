package com.yeojiphap.choki.domain.user.dto;

import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record signUpRequest(
        @NotBlank(message = "User ID는 필수 입력 항목입니다.")
        String userId,

        @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
        String userPassword,

        @NotBlank(message = "닉네임은 필수 입력 항목입니다.")
        String nickname,

        @NotBlank(message = "주소가 입력되지 않았습니다.")
        String address,
        Double latitude,
        Double longitude,

        @NotBlank(message = "이름은 필수 입력 항목입니다.")
        String name,

        @NotBlank(message = "전화번호가 입력되지 않았습니다.")
        String tel,

        @NotNull(message = "역할은 필수 입력 항목입니다.")
        Role role
) {
    public User toEntity(String encodedPassword) {
        return User.builder()
                .userId(userId)
                .userPassword(encodedPassword)
                .nickname(nickname)
                .address(address)
                .latitude(latitude)
                .longitude(longitude)
                .name(name)
                .tel(tel)
                .role(role)
                .build();
    }
}
