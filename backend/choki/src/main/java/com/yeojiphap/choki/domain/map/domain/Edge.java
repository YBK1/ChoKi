package com.yeojiphap.choki.domain.map.domain;

import jakarta.persistence.*;
import lombok.Getter;
import org.locationtech.jts.geom.Geometry;

@Entity
@Getter
public class Edge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "start_node_id")
    private Node startNode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "end_node_id")
    private Node endNode;

    private Double length;
    private Boolean hasCctv;
    private Boolean hasCrossing;
    private Geometry geometry;
}
