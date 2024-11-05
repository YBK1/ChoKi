package com.yeojiphap.choki.domain.mission.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.yeojiphap.choki.domain.mission.domain.Mission;
import com.yeojiphap.choki.domain.mission.domain.Status;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomMissionRepositoryImpl implements CustomMissionRepository{
	private final MongoTemplate mongoTemplate;

	@Override
	public Mission findById(ObjectId missionId) {
		Query query = new Query(Criteria.where("_id").is(missionId));
		return mongoTemplate.findOne(query, Mission.class);
	}

	@Override
	public Mission saveMission(Mission mission){
		return mongoTemplate.save(mission);
	}

	@Override
	public void deleteMission(ObjectId missionId){
		Query query = new Query(Criteria.where("_id").is(missionId));
		mongoTemplate.remove(query, Mission.class);
	}

	@Override
	public List<Mission> findAllByChildIdAndStatus(Long childId, Status status){
		// Criteria를 사용한 다중 조건 검색
		Criteria criteria = new Criteria();

		// AND 조건
		criteria.andOperator(
			Criteria.where("_id").is(childId),
			Criteria.where("status").is(status)
		);

		Query query = new Query(criteria);
		return mongoTemplate.find(query, Mission.class);
	}
}
