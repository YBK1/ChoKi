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
import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultWeightedEdge;
import org.jgrapht.nio.Attribute;
import org.jgrapht.nio.DefaultAttribute;
import org.jgrapht.nio.ExportException;
import org.jgrapht.nio.graphml.GraphMLExporter;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.*;
import java.util.stream.Collectors;

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

    public List<Location> findOptimalPath(double startLatitude, double startLongitude, double goalLatitude, double goalLongitude) {
        Node start = nodeRepository.findNearestNode(startLatitude, startLongitude);
        Node goal = nodeRepository.findNearestNode(goalLatitude, goalLongitude);

        System.out.println("start와 goal = " + start.getLatitude() + ", " + start.getLongitude() + ", " + goal.getLatitude() + ", " + goal.getLongitude());

        // 반경 설정 (예: 500m 반경)
        double radius = 500.0;

        // 출발지와 목적지 반경 내의 노드들 가져오기
        List<Node> nearbyNodes = nodeRepository.findNodesWithinRadius(startLatitude, startLongitude, radius);
        nearbyNodes.addAll(nodeRepository.findNodesWithinRadius(goalLatitude, goalLongitude, radius));

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

        Set<Node> graphNodes = graphBuilder.getGraph().vertexSet();

        // CSV 파일로 저장
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("nodes.csv"))) {
            // CSV 헤더 작성
            writer.write("Name,Latitude,Longitude");
            writer.newLine();

            for (Node node : graphNodes) {
                String line = node.getId() + "," + node.getLatitude() + "," + node.getLongitude();
                writer.write(line);
                writer.newLine(); // 줄바꿈
            }
            System.out.println("노드들의 정보가 CSV 파일에 저장되었습니다.");
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 시작점과 목표점도 nodeMap에서 가져오기
        Node mappedStart = nodeMap.get(start.getId());
        Node mappedGoal = nodeMap.get(goal.getId());

        if (mappedStart == null || mappedGoal == null) {
            throw new IllegalArgumentException("Start or goal node is not in the nodeMap.");
        }

        // 그래프 가져오기
        Graph<Node, DefaultWeightedEdge> graph = graphBuilder.getGraph();

        // GraphMLExporter 생성
        GraphMLExporter<Node, DefaultWeightedEdge> exporter = new GraphMLExporter<>();

        // 노드의 ID 제공자 설정 (람다 표현식 사용)
        exporter.setVertexIdProvider(node -> String.valueOf(node.getId()));

        // 노드의 속성 제공자 설정 (위도, 경도)
        exporter.setVertexAttributeProvider(node -> {
            Map<String, Attribute> map = new HashMap<>();
            map.put("latitude", DefaultAttribute.createAttribute(node.getLatitude()));
            map.put("longitude", DefaultAttribute.createAttribute(node.getLongitude()));
            return map;
        });

        // 엣지의 속성 제공자 설정 (가중치)
        exporter.setEdgeAttributeProvider(edge -> {
            Map<String, Attribute> map = new HashMap<>();
            double weight = graph.getEdgeWeight(edge);
            map.put("weight", DefaultAttribute.createAttribute(weight));
            return map;
        });

        // 그래프를 GraphML 파일로 내보내기
        try (Writer writer = new FileWriter("graph.graphml")) {
            exporter.exportGraph(graph, writer);
            System.out.println("그래프가 graph.graphml 파일로 내보내졌습니다.");
        } catch (ExportException | IOException e) {
            e.printStackTrace();
        }

        // A* 경로 탐색
        AStarPathFinder pathfinder = new AStarPathFinder(graphBuilder.getGraph());
        return pathfinder.findPath(mappedStart, mappedGoal);
    }


}
