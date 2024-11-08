package com.yeojiphap.choki.domain.family.dto;

import java.util.List;

public record ParentWithChildrenResponseDto(String username, List<ChildrenResponseDto> children) {
    public static ParentWithChildrenResponseDto from(String username, List<ChildrenResponseDto> children) {
        return new ParentWithChildrenResponseDto(username, children);
    }
}
