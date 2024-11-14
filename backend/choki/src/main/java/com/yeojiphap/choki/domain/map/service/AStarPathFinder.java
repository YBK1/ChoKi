package com.yeojiphap.choki.domain.map.service;

import com.yeojiphap.choki.domain.map.domain.Location;
import com.yeojiphap.choki.domain.map.domain.Node;
import org.jgrapht.Graph;
import org.jgrapht.alg.interfaces.AStarAdmissibleHeuristic;
import org.jgrapht.alg.shortestpath.AStarShortestPath;
import org.jgrapht.graph.DefaultWeightedEdge;

import java.util.ArrayList;
import java.util.List;

public class AStarPathFinder {
    private final Graph<Node, DefaultWeightedEdge> graph;

    public AStarPathFinder(Graph<Node, DefaultWeightedEdge> graph) {
        this.graph = graph;
    }

    public List<Location> findPath(Node start, Node goal) {
        AStarAdmissibleHeuristic<Node> heuristic = (current, target) -> calculateHeuristic(current, target);
        AStarShortestPath<Node, DefaultWeightedEdge> aStar = new AStarShortestPath<>(graph, heuristic);
        List<Node> pathNodes = aStar.getPath(start, goal).getVertexList();

        List<Location> path = new ArrayList<>();
        for (Node node : pathNodes) {
            path.add(new Location("", node.getLatitude(), node.getLongitude()));
        }

        return path;
    }

    private double calculateHeuristic(Node current, Node target) {
        double dx = current.getLongitude() - target.getLongitude();
        double dy = current.getLatitude() - target.getLatitude();
        return Math.sqrt(dx * dx + dy * dy);
    }
}