package com.yeojiphap.choki.domain.map.repository;

import com.yeojiphap.choki.domain.map.domain.Location;
import com.yeojiphap.choki.domain.map.domain.Route;
import com.yeojiphap.choki.domain.map.domain.RouteType;

import java.util.List;
import java.util.Optional;

public interface CustomRouteRepository {
    List<Location> findDistinctDestinations(String userId);
    Optional<Route> findByUserIdAndDestinationAndRouteType(String username, Location destination, RouteType routeType);
}
