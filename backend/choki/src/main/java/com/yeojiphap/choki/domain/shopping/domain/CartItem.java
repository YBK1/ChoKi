package com.yeojiphap.choki.domain.shopping.domain;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document
@Getter
@Builder
@AllArgsConstructor
public class CartItem {
	private String barcode;
	private String category;
	private String productName;
	private String image;
	private Long quantity;
	// "SOLDOUT", "NOREASON", "BLANK"
	private String reason;
	// "MATCH", "SIMILAR", "NOT_MATCH"
	private String status;
}
