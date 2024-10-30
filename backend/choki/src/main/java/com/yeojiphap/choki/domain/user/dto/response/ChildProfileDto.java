package com.yeojiphap.choki.domain.user.dto.response;

import com.yeojiphap.choki.domain.user.domain.Role;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ChildProfileDto {
    private Long userId;
    private String nickname;
    private String address;
    private String name;
    private String tel;
    private Role role;
    private String inviteCode;
    private Long familyId;
    private int level;
    private int exp;
    private int pastLevel;
    private Long mainAnimal;
    private List<Long> animals;
}