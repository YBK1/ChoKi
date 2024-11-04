package com.yeojiphap.choki.global.config;

import java.util.Map;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.yeojiphap.choki.global.auth.jwt.JWTUtil;
import com.yeojiphap.choki.global.interceptor.CustomChannelInterceptor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	private final CustomChannelInterceptor customChannelInterceptor;

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/sub"); //메세지 받을 때 경로
		config.setApplicationDestinationPrefixes("/pub", "/sub"); //메세지 보낼 때 경로
	}
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws/shopping") //우리의 endpoint
			.setAllowedOrigins("*");

		log.info("STOMP 엔드포인트 등록됨");
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		// STOMP 연결 시 Interceptor 적용
		registration.interceptors(customChannelInterceptor);
		log.info("클라이언트 인바운드 채널 등록");
	}
}
