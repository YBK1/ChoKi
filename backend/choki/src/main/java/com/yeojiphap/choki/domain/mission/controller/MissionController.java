package com.yeojiphap.choki.domain.mission.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.yeojiphap.choki.domain.mission.domain.Status;
import com.yeojiphap.choki.domain.mission.dto.MissionCommentRequestDto;
import com.yeojiphap.choki.domain.mission.service.MissionService;
import com.yeojiphap.choki.global.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mission")
public class MissionController implements SpringDocMissionController {
	private final MissionService missionService;

	@GetMapping("/inProgress")
	public ApiResponse getInProgressMission(@RequestParam("userId") Long userId) {
		return ApiResponse.success(HttpStatus.OK, missionService.getMissions(userId, Status.IN_PROGRESS), "미션 조회 성공");
	}

	@GetMapping("/{missionId}")
	public ApiResponse getMission(@PathVariable("missionId") String missionId) {
		return ApiResponse.success(HttpStatus.OK, missionService.getMission(missionId), "미션 조회 성공");
	}

	@PostMapping("/accept")
	public ApiResponse commentMission(@RequestBody MissionCommentRequestDto commentRequestDto) {
		missionService.addMissionComment(commentRequestDto);
		return ApiResponse.success(HttpStatus.OK, "미션 완료 성공");
	}

	@GetMapping("/completed")
	public ApiResponse getCompletedMissions(@RequestParam("userId") Long userId) {
		return ApiResponse.success(HttpStatus.OK, missionService.getMissions(userId, Status.COMPLETED), "미션 조회 성공");
	}
}
