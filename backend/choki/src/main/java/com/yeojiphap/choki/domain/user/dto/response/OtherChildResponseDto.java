package com.yeojiphap.choki.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class OtherChildResponseDto {
    private Long userId;
    private String nickname;
    private String address;
    private int level;
    private Long mainAnimal;
    private List<Long> animals;
}
