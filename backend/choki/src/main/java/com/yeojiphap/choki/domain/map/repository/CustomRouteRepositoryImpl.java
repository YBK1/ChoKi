package com.yeojiphap.choki.domain.map.repository;

import com.yeojiphap.choki.domain.map.domain.Location;
import com.yeojiphap.choki.domain.map.domain.Route;
import com.yeojiphap.choki.domain.map.domain.RouteType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
public class CustomRouteRepositoryImpl implements CustomRouteRepository {
    private final MongoTemplate mongoTemplate;

    @Override
    public List<Location> findDistinctDestinations(String userId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(userId));
        query.fields().include("destination").exclude("_id"); // `destination` 필드만 포함

        List<Route> routes = mongoTemplate.find(query, Route.class);

        return routes.stream()
                .map(Route::getDestination) // 각 Route의 `destination` 추출
                .distinct() // 중복 제거
                .toList();
    }

    @Override
    public Optional<Route> findByUserIdAndDestinationAndRouteType(String username, Location destination, RouteType routeType) {
        Query query = new Query();
        query.addCriteria(Criteria.where("userId").is(username));
        query.addCriteria(Criteria.where("destination.latitude").is(destination.latitude()));
        query.addCriteria(Criteria.where("destination.longitude").is(destination.longitude()));
        query.addCriteria(Criteria.where("destination.buildingName").is(destination.buildingName()));
        query.addCriteria(Criteria.where("routeType").is(routeType));

        return Optional.ofNullable(mongoTemplate.findOne(query, Route.class));
    }
}
