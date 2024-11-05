package com.yeojiphap.choki.domain.shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DeleteProductFromCartReqeustDto {
	private String shoppingId;
	private String barcode;
}
