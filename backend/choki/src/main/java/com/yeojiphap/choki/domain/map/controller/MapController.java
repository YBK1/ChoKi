package com.yeojiphap.choki.domain.map.controller;

import com.yeojiphap.choki.domain.map.dto.request.RouteRequest;
import com.yeojiphap.choki.domain.map.service.MapService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.GUIDED_ROUTES_SEARCH_SUCCESS;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MapController implements SpringDocMapController{
    private final MapService mapService;

    @PostMapping("/route")
    public ApiResponse saveGuidedRoute(@RequestBody RouteRequest request){
        return ApiResponse.success(HttpStatus.CREATED, mapService.saveGuidedRoute(request));
    }

    @GetMapping("/route/guide")
    public ApiResponse getGuidedRoute(){
        return ApiResponse.success(HttpStatus.OK, mapService.getGuidedRoutes(), GUIDED_ROUTES_SEARCH_SUCCESS.getMessage());
    }
}
