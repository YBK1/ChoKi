package com.yeojiphap.choki.domain.mission.dto;

import com.yeojiphap.choki.domain.mission.domain.MissionType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MissionAddRequestDto {
	public Long parentId;
	public Long childId;
	public MissionType missionType;
	public String content;
	public Long exp;
}
