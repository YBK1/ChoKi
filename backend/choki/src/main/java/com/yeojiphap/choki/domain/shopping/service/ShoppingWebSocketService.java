package com.yeojiphap.choki.domain.shopping.service;

import org.bson.types.ObjectId;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.yeojiphap.choki.domain.notification.entity.Notification;
import com.yeojiphap.choki.domain.notification.entity.NotificationType;
import com.yeojiphap.choki.domain.notification.service.NotificationService;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;
import com.yeojiphap.choki.domain.shopping.dto.AddProductToCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.AddProductToCartResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.ChildPointDto;
import com.yeojiphap.choki.domain.shopping.dto.DeleteProductFromCartReqeustDto;
import com.yeojiphap.choki.domain.shopping.dto.HelpMessageDto;
import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShoppingWebSocketService {
	private final SimpMessagingTemplate simpMessagingTemplate;
	private final ShoppingService shoppingService;
	private final UserService userService;
	private final NotificationService notificationService;

	// 아이의 장보기 시작 메소드
	public void startShopping(String shoppingId){
		User currentUser = userService.findByUserId(SecurityUtil.getCurrentUserId());

		// 아이가 시작한 경우에만 알림이 가도록 해야 한다.
		if(currentUser.getRole() == Role.CHILD){
			Shopping shopping = shoppingService.getShoppingById(new ObjectId(shoppingId));

			User child = userService.findByUserId(shopping.getParentId());
			User parent = userService.findByUserId(shopping.getChildId());

			// 알림 생성
			Notification notification = Notification.builder()
				.parent(parent)
				.child(child)
				.content("아이가 장보기를 시작했어요!")
				.missionId(shoppingId)
				.type(NotificationType.SHOPPING)
				.build();

			// 알림 추가
			notificationService.addNotification(notification);
			// FCM 보내야겠지?

		}

	}

	// 장바구니에 상품을 담았음을 전송
	public void sendAddProductMessage(AddProductToCartRequestDto addProductToCartRequestDto) {
		// ResponseDto로 변환
		AddProductToCartResponseDto addProductToCartResponseDto = AddProductToCartResponseDto.builder()
				.type("ADD")
				.productDto(shoppingService.searchProductByBarcode(Long.toString(addProductToCartRequestDto.getBarcode())))
				.quantity(addProductToCartRequestDto.getQuantity())
				.comment(addProductToCartRequestDto.getComment())
				.build();

		simpMessagingTemplate.convertAndSend("/sub/shopping/" + addProductToCartRequestDto.getShoppingId(), addProductToCartResponseDto);
	}

	// 장바구니에서 상품을 제거했음을 전송
	public void sendDeleteProductMessage(DeleteProductFromCartReqeustDto deleteProductFromCartReqeustDto) {
		simpMessagingTemplate.convertAndSend("/sub/shopping/" + deleteProductFromCartReqeustDto.getShoppingId(), deleteProductFromCartReqeustDto);
	}

	// 아이의 위치를 전송
	public void sendChildPoint(ChildPointDto childPointDto) {
		simpMessagingTemplate.convertAndSend("/sub/shopping/" + childPointDto.getShoppingId(), childPointDto);
	}

	// 헬프 메시지 전송
	public void sendHelpMessage(HelpMessageDto helpMessageDto) {
		simpMessagingTemplate.convertAndSend("/sub/shopping/" + helpMessageDto.getShoppingId(), helpMessageDto);
	}
}
