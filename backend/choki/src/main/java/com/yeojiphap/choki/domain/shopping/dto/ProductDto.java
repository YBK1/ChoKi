package com.yeojiphap.choki.domain.shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class ProductDto {
	private String barcode;
	private String category;
	private String productName;
	private String image;
}
