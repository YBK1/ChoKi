package com.yeojiphap.choki.domain.notification.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yeojiphap.choki.domain.notification.Repository.NotificationRepository;
import com.yeojiphap.choki.domain.notification.dto.NotificationResponseDto;
import com.yeojiphap.choki.domain.notification.entity.Notification;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
	private final NotificationRepository notificationRepository;

	// 부모의 특정 아이에 대한 모든 알림을 가져오는 함수
	public List<NotificationResponseDto> getNotifications(Long childId) {
		String parentId = SecurityUtil.getCurrentUserId();

		List<Notification> notifications = new ArrayList<>();
		notifications.addAll(notificationRepository.findAllByParentId(parentId, childId));

		// DTO로 변환
		List<NotificationResponseDto> dtos = notifications.stream()
			.map((notification) -> NotificationResponseDto.builder()
				.childId(notification.getChild().getId())
				.type(notification.getType())
				.content(notification.getContent())
				.time(notification.getTime())
				.missionId(notification.getMissionId())
				.build())
			.toList();

		return dtos;
	}

	// 알림 추가
	@Transactional
	public void addNotification(Notification notification) {
		notificationRepository.save(notification);
	}

	// 알림 삭제
	@Transactional
	public void deleteNotification(Long id) {
		notificationRepository.deleteById(id);
	}
}
