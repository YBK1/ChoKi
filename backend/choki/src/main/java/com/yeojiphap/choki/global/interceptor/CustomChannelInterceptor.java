package com.yeojiphap.choki.global.interceptor;

import java.security.Principal;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.yeojiphap.choki.domain.shopping.service.ShoppingWebSocketService;
import com.yeojiphap.choki.global.auth.jwt.JWTUtil;
import com.yeojiphap.choki.global.principal.ShoppingPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomChannelInterceptor implements ChannelInterceptor {
	private final JWTUtil jwtUtil;
	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

		// 웹소켓 연결시 세션에 저장
		if (StompCommand.CONNECT.equals(accessor.getCommand())) {
			// jwt를 가져오기
			String authHeader = accessor.getFirstNativeHeader("access");

			String username = jwtUtil.getUsername(authHeader);
			// 커스텀 Principal 생성
			Principal principal = new ShoppingPrincipal(username);
			// STOMP 세션에 Principal 설정
			accessor.setUser(principal);
		}

		// 구독 요청시
		if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
			String destination = accessor.getDestination();
			log.info("구독을 시도하였습니다 : {}", destination);

			// 구독 주소 검증
			if (!isValidSubscription(destination)) {
				log.error("구독 주소 오류: {}", destination);
				throw new MessageDeliveryException("구독 주소가 올바르지 않습니다.");
			}
		}
		return message;
	}

	private boolean isValidSubscription(String destination) {
		// 예: /sub/shopping/{id} 형식인지 검증
		// return destination != null &&
		// 	(destination.startsWith("/sub/shopping/") ||
		// 		destination.startsWith("/user/sub/shopping/"));
		return true;
	}
}
