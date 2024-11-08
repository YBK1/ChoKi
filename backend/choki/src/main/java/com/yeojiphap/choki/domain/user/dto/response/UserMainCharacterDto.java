package com.yeojiphap.choki.domain.user.dto.response;

public record UserMainCharacterDto(Long userId, String username, Double latitude, Double longitude, Long animalId, String animalImage) {
}
