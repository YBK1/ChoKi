package com.yeojiphap.choki.domain.map.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class Location {
    private String buildingName;
    private Double latitude;
    private Double longitude;
}
