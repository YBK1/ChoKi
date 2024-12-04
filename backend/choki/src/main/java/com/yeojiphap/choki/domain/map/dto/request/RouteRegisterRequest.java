package com.yeojiphap.choki.domain.map.dto.request;

import com.yeojiphap.choki.domain.map.domain.Location;

import java.util.List;

public record RouteRegisterRequest(Location destination, List<Location>routes) {
}
