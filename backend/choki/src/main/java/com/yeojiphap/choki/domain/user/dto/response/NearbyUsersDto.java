package com.yeojiphap.choki.domain.user.dto.response;

import java.util.List;

public record NearbyUsersDto(Double latitudeList, Double longitude, String animalImage, List <UserMainCharacterDto> users) {
}
