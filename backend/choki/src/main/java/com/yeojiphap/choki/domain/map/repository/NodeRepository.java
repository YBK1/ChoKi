package com.yeojiphap.choki.domain.map.repository;

import com.yeojiphap.choki.domain.map.domain.Node;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NodeRepository extends JpaRepository<Node, Long> {
    @Query(value = "SELECT * FROM node ORDER BY ST_Distance(geometry, ST_SetSRID(ST_Point(:longitude, :latitude), 4326)) LIMIT 1", nativeQuery = true)
    Node findNearestNode(@Param("latitude") double latitude, @Param("longitude") double longitude);

    @Query(value = "SELECT * FROM node WHERE ST_DWithin(ST_Transform(geometry, 3857), ST_Transform(ST_SetSRID(ST_Point(:longitude, :latitude), 4326), 3857), :radius)", nativeQuery = true)
    List<Node> findNodesWithinRadius(@Param("latitude") double latitude, @Param("longitude") double longitude, @Param("radius") double radius);
}
