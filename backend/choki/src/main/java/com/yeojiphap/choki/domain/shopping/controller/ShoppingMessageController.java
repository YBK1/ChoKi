package com.yeojiphap.choki.domain.shopping.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import com.yeojiphap.choki.domain.shopping.dto.AddProductToCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.DeleteProductFromCartReqeustDto;
import com.yeojiphap.choki.domain.shopping.service.ShoppingService;
import com.yeojiphap.choki.domain.shopping.service.ShoppingWebSocketService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
public class ShoppingMessageController {
	private final ShoppingWebSocketService shoppingWebSocketService;
	private final ShoppingService shoppingService;

	// /sub/shopping/{id}
	// 사용자가 웹소켓 구독할 경우 ( 다른 사람이 이 주소로 보내는 메세지를 나한테도 주세요하고 신청했을 때 )
	@SubscribeMapping("/shopping/{shoppingId}")  // 특정 방에 대한 구독 처리
	public void handleSubscribe(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String shoppingId) {
		// 로그
		log.info("SUBSCRIBING 구독함!!");

		// 세션에서 사용자 ID 가져오기
		Principal principal = headerAccessor.getUser();
		if (principal != null) {
			String userId = principal.getName();  // CustomPrincipal에서 userId 가져오기

			// 여기서 구현해야 할 부분
			// 1. 웹소켓 연결시 그 아이의 부모를 찾기
			// 2. 그 아이의 부모에게 fcm 메세지 전송
			// 3. 동시에 알림 디비에 값도 추가해야 겠지?
		}
	}

	// (/pub/shopping/product/add)
	@MessageMapping("/shopping/product/add")
	public void sendCartAddMessage(AddProductToCartRequestDto addProductToCartRequestDto) {
		// log
		log.info("SEND: 상품 추가 메세지 보냄!!");

		// 장바구니 DB 정보 업데이트 ( 추가 )
		shoppingService.addProductToShopping(addProductToCartRequestDto);
		// sub로 메세지를 전송
		shoppingWebSocketService.sendAddProductMessage(addProductToCartRequestDto);
	}

	// (/pub/shopping/product/add)
	@MessageMapping("/shopping/product/add")
	public void sendCartDeleteMessage(DeleteProductFromCartReqeustDto deleteProductFromCartReqeustDto) {
		// log
		log.info("상품 삭제 메세지 보냄!!");

		// 장바구니 DB 정보 업데이트 ( 삭제 )
		shoppingService.deleteProductFromShopping(deleteProductFromCartReqeustDto);
		// sub로 메세지를 전송
		shoppingWebSocketService.sendDeleteProductMessage(deleteProductFromCartReqeustDto);
	}
}
