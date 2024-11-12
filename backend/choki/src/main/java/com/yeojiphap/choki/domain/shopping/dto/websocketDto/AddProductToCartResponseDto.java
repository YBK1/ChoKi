package com.yeojiphap.choki.domain.shopping.dto.websocketDto;

import com.yeojiphap.choki.domain.shopping.dto.AddProductToCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ProductDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class AddProductToCartResponseDto {
	private final String type = "ADD_PRODUCT_TO_CART";
	private String listBarcode;
	private String productName;
	private String image;
	private String barcode;
	private Long quantity;
	private String reason;
	private String status;

	public AddProductToCartResponseDto(AddProductToCartRequestDto dto, String productName, String image) {
		this.listBarcode = dto.getListBarcode();
		this.productName = productName;
		this.image = image;
		this.barcode = dto.getBarcode();
		this.quantity = dto.getQuantity();
		this.reason = dto.getReason();
	}
}
