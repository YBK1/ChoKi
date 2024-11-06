package com.yeojiphap.choki.domain.shopping.dto.websocketDto;

import com.yeojiphap.choki.domain.shopping.dto.HelpMessageDto;

import lombok.Getter;

@Getter
public class HelpMessageResponseDto {
	private final String type = "HINT_MESSAGE";
	private String message;

	public HelpMessageResponseDto(HelpMessageDto helpMessageDto) {
		this.message = helpMessageDto.getMessage();
	}
}
