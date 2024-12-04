package com.yeojiphap.choki.domain.map.domain;

import lombok.Builder;
import lombok.Getter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Getter
public class Route {
    @Id
    private ObjectId id;
    private String userId;
    private Location startPoint;
    private Location destination;
    private List<Location> routes;
    private RouteType routeType;

    @Builder
    public Route(String userId, Location startPoint, Location destination, List<Location> routes, RouteType routeType) {
        this.userId = userId;
        this.startPoint = startPoint;
        this.destination = destination;
        this.routes = routes;
        this.routeType = routeType;
    }
}
