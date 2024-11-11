package com.yeojiphap.choki.domain.shopping.dto.websocketDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExceptionDto {
	private String type = "ERROR";
	private int status;
	private String message;

	public ExceptionDto(Exception e) {
		this.message = e.getMessage();
	}
}
