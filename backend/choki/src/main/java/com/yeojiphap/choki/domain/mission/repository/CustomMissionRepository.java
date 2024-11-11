package com.yeojiphap.choki.domain.mission.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;

import com.yeojiphap.choki.domain.mission.domain.Mission;
import com.yeojiphap.choki.domain.mission.domain.Status;

public interface CustomMissionRepository {
	Optional<Mission> findById(ObjectId missionId);

	Mission saveMission(Mission mission);

	void deleteMission(ObjectId missionId);

	void updateShoppingId(ObjectId missionId, ObjectId shoppingId);

	List<Mission> findAllByChildIdAndStatus(Long childId, Status status);

	Optional<Mission> setMissionStatusPending(ObjectId missionId);
}
