package com.yeojiphap.choki.domain.mission.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.yeojiphap.choki.domain.mission.domain.Mission;
import com.yeojiphap.choki.domain.mission.domain.Status;
import com.yeojiphap.choki.domain.mission.dto.MissionResponseDto;
import com.yeojiphap.choki.domain.mission.repository.MissionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MissionService {
	private final MissionRepository missionRepository;

	// 미션 저장하기
	public void addMission(Mission mission) {
		missionRepository.save(mission);
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
				.build())
			.toList();

		return missionResponseDtos;
	}
}
