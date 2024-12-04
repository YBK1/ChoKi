package com.yeojiphap.choki.domain.shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BarcodeItem {
	private String barcode;
	private Long quantity;
}
