package com.yeojiphap.choki.domain.map.service;

import com.yeojiphap.choki.domain.map.domain.GuidedRoute;
import com.yeojiphap.choki.domain.map.domain.Location;
import com.yeojiphap.choki.domain.map.dto.request.GuidedRouteRequest;
import com.yeojiphap.choki.domain.map.dto.request.RouteRequest;
import com.yeojiphap.choki.domain.map.dto.response.DestinationDto;
import com.yeojiphap.choki.domain.map.dto.response.GuidedRouteDto;
import com.yeojiphap.choki.domain.map.dto.response.GuidedRouteListDto;
import com.yeojiphap.choki.domain.map.exception.GuidedRouteNotFoundException;
import com.yeojiphap.choki.domain.map.repository.GuidedRouteRepository;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.yeojiphap.choki.domain.map.message.MapSuccessMessage.*;

@Service
@RequiredArgsConstructor
public class MapService {
    private final UserRepository userRepository;
    private final GuidedRouteRepository guidedRouteRepository;

    public String saveGuidedRoute(RouteRequest request) {
        User user = findCurrentUser();
        GuidedRoute guidedRoute = GuidedRoute.builder()
                .userId(user.getUserId())
                .startPoint(getUserLocation(user))
                .destination(request.destination())
                .routes(request.routes())
                .build();

        guidedRouteRepository.save(guidedRoute);
        return GUIDED_ROUTE_SAVE_SUCCESS.getMessage();
    }

    public GuidedRouteListDto getGuidedRoutes() {
        List<GuidedRoute> guidedRoutes = guidedRouteRepository.findByUserId(SecurityUtil.getCurrentUserId());
        List<DestinationDto> routeList = guidedRoutes.stream()
                .map(route -> new DestinationDto(route.getDestination(), route.getId().toHexString()))
                .toList();
        return new GuidedRouteListDto(routeList);
    }

    public GuidedRouteDto getGuidedRoute(GuidedRouteRequest request) {
        GuidedRoute guidedRoute = guidedRouteRepository.findById(request.id()).orElseThrow(GuidedRouteNotFoundException::new);
        return GuidedRouteDto.from(guidedRoute);
    }

    private User findCurrentUser() {
        return userRepository.findByUserId(SecurityUtil.getCurrentUserId()).orElseThrow(UserNotFoundException::new);
    }

    private Location getUserLocation(User user) {
        return new Location(user.getAddress(), user.getLatitude(),user.getLongitude());
    }

}
