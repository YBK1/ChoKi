package com.yeojiphap.choki.domain.map.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
@Getter
public class Route {
    @Id
    private String id;
    private Location startPoint;
    private Location destination;
    private List<Location> routes;
}
