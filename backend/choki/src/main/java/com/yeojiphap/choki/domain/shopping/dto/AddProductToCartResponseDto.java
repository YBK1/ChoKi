package com.yeojiphap.choki.domain.shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class AddProductToCartResponseDto {
	private String type;
	private ProductDto productDto;
	private Long quantity;
	private String comment;
}
