package com.yeojiphap.choki.domain.map.domain;

import lombok.Builder;
import lombok.Getter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Getter
public class GuidedRoute {
    @Id
    private ObjectId id;
    private String userId;
    private Location startPoint;
    private Location destination;
    private List<Location> routes;

    @Builder
    public GuidedRoute(String userId, Location startPoint, Location destination, List<Location> routes) {
        this.userId = userId;
        this.startPoint = startPoint;
        this.destination = destination;
        this.routes = routes;
    }
}
