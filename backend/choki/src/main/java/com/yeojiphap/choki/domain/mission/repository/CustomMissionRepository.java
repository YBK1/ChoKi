package com.yeojiphap.choki.domain.mission.repository;

import java.util.List;

import org.bson.types.ObjectId;

import com.yeojiphap.choki.domain.mission.domain.Mission;
import com.yeojiphap.choki.domain.mission.domain.Status;

public interface CustomMissionRepository {
	Mission findById(ObjectId missionId);

	Mission saveMission(Mission mission);

	void deleteMission(ObjectId missionId);

	List<Mission> findAllByChildIdAndStatus(Long childId, Status status);
}
