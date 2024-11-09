package com.yeojiphap.choki.domain.shopping.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.server.MethodNotAllowedException;

import com.yeojiphap.choki.domain.shopping.dto.AddProductToCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ChangeQuantityRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ChildPointDto;
import com.yeojiphap.choki.domain.shopping.dto.DeleteProductFromCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.HelpMessageDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.DangerRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.ExceptionDto;
import com.yeojiphap.choki.domain.shopping.exception.ShoppingNotFoundException;
import com.yeojiphap.choki.domain.shopping.exception.UnauthorizedRoleException;
import com.yeojiphap.choki.domain.shopping.service.ShoppingService;
import com.yeojiphap.choki.domain.shopping.service.ShoppingWebSocketService;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.global.principal.ShoppingPrincipal;

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
	@SubscribeMapping("/sub/shopping/{shoppingId}")  // 특정 방에 대한 구독 처리
	public void handleSubscribe(
		@DestinationVariable String shoppingId,
		@Header("access") String access,
		ShoppingPrincipal principal) {
		// 로그
		log.info("SUBSCRIBING 구독함!!");
		// 장보기 시작
		shoppingWebSocketService.startShopping(shoppingId, access);
	}

	// (/pub/shopping/product/add)
	@MessageMapping("/shopping/product/add")
	public void sendAddCartItem(AddProductToCartRequestDto addProductToCartRequestDto, @Header("access") String access) {
		// log
		log.info("상품 추가 메세지 보냄!!");

		// 장바구니 DB 정보 업데이트 ( 추가 )
		shoppingService.addProductToShopping(addProductToCartRequestDto);
		// sub로 메세지를 전송
		shoppingWebSocketService.sendAddProductMessage(addProductToCartRequestDto, access);
	}

	// (/pub/shopping/product/quantity)
	@MessageMapping("/shopping/product/quantity")
	public void changeQuantityOfCartItem(ChangeQuantityRequestDto changeQuantityRequestDto, @Header("access") String access) {
		// log
		log.info("상품 수량 변경 메세지 보냄!!");

		// 장바구니 DB 정보 업데이트 ( 변경 )
		shoppingService.changeQuantityOfCartItem(changeQuantityRequestDto);
		// sub로 메세지를 전송
		shoppingWebSocketService.sendChangeQuantityMessage(changeQuantityRequestDto, access);
	}

	// (/pub/shopping/product/delete)
	@MessageMapping("/shopping/product/delete")
	public void sendCartDeleteMessage(DeleteProductFromCartRequestDto deleteProductFromCartRequestDto, @Header("access") String access) {
		// log
		log.info("상품 삭제 메세지 보냄!!");

		// 장바구니 DB 정보 업데이트 ( 삭제 )
		shoppingService.deleteProductFromShopping(deleteProductFromCartRequestDto);
		// sub로 메세지를 전송
		shoppingWebSocketService.sendDeleteProductMessage(deleteProductFromCartRequestDto, access);
	}

	// (/pub/shopping/point)
	@MessageMapping("/shopping/point")
	public void sendChildPoint(ChildPointDto childPointDto, @Header("access") String access){
		// log
		log.info("위치 정보 수신함");

		// redis에 위치 저장
		shoppingService.saveChildPoint(childPointDto);
		// sub에 메세지를 전송
		shoppingWebSocketService.sendChildPoint(childPointDto, access);
	}

	// 특정 위기상황을 처리하는 함수
	// (/pub/shopping/point)
	@MessageMapping("/shopping/point/danger")
	public void sendDanger(DangerRequestDto dangerRequestDto, @Header("access") String access){
		// log
		log.info("위기 알림 수신함");

		// redis에 위치 저장
		shoppingService.sendDangerFcm(dangerRequestDto);
		// sub에 메세지를 전송
		shoppingWebSocketService.sendDangerNotification(dangerRequestDto, access);
	}

	// 장보기 종료 메세지
	@MessageMapping("/shopping/finish/{shoppingId}")
	public void sendFinishMessage(@DestinationVariable String shoppingId, @Header("access") String access){
		// log
		log.info("장보기 종료");

		// 완료 처리 수행하기
		shoppingService.completeShopping(shoppingId);

		// 완료 메세지 전송
		shoppingWebSocketService.sendFinishMessage(shoppingId, access);
	}

	// 부모의 도움 메세지 전송
	@MessageMapping("/shopping/message")
	public void sendHelpMessage(HelpMessageDto helpMessageDto, @Header("access") String access){
		log.info("도움 메세지 전달");

		shoppingWebSocketService.sendHelpMessage(helpMessageDto, access);
	}

	@MessageExceptionHandler
	public void handleException(Exception e, ShoppingPrincipal user){
		ExceptionDto exceptionDto = new ExceptionDto(e);

		if(e instanceof UserNotFoundException){
			exceptionDto.setStatus(((UserNotFoundException)e).getStatus().value());
		}
		else if(e instanceof ShoppingNotFoundException){
			exceptionDto.setStatus(((ShoppingNotFoundException)e).getStatus().value());
		}
		else if(e instanceof MissingRequestHeaderException){
			exceptionDto.setStatus(403);
			exceptionDto.setMessage("로그인 후 이용 가능합니다.");
		}
		else if(e instanceof UnauthorizedRoleException){
			exceptionDto.setStatus(((UnauthorizedRoleException)e).getStatus().value());
		}
		else if(e instanceof MethodArgumentNotValidException){
			exceptionDto.setStatus(400);
			exceptionDto.setMessage("잘못된 요청입니다.");
		}
		else{
			e.printStackTrace();
			exceptionDto.setStatus(500);
			exceptionDto.setMessage("오류가 발생했습니다.");
		}
		// 해당 사용자에게만 에러 메시지 전송
		shoppingWebSocketService.sendErrorMessage(user, exceptionDto);
	}
}
