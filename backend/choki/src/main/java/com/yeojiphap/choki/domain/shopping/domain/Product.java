package com.yeojiphap.choki.domain.shopping.domain;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document
@Getter
@Builder
@AllArgsConstructor
public class Product {
	private String barcode;
	private String category;
	private String productName;
	private String image;
	private Long quantity;
}
