package com.yeojiphap.choki.domain.shopping.dto.websocketDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DangerResponseDto {
	private String type;
	private String message;

	public DangerResponseDto(DangerRequestDto dangerRequestDto) {
		this.type = "DANGER";
		this.message = dangerRequestDto.getMessage();
	}
}
