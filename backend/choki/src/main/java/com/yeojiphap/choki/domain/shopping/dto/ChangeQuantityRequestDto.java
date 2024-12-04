package com.yeojiphap.choki.domain.shopping.dto;

import lombok.Getter;

@Getter
public class ChangeQuantityRequestDto {
	private String shoppingId;
	private String barcode;
	private int quantity;
}
