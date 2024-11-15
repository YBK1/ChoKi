package com.yeojiphap.choki.domain.map.controller;

import com.yeojiphap.choki.domain.map.domain.Location;
import com.yeojiphap.choki.domain.map.dto.request.GuidedRouteRequest;
import com.yeojiphap.choki.domain.map.dto.request.RouteRequest;
import com.yeojiphap.choki.domain.map.service.MapService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.GUIDED_ROUTES_SEARCH_SUCCESS;
import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.GUIDED_ROUTE_SEARCH_SUCCESS;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MapController implements SpringDocMapController{
    private final MapService mapService;

    @PostMapping("/route")
    public ApiResponse saveGuidedRoute(@RequestBody RouteRequest request){
        return ApiResponse.success(HttpStatus.CREATED, mapService.saveGuidedRoute(request));
    }

    @GetMapping("/route/guide/list")
    public ApiResponse getGuidedRoutes(){
        return ApiResponse.success(HttpStatus.OK, mapService.getGuidedRoutes(), GUIDED_ROUTES_SEARCH_SUCCESS.getMessage());
    }

    @GetMapping("/route/guide/{guidedRouteId}")
    public ApiResponse getGuidedRoute(@PathVariable ObjectId guidedRouteId) {
        return ApiResponse.success(HttpStatus.OK, mapService.getGuidedRoute(new GuidedRouteRequest(guidedRouteId)),
                GUIDED_ROUTE_SEARCH_SUCCESS.getMessage());
    }

    @GetMapping("/route/safe")
    public List<Location> findPath(@RequestParam double startLatitude,
                                   @RequestParam double startLongitude,
                                   @RequestParam double goalLatitude,
                                   @RequestParam double goalLongitude) {
        return mapService.findOptimalPath(startLatitude, startLongitude, goalLatitude, goalLongitude);
    }
}
