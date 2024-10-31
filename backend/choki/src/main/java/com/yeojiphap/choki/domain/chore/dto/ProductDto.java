package com.yeojiphap.choki.domain.chore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class ProductDto {
	private Long barcode;
	private String category;
	private String productName;
	private String image;
}
