package com.yeojiphap.choki.domain.family.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChildDetailDto {
    private Long childId;
    private String name;
    private String nickname;
    private int level;
    private String address;
}
