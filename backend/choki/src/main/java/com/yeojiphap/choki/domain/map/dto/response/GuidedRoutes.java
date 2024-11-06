package com.yeojiphap.choki.domain.map.dto.response;

import com.yeojiphap.choki.domain.map.domain.Location;

import java.util.List;

public record GuidedRoutes(List<Location> routes) {
}
