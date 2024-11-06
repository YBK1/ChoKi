package com.yeojiphap.choki.domain.shopping.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import com.yeojiphap.choki.domain.shopping.dto.AddProductToCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ChangeQuantityRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ChildPointDto;
import com.yeojiphap.choki.domain.shopping.dto.DeleteProductFromCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.HelpMessageDto;
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
	public void handleSubscribe(@DestinationVariable String shoppingId, @Header("access") String access) {
		// 로그
		log.info("SUBSCRIBING 구독함!!");
		// 장보기 시작
		shoppingWebSocketService.startShopping(shoppingId, access);
	}

	// (/pub/shopping/product/add)
	@MessageMapping("/shopping/product/add")
	public void sendAddCartItem(AddProductToCartRequestDto addProductToCartRequestDto) {
		// log
		log.info("상품 추가 메세지 보냄!!");

		// 장바구니 DB 정보 업데이트 ( 추가 )
		shoppingService.addProductToShopping(addProductToCartRequestDto);
		// sub로 메세지를 전송
		shoppingWebSocketService.sendAddProductMessage(addProductToCartRequestDto);
	}

	// (/pub/shopping/product/quantity)
	@MessageMapping("/shopping/product/quantity")
	public void changeQuantityOfCartItem(ChangeQuantityRequestDto changeQuantityRequestDto) {
		// log
		log.info("상품 수량 변경 메세지 보냄!!");

		// 장바구니 DB 정보 업데이트 ( 변경 )
		shoppingService.changeQuantityOfCartItem(changeQuantityRequestDto);
		// sub로 메세지를 전송
		shoppingWebSocketService.sendChangeQuantityMessage(changeQuantityRequestDto);
	}

	// (/pub/shopping/product/delete)
	@MessageMapping("/shopping/product/delete")
	public void sendCartDeleteMessage(DeleteProductFromCartRequestDto deleteProductFromCartRequestDto) {
		// log
		log.info("상품 삭제 메세지 보냄!!");

		// 장바구니 DB 정보 업데이트 ( 삭제 )
		shoppingService.deleteProductFromShopping(deleteProductFromCartRequestDto);
		// sub로 메세지를 전송
		shoppingWebSocketService.sendDeleteProductMessage(deleteProductFromCartRequestDto);
	}

	// (/pub/shopping/point)
	@MessageMapping("/shopping/point")
	public void sendChildPoint(ChildPointDto childPointDto){
		// log
		log.info("위치 정보 수신함");

		// redis에 위치 저장
		shoppingService.saveChildPoint(childPointDto);
		// sub에 메세지를 전송
		shoppingWebSocketService.sendChildPoint(childPointDto);
	}

	// 장보기 종료 메세지
	@MessageMapping("/shopping/finish/{shoppingId}")
	public void sendFinishMessage(@DestinationVariable String shoppingId){
		// log
		log.info("장보기 종료");

		// 완료 처리 수행하기
		shoppingService.completeShopping(shoppingId);

		// 완료 메세지 전송
		shoppingWebSocketService.sendFinishMessage(shoppingId);
	}

	// 부모의 도움 메세지 전송
	@MessageMapping("/shopping/message")
	public void sendHelpMessage(HelpMessageDto helpMessageDto){
		log.info("도움 메세지 전달");

		shoppingWebSocketService.sendHelpMessage(helpMessageDto);
	}
}
