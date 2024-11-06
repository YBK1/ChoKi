package com.yeojiphap.choki.domain.shopping.dto.websocketDto;

import com.yeojiphap.choki.domain.shopping.dto.DeleteProductFromCartRequestDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DeleteProductFromCartResponseDto {
	private final String type = "DELETE_PRODUCT_FROM_CART";
	private String listBarcode;
	private String barcode;

	public DeleteProductFromCartResponseDto(DeleteProductFromCartRequestDto dto) {
		this.listBarcode = dto.getListBarcode();
		this.barcode = dto.getBarcode();
	}
}
