package com.yeojiphap.choki.domain.map.dto.response;

import com.yeojiphap.choki.domain.map.domain.Route;
import com.yeojiphap.choki.domain.map.domain.Location;

import java.util.List;

public record RouteDto(Location startPoint, Location destination, List<Location> routes) {
    public static RouteDto from(Route route) {
        return new RouteDto(route.getStartPoint(), route.getDestination(), route.getRoutes());
    }
}
