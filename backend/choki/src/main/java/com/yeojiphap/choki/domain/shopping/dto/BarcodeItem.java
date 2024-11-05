package com.yeojiphap.choki.domain.shopping.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BarcodeItem {
	private Long barcode;
	private Long quantity;
}
