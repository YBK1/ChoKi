package com.yeojiphap.choki.domain.map.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import org.locationtech.jts.geom.Geometry;

@Entity
@Getter
public class Node {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double latitude;
    private Double longitude;
    private Geometry geometry;
    private Boolean hasCctv;
    private Boolean hasCrossing;
}
