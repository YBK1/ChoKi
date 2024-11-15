package com.yeojiphap.choki.domain.map.domain;

import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultWeightedEdge;
import org.jgrapht.graph.SimpleWeightedGraph;

public class GraphBuilder {

    private final Graph<Node, DefaultWeightedEdge> graph;

    public GraphBuilder() {
        this.graph = new SimpleWeightedGraph<>(DefaultWeightedEdge.class);
    }

    public void addNode(Node node) {
        graph.addVertex(node);
    }

    public void addEdge(Node source, Node target, double length, boolean hasCctv, boolean hasCrossing) {
        if(!source.equals(target)) {
            DefaultWeightedEdge edge = graph.addEdge(source, target);
            if (edge == null) {
                return;
            }

            double weight = calculateEdgeWeight(length, hasCctv, hasCrossing);
            graph.setEdgeWeight(edge, weight);
        }
    }

    private double calculateEdgeWeight(double length, boolean hasCctv, boolean hasCrossing) {
        double weight = length;
        if (hasCctv) weight *= 0.5;     // CCTV가 있으면 가중치를 낮춤
        if (hasCrossing) weight *= 2.0; // 횡단보도가 있으면 가중치를 높임
        return weight;
    }

    public Graph<Node, DefaultWeightedEdge> getGraph() {
        return graph;
    }
}
