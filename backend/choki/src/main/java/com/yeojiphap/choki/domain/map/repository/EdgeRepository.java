package com.yeojiphap.choki.domain.map.repository;

import com.yeojiphap.choki.domain.map.domain.Edge;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EdgeRepository extends JpaRepository<Edge, Long> {
    @EntityGraph(attributePaths = {"startNode", "endNode"})
    @Query("SELECT DISTINCT e FROM Edge e WHERE e.startNode.id IN :nodeIds OR e.endNode.id IN :nodeIds")
    List<Edge> findEdgesBetweenNodes(@Param("nodeIds") List<Long> nodeIds);
}
