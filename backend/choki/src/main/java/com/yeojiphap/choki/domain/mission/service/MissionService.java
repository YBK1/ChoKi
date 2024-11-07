package com.yeojiphap.choki.domain.mission.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.yeojiphap.choki.domain.mission.domain.Mission;
import com.yeojiphap.choki.domain.mission.domain.MissionType;
import com.yeojiphap.choki.domain.mission.domain.Status;
import com.yeojiphap.choki.domain.mission.dto.MissionResponseDto;
import com.yeojiphap.choki.domain.mission.exception.MissionNotFoundException;
import com.yeojiphap.choki.domain.mission.repository.MissionRepository;
import com.yeojiphap.choki.domain.shopping.dto.ShoppingCreateRequestDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MissionService {
	private final MissionRepository missionRepository;

	// 미션 조회하기
	public Mission getMission(ObjectId id) {
		return missionRepository.findById(id);
	}

	// 장보기 미션 저장하기
	// 경험치는 일단 하드코딩 했음!!
	public ObjectId addShoppingMission(ShoppingCreateRequestDto shoppingCreateRequestDto){
		Mission mission = Mission.builder()
			.parentId(shoppingCreateRequestDto.getParentId())
			.childId(shoppingCreateRequestDto.getChildId())
			.content("동네 마트 장보기")
			.exp(50)
			.status(Status.IN_PROGRESS)
			.completedAt(null)
			.afterImg(null)
			.missionType(MissionType.SHOP)
			.shoppingId(null)
			.comment(null)
			.build();

		Mission savedMission = missionRepository.saveMission(mission);
		return savedMission.getId();
	}

	// 장보기 미션에 장보기 할당하기
	public void allocateShoppingMission(ObjectId missionId, ObjectId shoppingId){
		missionRepository.updateShoppingId(missionId, shoppingId);
	}

	// 미션 저장하기
	public void addMission(Mission mission) {
		missionRepository.save(mission);
	}

	// 미션 삭제하기
	public void deleteMission(ObjectId id) {
		missionRepository.deleteMission(id);
	}

	// 아이 기준 미션 목록 조회하기
	public List<MissionResponseDto> getMissions(Long childId, Status status){
		List<Mission> missions = missionRepository.findAllByChildIdAndStatus(childId, status);

		// DTO로 변환
		List<MissionResponseDto> missionResponseDtos = missions.stream()
			.map((mission) -> MissionResponseDto.builder()
				.content(mission.getContent())
				.completedAt(mission.getCompletedAt())
				.image(mission.getAfterImg())
				.type(mission.getMissionType())
				.shoppingId(mission.getShoppingId().toString())
				.build())
			.toList();

		return missionResponseDtos;
	}

	// 미션 완료 처리 하기
	public void setMissionStatusPending(ObjectId missionId){
		missionRepository.setMissionStatusPending(missionId).orElseThrow(MissionNotFoundException::new);
	}
}
