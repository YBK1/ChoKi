package com.yeojiphap.choki.domain.map.dto.request;

import com.yeojiphap.choki.domain.map.domain.Location;
import com.yeojiphap.choki.domain.map.domain.RouteType;

public record RouteSearchRequest(Location destination, RouteType routeType) {
}
