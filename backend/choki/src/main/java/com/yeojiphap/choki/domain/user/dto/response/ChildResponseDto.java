package com.yeojiphap.choki.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChildResponseDto {
    private Long userId;
    private String nickname;
    private String address;
    private int level;
    private Long mainAnimal;
}
