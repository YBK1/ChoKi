package com.yeojiphap.choki.domain.map.service;

import com.yeojiphap.choki.domain.map.domain.*;
import com.yeojiphap.choki.domain.map.dto.request.GuidedRouteRequest;
import com.yeojiphap.choki.domain.map.dto.request.RouteRequest;
import com.yeojiphap.choki.domain.map.dto.response.DestinationDto;
import com.yeojiphap.choki.domain.map.dto.response.GuidedRouteDto;
import com.yeojiphap.choki.domain.map.dto.response.GuidedRouteListDto;
import com.yeojiphap.choki.domain.map.exception.GuidedRouteNotFoundException;
import com.yeojiphap.choki.domain.map.repository.EdgeRepository;
import com.yeojiphap.choki.domain.map.repository.GuidedRouteRepository;
import com.yeojiphap.choki.domain.map.repository.NodeRepository;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.*;

@Service
@RequiredArgsConstructor
public class MapService {
    private final UserService userService;
    private final NodeRepository nodeRepository;
    private final EdgeRepository edgeRepository;
    private final GuidedRouteRepository guidedRouteRepository;
    private static final int BATCH_SIZE = 10000;

    public String saveGuidedRoute(RouteRequest request) {
        User user = userService.findCurrentUser();
        GuidedRoute guidedRoute = GuidedRoute.builder()
                .userId(user.getUsername())
                .startPoint(getUserLocation(user))
                .destination(request.destination())
                .routes(request.routes())
                .build();

        guidedRouteRepository.save(guidedRoute);
        return GUIDED_ROUTE_SAVE_SUCCESS.getMessage();
    }

    public GuidedRouteListDto getGuidedRoutes() {
        List<GuidedRoute> guidedRoutes = guidedRouteRepository.findByUserId(SecurityUtil.getCurrentUsername());
        List<DestinationDto> routeList = guidedRoutes.stream()
                .map(route -> new DestinationDto(route.getDestination(), route.getId().toHexString()))
                .toList();
        return new GuidedRouteListDto(routeList);
    }

    public GuidedRouteDto getGuidedRoute(GuidedRouteRequest request) {
        GuidedRoute guidedRoute = guidedRouteRepository.findById(request.id()).orElseThrow(GuidedRouteNotFoundException::new);
        return GuidedRouteDto.from(guidedRoute);
    }

    private Location getUserLocation(User user) {
        return new Location(user.getAddress(), user.getLatitude(),user.getLongitude());
    }

    public List<Node> findOptimalPath(double startLatitude, double startLongitude, double goalLatitude, double goalLongitude) {
        Node start = nodeRepository.findNearestNode(startLatitude, startLongitude);
        Node goal = nodeRepository.findNearestNode(goalLatitude, goalLongitude);

        System.out.println("start와 goal = " + start.getLatitude() + ", " + start.getLongitude() + ", " + goal.getLatitude() + ", " + goal.getLongitude());

        // 반경 설정 (예: 1 km 반경)
        double radius = 500.0;

        // 출발지와 목적지 반경 내의 노드들 가져오기
        List<Node> nearbyNodes = nodeRepository.findNodesWithinRadius(startLatitude, startLongitude, radius);
        nearbyNodes.addAll(nodeRepository.findNodesWithinRadius(goalLatitude, goalLongitude, radius));

        System.out.println(nearbyNodes.size());

        // 해당 노드들 사이의 엣지들 가져오기
        List<Long> nodeIds = nearbyNodes.stream().map(Node::getId).distinct().toList();
        List<Edge> nearbyEdges = edgeRepository.findEdgesBetweenNodes(nodeIds);

        // 그래프 생성 및 엣지 추가
        GraphBuilder graphBuilder = new GraphBuilder();
        nearbyNodes.forEach(graphBuilder::addNode);
        nearbyEdges.forEach(edge ->
                graphBuilder.addEdge(edge.getStartNode(), edge.getEndNode(), edge.getLength(), edge.getHasCctv(), edge.getHasCrossing())
        );

        // A* 경로 탐색
        AStarPathFinder pathfinder = new AStarPathFinder(graphBuilder.getGraph());
        return pathfinder.findPath(start, goal);
    }

}
