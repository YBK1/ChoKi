package com.yeojiphap.choki.domain.notification.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yeojiphap.choki.domain.notification.service.NotificationService;
import com.yeojiphap.choki.domain.shopping.dto.ShoppingCreateRequestDto;
import com.yeojiphap.choki.global.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notification")
public class NotificationController implements SpringDocNotificationController{
	private final NotificationService notificationService;

	@GetMapping("/{childId}")
	public ApiResponse listNotification(@PathVariable Long childId) {
		// 일단 임시로 넣어놓자
		return ApiResponse.success(HttpStatus.OK, notificationService.getNotifications(childId), "알림 조회 성공");
	}
}
