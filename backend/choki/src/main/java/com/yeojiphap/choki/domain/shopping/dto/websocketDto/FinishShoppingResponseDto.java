package com.yeojiphap.choki.domain.shopping.dto.websocketDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FinishShoppingResponseDto {
	private String type = "FINISHED";
	private String message;

	public FinishShoppingResponseDto(String message) {
		this.message = message;
	}
}
