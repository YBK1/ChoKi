package com.yeojiphap.choki.domain.map.service;

import com.yeojiphap.choki.domain.map.domain.*;
import com.yeojiphap.choki.domain.map.dto.request.GuidedRouteRequest;
import com.yeojiphap.choki.domain.map.dto.request.RouteRequest;
import com.yeojiphap.choki.domain.map.dto.response.DestinationDto;
import com.yeojiphap.choki.domain.map.dto.response.RouteDto;
import com.yeojiphap.choki.domain.map.dto.response.GuidedRouteListDto;
import com.yeojiphap.choki.domain.map.exception.GuidedRouteNotFoundException;
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

    public String saveRoutes(RouteRequest request) {
        User user = userService.findCurrentUser();
        saveRoute(user, request.destination(), request.routes(), RouteType.GUIDED_PATH);
        saveSafeRoute(user, getUserLocation(user), request.destination());
        return GUIDED_ROUTE_SAVE_SUCCESS.getMessage();
    }

    private void saveRoute(User user, Location request, List<Location> routes, RouteType guidedPath) {
        Route route = Route.builder()
                .userId(user.getUsername())
                .startPoint(getUserLocation(user))
                .destination(request)
                .routes(routes)
                .routeType(guidedPath)
                .build();

        routeRepository.save(route);
    }

    public GuidedRouteListDto getGuidedRoutes() {
        List<Route> routes = routeRepository.findByUserId(SecurityUtil.getCurrentUsername());
        List<DestinationDto> routeList = routes.stream()
                .map(route -> new DestinationDto(route.getDestination(), route.getId().toHexString()))
                .toList();
        return new GuidedRouteListDto(routeList);
    }

    public RouteDto getGuidedRoute(GuidedRouteRequest request) {
        Route route = routeRepository.findById(request.id()).orElseThrow(GuidedRouteNotFoundException::new);
        return RouteDto.from(route);
    }

    private Location getUserLocation(User user) {
        return new Location(user.getAddress(), user.getLatitude(),user.getLongitude());
    }

    public void saveSafeRoute(User user, Location startPoint, Location destination) {
        Node start = nodeRepository.findNearestNode(startPoint.latitude(), startPoint.longitude());
        Node goal = nodeRepository.findNearestNode(destination.latitude(), destination.longitude());

        System.out.println("start와 goal = " + start.getLatitude() + ", " + start.getLongitude() + ", " + goal.getLatitude() + ", " + goal.getLongitude());

        // 반경 설정 (예: 500m 반경)
        double radius = 500.0;

        // 출발지와 목적지 반경 내의 노드들 가져오기
        List<Node> nearbyNodes = nodeRepository.findNodesWithinRadius(startPoint.latitude(), startPoint.longitude(), radius);
        nearbyNodes.addAll(nodeRepository.findNodesWithinRadius(destination.latitude(), destination.longitude(), radius));

        System.out.println("nearbyNodes 개수: " + nearbyNodes.size());

        // Node ID를 키로 하는 Map 생성
        Map<Long, Node> nodeMap = nearbyNodes.stream()
                .collect(Collectors.toMap(Node::getId, node -> node, (existing, replacement) -> existing));

        // 해당 노드들 사이의 엣지들 가져오기
        List<Long> nodeIds = new ArrayList<>(nodeMap.keySet());
        List<Edge> nearbyEdges = edgeRepository.findEdgesBetweenNodes(nodeIds);

        // 그래프 생성 및 노드 추가
        GraphBuilder graphBuilder = new GraphBuilder();
        nearbyNodes.forEach(graphBuilder::addNode);

        // Edge 추가 시 노드 매핑
        nearbyEdges.forEach(edge -> {
            Node startNode = edge.getStartNode();
            Node endNode = edge.getEndNode();

            if (startNode != null && endNode != null) {
                graphBuilder.addNode(startNode);
                graphBuilder.addNode(endNode);

                graphBuilder.addEdge(startNode, endNode, edge.getLength(), edge.getHasCctv(), edge.getHasCrossing());
            } else {
//                System.out.println("Edge references nodes not in nodeMap: Edge ID = " + edge.getId());
            }
        });

        Node mappedStart = nodeMap.get(start.getId());
        Node mappedGoal = nodeMap.get(goal.getId());

        if (mappedStart == null || mappedGoal == null) {
            throw new IllegalArgumentException("Start or goal node is not in the nodeMap.");
        }

        // A* 경로 탐색
        AStarPathFinder pathfinder = new AStarPathFinder(graphBuilder.getGraph());
        List<Location> path = pathfinder.findPath(mappedStart, mappedGoal);
        saveRoute(user, destination, path, RouteType.SAFE_PATH);
    }
}
