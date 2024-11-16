package com.yeojiphap.choki.domain.map.service;

import com.yeojiphap.choki.domain.map.domain.Node;
import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultWeightedEdge;
import org.jgrapht.graph.SimpleWeightedGraph;

public class GraphBuilder {
    private final Graph<Node, DefaultWeightedEdge> graph;
    private final WeightCalculator weightCalculator;

    public GraphBuilder(WeightCalculator weightCalculator) {
        this.graph = new SimpleWeightedGraph<>(DefaultWeightedEdge.class);
        this.weightCalculator = weightCalculator;
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

            double weight = weightCalculator.calculate(length, hasCctv, hasCrossing);
            graph.setEdgeWeight(edge, weight);
        }
    }

    public Graph<Node, DefaultWeightedEdge> getGraph() {
        return graph;
    }
}
