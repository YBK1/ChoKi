package com.yeojiphap.choki.domain.shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DeleteProductFromCartRequestDto {
	private String shoppingId;
	private String listBarcode;
	private String barcode;
}
