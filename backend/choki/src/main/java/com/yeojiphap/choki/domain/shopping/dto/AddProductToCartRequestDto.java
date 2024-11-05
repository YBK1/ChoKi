package com.yeojiphap.choki.domain.shopping.dto;

import org.bson.types.ObjectId;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AddProductToCartRequestDto {
	private ObjectId shoppingId;
	private Long barcode;
	private Long quantity;
	private String comment;
}
