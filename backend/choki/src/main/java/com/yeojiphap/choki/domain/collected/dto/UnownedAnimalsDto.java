package com.yeojiphap.choki.domain.collected.dto;

import java.util.List;

public record UnownedAnimalsDto(List<Long> unownedUnique, List<Long> unownedRare, List<Long> unownedCommon) {
}
