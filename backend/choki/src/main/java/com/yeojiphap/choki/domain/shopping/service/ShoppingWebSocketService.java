package com.yeojiphap.choki.domain.shopping.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.yeojiphap.choki.domain.shopping.dto.AddProductToCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.AddProductToCartResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.ChildPointDto;
import com.yeojiphap.choki.domain.shopping.dto.DeleteProductFromCartReqeustDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShoppingWebSocketService {
	private final SimpMessagingTemplate simpMessagingTemplate;
	private final ShoppingService shoppingService;

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
}
