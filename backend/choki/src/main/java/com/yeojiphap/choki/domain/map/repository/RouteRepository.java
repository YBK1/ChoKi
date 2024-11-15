package com.yeojiphap.choki.domain.map.repository;

import com.yeojiphap.choki.domain.map.domain.Route;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RouteRepository extends MongoRepository<Route, ObjectId> {
    List<Route> findByUserId(String userId);
}
