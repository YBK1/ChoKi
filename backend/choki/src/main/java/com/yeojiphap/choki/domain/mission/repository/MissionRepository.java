package com.yeojiphap.choki.domain.mission.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.yeojiphap.choki.domain.mission.domain.Mission;

@Repository
public interface MissionRepository extends MongoRepository<Mission, String>, CustomMissionRepository {
}
