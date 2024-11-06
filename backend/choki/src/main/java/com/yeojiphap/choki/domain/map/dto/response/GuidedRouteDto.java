package com.yeojiphap.choki.domain.map.dto.response;

import com.yeojiphap.choki.domain.map.domain.GuidedRoute;
import com.yeojiphap.choki.domain.map.domain.Location;

import java.util.List;

public record GuidedRouteDto(Location startPoint, Location destination, List<Location> routes) {
    public static GuidedRouteDto from(GuidedRoute guidedRoute) {
        return new GuidedRouteDto(guidedRoute.getStartPoint(), guidedRoute.getDestination(), guidedRoute.getRoutes());
    }
}
