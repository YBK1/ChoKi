package com.yeojiphap.choki.domain.mission.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.yeojiphap.choki.domain.mission.domain.Mission;
import com.yeojiphap.choki.domain.mission.domain.Status;

public interface MissionRepository extends MongoRepository<Mission, String> {
	List<Mission> findAllByChildIdAndStatus(Long childId, Status status);
}
