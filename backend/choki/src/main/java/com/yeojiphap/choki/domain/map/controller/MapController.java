package com.yeojiphap.choki.domain.map.controller;

import com.yeojiphap.choki.domain.map.domain.Location;
import com.yeojiphap.choki.domain.map.domain.RouteType;
import com.yeojiphap.choki.domain.map.dto.request.RouteSearchRequest;
import com.yeojiphap.choki.domain.map.dto.request.RouteRegisterRequest;
import com.yeojiphap.choki.domain.map.service.MapService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.ROUTES_SEARCH_SUCCESS;
import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.ROUTE_SEARCH_SUCCESS;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MapController implements SpringDocMapController{
    private final MapService mapService;

    @PostMapping("/route")
    public ApiResponse saveGuidedRoute(@RequestBody RouteRegisterRequest request){
        return ApiResponse.success(HttpStatus.CREATED, mapService.saveRoutes(request));
    }

    @GetMapping("/route/list")
    public ApiResponse getRoutes(){
        return ApiResponse.success(HttpStatus.OK, mapService.getDestinations(), ROUTES_SEARCH_SUCCESS.getMessage());
    }

    @GetMapping("/route/guide")
    public ApiResponse getGuidedRoute(@ModelAttribute Location destination) {
        return ApiResponse.success(HttpStatus.OK, mapService.getRoute(new RouteSearchRequest(destination, RouteType.GUIDED_PATH)),
                ROUTE_SEARCH_SUCCESS.getMessage());
    }

    @GetMapping("/route/safe")
    public ApiResponse getSafeRoute(@ModelAttribute Location destination) {
        System.out.println(destination);
        return ApiResponse.success(HttpStatus.OK, mapService.getRoute(new RouteSearchRequest(destination, RouteType.SAFE_PATH)),
                ROUTE_SEARCH_SUCCESS.getMessage());
    }

    @GetMapping("/route/shortest")
    public ApiResponse getShortestRoute(@ModelAttribute Location destination) {
        return ApiResponse.success(HttpStatus.OK, mapService.getRoute(new RouteSearchRequest(destination, RouteType.SHORTEST_PATH)),
                ROUTE_SEARCH_SUCCESS.getMessage());
    }
}
