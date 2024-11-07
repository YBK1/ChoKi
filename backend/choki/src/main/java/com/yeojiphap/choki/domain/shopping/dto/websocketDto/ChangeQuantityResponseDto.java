package com.yeojiphap.choki.domain.shopping.dto.websocketDto;

import com.yeojiphap.choki.domain.shopping.dto.ChangeQuantityRequestDto;

import lombok.Getter;

@Getter
public class ChangeQuantityResponseDto {
	private final String type = "CHANGE_QUANTITY";
	private String barcode;
	private int quantity;

	public ChangeQuantityResponseDto(ChangeQuantityRequestDto dto) {
		this.barcode = dto.getBarcode();
		this.quantity = dto.getQuantity();
	}
}
