package com.yeojiphap.choki.domain.map.repository;

import com.yeojiphap.choki.domain.map.domain.GuidedRoute;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GuidedRouteRepository extends MongoRepository<GuidedRoute, Long> {
}
