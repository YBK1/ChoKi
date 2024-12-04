package com.yeojiphap.choki.domain.shopping.dto;

import org.bson.types.ObjectId;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class AddProductToCartRequestDto {
	private String shoppingId;
	private String listBarcode;
	private String barcode;
	private Long quantity;
	private String reason;
	private String status;
}
