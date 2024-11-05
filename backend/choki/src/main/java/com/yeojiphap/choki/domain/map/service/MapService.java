package com.yeojiphap.choki.domain.map.service;

import com.yeojiphap.choki.domain.map.domain.GuidedRoute;
import com.yeojiphap.choki.domain.map.dto.request.RouteRequest;
import com.yeojiphap.choki.domain.map.repository.GuidedRouteRepository;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.*;

@Service
@RequiredArgsConstructor
public class MapService {

    private final GuidedRouteRepository guidedRouteRepository;

    public String saveGuidedRoute(RouteRequest request) {
        GuidedRoute guidedRoute = GuidedRoute.builder()
                .userId(SecurityUtil.getCurrentUserId())
                .startPoint(request.startPoint())
                .destination(request.destination())
                .routes(request.routes())
                .build();

        guidedRouteRepository.save(guidedRoute);
        return GUIDED_ROUTE_SAVE_SUCCESS.getMessage();
    }

}
