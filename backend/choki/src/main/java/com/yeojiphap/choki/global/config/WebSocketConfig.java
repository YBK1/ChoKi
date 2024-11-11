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
		// /sub로 시작하는 주소만 구독 기능으로 연결될 수 있다.
		config.enableSimpleBroker("/sub"); //메세지 받을 때 경로
		// convertAndSend를 포함한 메세지 전송 기능을 사용할 수 있는 주소를 명시한다.
		// 이번 프로젝트의 경우 /pub는 메세지 전송 엔드포인트의 시작점이므로 당연히 포함이고
		// /user로 시작되는 구독이 이루어 지므로 /user도 포함해줘야 함.
		config.setApplicationDestinationPrefixes("/pub", "/sub", "/user"); //메세지 보낼 때 경로
		// 이걸 설정해주면 모든 구독 앞에서 /user가 존재할 때 알아서 인식한다.
		// /user/sub와 /sub가 동일하게 하나의 @SubscribeMapping에서 인식되도록 해줌
		// 단 위 둘은 구독 주소가 다르기 때문에 convertAndSend에서는 다르게 취급된다는 것에 유의
		config.setUserDestinationPrefix("/user"); // user로 사용자 경로 구분
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
