package com.yeojiphap.choki.domain.map.service;

import com.yeojiphap.choki.domain.map.domain.Node;
import org.jgrapht.Graph;
import org.jgrapht.alg.interfaces.AStarAdmissibleHeuristic;
import org.jgrapht.alg.shortestpath.AStarShortestPath;
import org.jgrapht.graph.DefaultWeightedEdge;

import java.util.List;

public class AStarPathFinder {
    private final Graph<Node, DefaultWeightedEdge> graph;

    public AStarPathFinder(Graph<Node, DefaultWeightedEdge> graph) {
        this.graph = graph;
    }

    public List<Node> findPath(Node start, Node goal) {
        System.out.println("start lattitude = " + start.getLatitude());
        System.out.println("start longitude = " + start.getLongitude());

        System.out.println("end lattitude = " + goal.getLatitude());
        System.out.println("end longitude = " + goal.getLongitude());

        AStarAdmissibleHeuristic<Node> heuristic = (current, target) -> calculateHeuristic(current, target);
        AStarShortestPath<Node, DefaultWeightedEdge> aStar = new AStarShortestPath<>(graph, heuristic);
        return aStar.getPath(start, goal).getVertexList();
    }

    private double calculateHeuristic(Node current, Node target) {
        double dx = current.getLongitude() - target.getLongitude();
        double dy = current.getLatitude() - target.getLatitude();
        return Math.sqrt(dx * dx + dy * dy);
    }
}