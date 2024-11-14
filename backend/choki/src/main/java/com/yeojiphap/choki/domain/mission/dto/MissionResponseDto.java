package com.yeojiphap.choki.domain.mission.dto;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;

import com.yeojiphap.choki.domain.mission.domain.MissionType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class MissionResponseDto {
	private String missionId;
	private String content;
	private String completedAt;
	private String image;
	private MissionType type;
	private String shoppingId;
}
