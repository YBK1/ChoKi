package com.yeojiphap.choki.domain.map.repository;

import com.yeojiphap.choki.domain.map.domain.GuidedRoute;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GuidedRouteRepository extends MongoRepository<GuidedRoute, ObjectId> {
    List<GuidedRoute> findByUserId(String userId);
}
