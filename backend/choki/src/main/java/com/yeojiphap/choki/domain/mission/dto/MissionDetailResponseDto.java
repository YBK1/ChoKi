package com.yeojiphap.choki.domain.mission.dto;

import com.yeojiphap.choki.domain.mission.domain.Mission;
import com.yeojiphap.choki.domain.mission.domain.MissionType;
import com.yeojiphap.choki.domain.mission.domain.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class MissionDetailResponseDto {
	private String content;
	private String completedAt;
	private Status status;
	private MissionType type;
	private String image;
	private String comment;

	public MissionDetailResponseDto(Mission mission) {
		this.content = mission.getContent();
		this.completedAt = mission.getCompletedAt();
		this.status = mission.getStatus();
		this.type = mission.getMissionType();
		this.image = mission.getImage();
		this.comment = mission.getComment();
	}
}