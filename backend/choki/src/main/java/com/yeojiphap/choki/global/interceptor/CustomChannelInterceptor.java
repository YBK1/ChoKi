package com.yeojiphap.choki.global.interceptor;

import java.security.Principal;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.yeojiphap.choki.global.auth.jwt.JWTUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomChannelInterceptor implements ChannelInterceptor {
	private final JWTUtil jwtUtil;
	// @Override
	// public Message<?> preSend(Message<?> message, MessageChannel channel) {
	// 	// StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
	// 	//
	// 	// // 웹소켓 연결시 세션에 저장
	// 	// if (StompCommand.CONNECT.equals(accessor.getCommand())) {
	// 	// 	// jwt를 가져오기
	// 	// 	String authHeader = accessor.getFirstNativeHeader("Authorization");
	// 	//
	// 	// 	if (authHeader != null && authHeader.startsWith("Bearer ")) {
	// 	// 		// 토큰의 정보 받고 유저 아이디 가져오기
	// 	// 		String token = authHeader.substring(7);
	// 	// 		Long userId = jwtUtil.getIdFromToken(token);
	// 	//
	// 	// 		// 커스텀 Principal 생성
	// 	// 		Principal principal = new CustomPrincipal(Long.toString(userId));
	// 	//
	// 	// 		// STOMP 세션에 Principal 설정
	// 	// 		accessor.setUser(principal);
	// 	// 	}
	// 	// }
	//
	//
	// 	return message;
	// }

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

		if (StompCommand.CONNECT.equals(accessor.getCommand())) {
			log.debug("STOMP Connect attempt");
		}

		return message;
	}
}
