package com.yeojiphap.choki.domain.notification.dto;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;

import com.yeojiphap.choki.domain.notification.entity.NotificationType;
import com.yeojiphap.choki.domain.user.domain.User;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class NotificationResponseDto {
	private Long childId;
	private String content;
	private ObjectId missionId;
	private NotificationType type;
	private LocalDateTime time;
}
