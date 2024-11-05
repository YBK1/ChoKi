package com.yeojiphap.choki.domain.map.dto.request;

import com.yeojiphap.choki.domain.map.domain.Location;

import java.util.List;

public record RouteRequest(Location destination, List<Location>routes) {
}
