package com.yeojiphap.choki.domain.map.service;

import com.yeojiphap.choki.domain.map.domain.*;
import com.yeojiphap.choki.domain.map.dto.request.RouteSearchRequest;
import com.yeojiphap.choki.domain.map.dto.request.RouteRegisterRequest;
import com.yeojiphap.choki.domain.map.dto.response.RouteDto;
import com.yeojiphap.choki.domain.map.dto.response.DestinationsDto;
import com.yeojiphap.choki.domain.map.exception.RouteNotFoundException;
import com.yeojiphap.choki.domain.map.repository.EdgeRepository;
import com.yeojiphap.choki.domain.map.repository.RouteRepository;
import com.yeojiphap.choki.domain.map.repository.NodeRepository;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.*;

@Service
@RequiredArgsConstructor
public class MapService {
    private final UserService userService;
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final RouteRepository routeRepository;

    public String saveRoutes(RouteRegisterRequest request) {
        User user = userService.findCurrentUser();
        Location userLocation = getUserLocation(user);
        saveRoute(user, userLocation, request.destination(), request.routes(), RouteType.GUIDED_PATH);
        saveSafeRoute(user, userLocation, request.destination());
        saveShortestRoute(user, userLocation, request.destination());
        return GUIDED_ROUTE_SAVE_SUCCESS.getMessage();
    }

    private void saveRoute(User user, Location userLocation, Location request, List<Location> routes, RouteType guidedPath) {
        Route route = Route.builder()
                .userId(user.getUsername())
                .startPoint(userLocation)
                .destination(request)
                .routes(routes)
                .routeType(guidedPath)
                .build();

        routeRepository.save(route);
    }

    public DestinationsDto getDestinations() {
        List<Location> destinations = routeRepository.findDistinctDestinations(SecurityUtil.getCurrentUsername());
        return new DestinationsDto(destinations);
    }

    public RouteDto getRoute(RouteSearchRequest request) {
        Route route = routeRepository.findByUserIdAndDestinationAndRouteType(SecurityUtil.getCurrentUsername(), request.destination(), request.routeType()).orElseThrow(RouteNotFoundException::new);
        return RouteDto.from(route);
    }

    private Location getUserLocation(User user) {
        return new Location(user.getAddress(), user.getLatitude(),user.getLongitude());
    }

    public void saveSafeRoute(User user, Location startPoint, Location destination) {
        Node start = findNearestNode(startPoint);
        Node goal = findNearestNode(destination);

        System.out.println("Start와 Goal: " + formatNodeInfo(start) + ", " + formatNodeInfo(goal));

        // 반경 설정 (예: 500m 반경)
        double radius = 500.0;
        Map<Long, Node> nodeMap = findNearbyNodesAsMap(startPoint, destination, radius);

        System.out.println("Nearby Nodes 개수: " + nodeMap.size());

        List<Edge> nearbyEdges = findEdgesForNodes(nodeMap);

        GraphBuilder graphBuilder = new GraphBuilder(new SafeWeightCalculator());

        nodeMap.values().forEach(graphBuilder::addNode);
        nearbyEdges.forEach(edge -> addEdgeToGraph(graphBuilder, edge));

        Node mappedStart = nodeMap.get(start.getId());
        Node mappedGoal = nodeMap.get(goal.getId());

        validateMappedNodes(mappedStart, mappedGoal);

        List<Location> path = findPath(graphBuilder, mappedStart, mappedGoal);
        saveRoute(user, startPoint, destination, path, RouteType.SAFE_PATH);
    }

    public void saveShortestRoute(User user, Location startPoint, Location destination) {
        Node start = findNearestNode(startPoint);
        Node goal = findNearestNode(destination);

        System.out.println("Start와 Goal: " + formatNodeInfo(start) + ", " + formatNodeInfo(goal));

        double radius = 500.0; // 반경 설정
        Map<Long, Node> nodeMap = findNearbyNodesAsMap(startPoint, destination, radius);

        System.out.println("Nearby Nodes 개수: " + nodeMap.size());

        List<Edge> nearbyEdges = findEdgesForNodes(nodeMap);

        GraphBuilder graphBuilder = new GraphBuilder(new ShortestWeightCalculator());

        nodeMap.values().forEach(graphBuilder::addNode);
        nearbyEdges.forEach(edge -> addEdgeToGraph(graphBuilder, edge));

        Node mappedStart = nodeMap.get(start.getId());
        Node mappedGoal = nodeMap.get(goal.getId());

        validateMappedNodes(mappedStart, mappedGoal);

        List<Location> path = findPath(graphBuilder, mappedStart, mappedGoal);
        saveRoute(user, startPoint, destination, path, RouteType.SHORTEST_PATH);
    }

    private Node findNearestNode(Location location) {
        return nodeRepository.findNearestNode(location.latitude(), location.longitude());
    }

    private String formatNodeInfo(Node node) {
        return node.getLatitude() + ", " + node.getLongitude();
    }

    private Map<Long, Node> findNearbyNodesAsMap(Location startPoint, Location destination, double radius) {
        List<Node> nearbyNodes = new ArrayList<>();
        nearbyNodes.addAll(nodeRepository.findNodesWithinRadius(startPoint.latitude(), startPoint.longitude(), radius));
        nearbyNodes.addAll(nodeRepository.findNodesWithinRadius(destination.latitude(), destination.longitude(), radius));
        return nearbyNodes.stream()
                .collect(Collectors.toMap(Node::getId, node -> node, (existing, replacement) -> existing));
    }

    private List<Edge> findEdgesForNodes(Map<Long, Node> nodeMap) {
        List<Long> nodeIds = new ArrayList<>(nodeMap.keySet());
        return edgeRepository.findEdgesBetweenNodes(nodeIds);
    }

    private void addEdgeToGraph(GraphBuilder graphBuilder, Edge edge) {
        Node startNode = edge.getStartNode();
        Node endNode = edge.getEndNode();

        if (startNode != null && endNode != null) {
            graphBuilder.addNode(startNode);
            graphBuilder.addNode(endNode);
            graphBuilder.addEdge(startNode, endNode, edge.getLength(), edge.getHasCctv(), edge.getHasCrossing());
        }
    }

    private void validateMappedNodes(Node mappedStart, Node mappedGoal) {
        if (mappedStart == null || mappedGoal == null) {
            throw new IllegalArgumentException("Start 또는 Goal 노드가 nodeMap에 존재하지 않습니다.");
        }
    }

    private List<Location> findPath(GraphBuilder graphBuilder, Node start, Node goal) {
        AStarPathFinder pathfinder = new AStarPathFinder(graphBuilder.getGraph());
        return pathfinder.findPath(start, goal);
    }

}
