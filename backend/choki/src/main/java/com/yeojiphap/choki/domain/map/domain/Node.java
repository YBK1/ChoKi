package com.yeojiphap.choki.domain.map.domain;

import jakarta.persistence.*;
import lombok.Getter;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Point;

import java.util.Objects;

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
    private Geometry geom;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Node node = (Node) o;
        return Objects.equals(id, node.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
