package com.yeojiphap.choki.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.yeojiphap.choki.global.interceptor.CustomChannelInterceptor;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	// private final JWTUtil jwtUtil;
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
	}
	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		// STOMP 연결 시 Interceptor 적용
		registration.interceptors(customChannelInterceptor);
	}
}
