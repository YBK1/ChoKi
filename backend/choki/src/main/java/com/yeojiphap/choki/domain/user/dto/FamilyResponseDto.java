package com.yeojiphap.choki.domain.user.dto;

import com.yeojiphap.choki.domain.user.domain.Family;

import java.util.List;

public record FamilyResponseDto(Long id, List<ChildResponseDto> children) {
    public static FamilyResponseDto from (Family family) {
        List<ChildResponseDto> dto = family.getUsers().stream()
                .map(ChildResponseDto::from)
                .toList();

        return new FamilyResponseDto(family.getId(), dto);
    }
}
