package com.yeojiphap.choki.domain.mission.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MissionCommentRequestDto {
	private String missionId;
	private String comment;
}
