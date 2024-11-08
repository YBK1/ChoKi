package com.yeojiphap.choki.domain.notification.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yeojiphap.choki.domain.notification.Repository.NotificationRepository;
import com.yeojiphap.choki.domain.notification.dto.NotificationResponseDto;
import com.yeojiphap.choki.domain.notification.entity.Notification;
import com.yeojiphap.choki.domain.notification.entity.NotificationType;
import com.yeojiphap.choki.domain.notification.exception.NotificationNotFoundException;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
	private final UserService userService;
	private final NotificationRepository notificationRepository;

	// 부모의 특정 아이에 대한 모든 알림을 가져오는 함수
	public List<NotificationResponseDto> getNotifications(Long childId) {
		String parentId = SecurityUtil.getCurrentUsername();

		List<Notification> notifications = notificationRepository.findAllByParentId(parentId, childId);

		if(notifications.isEmpty()) {
			throw new NotificationNotFoundException();
		}

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
		if(notification.getType() == NotificationType.SHOP){
			Optional<Long> notificationId = notificationRepository.findIdByChildId(notification.getChild().getId(), NotificationType.SHOP);
			if(notificationId.isPresent()){
				return;
			}
		}

		notificationRepository.save(notification);
	}

	@Transactional
	public void addNotificationFromShopping(Shopping shopping) {
		User child = userService.findById(shopping.getChildId());
		User parent = userService.findById(shopping.getParentId());

		// 알림 생성
		Notification notification = Notification.builder()
			.parent(parent)
			.child(child)
			.content("아이가 장보기를 시작했어요")
			.missionId(shopping.getId().toString())
			.type(NotificationType.SHOP)
			.build();

		if(notification.getType() == NotificationType.SHOP){
			Optional<Long> notificationId = notificationRepository.findIdByChildId(notification.getChild().getId(), NotificationType.SHOP);
			if(notificationId.isPresent()){
				return;
			}
		}

		notificationRepository.save(notification);
	}

	// 장보기 시작 알림을 삭제하고 미션 완료 알림을 생성
	@Transactional
	public void addNotificationIfShoppingEnd(Shopping shopping) {
		deleteNotificationByMissionId(shopping.getMissionId());

		User child = userService.findById(shopping.getChildId());
		User parent = userService.findById(shopping.getParentId());

		// 알림 생성
		Notification notification = Notification.builder()
			.parent(parent)
			.child(child)
			.content("아이가 장보기를 종료했어요")
			.missionId(shopping.getMissionId())
			.type(NotificationType.SHOP)
			.build();

		notificationRepository.save(notification);
	}

	// 알림 삭제
	@Transactional
	public void deleteNotification(Long id) {
		notificationRepository.deleteById(id);
	}

	@Transactional
	public void deleteNotificationByMissionId(String missionId) {
		notificationRepository.deleteByMissionId(missionId);
	}
}
