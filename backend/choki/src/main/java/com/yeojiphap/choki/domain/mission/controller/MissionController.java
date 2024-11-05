package com.yeojiphap.choki.domain.mission.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yeojiphap.choki.domain.mission.domain.Status;
import com.yeojiphap.choki.domain.mission.service.MissionService;
import com.yeojiphap.choki.global.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/mission")
public class MissionController {
	private final MissionService missionService;

	@GetMapping("/inProgress?userId={id}")
	public ApiResponse getInProgressMission(@PathVariable("id") Long userId) {
		return ApiResponse.success(HttpStatus.OK, missionService.getMissions(userId, Status.IN_PROGRESS), "미션 조회 성공");
	}
}
