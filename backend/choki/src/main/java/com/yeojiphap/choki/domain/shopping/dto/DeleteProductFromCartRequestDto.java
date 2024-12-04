package com.yeojiphap.choki.domain.shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class DeleteProductFromCartRequestDto {
	private String shoppingId;
	private String listBarcode;
	private String barcode;
}
