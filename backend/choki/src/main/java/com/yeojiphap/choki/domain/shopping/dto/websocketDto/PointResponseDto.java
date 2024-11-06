package com.yeojiphap.choki.domain.shopping.dto.websocketDto;

import com.yeojiphap.choki.domain.shopping.dto.ChildPointDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class PointResponseDto {
	private final String type = "POINT";
	private Double latitude;
	private Double longitude;

	public PointResponseDto(ChildPointDto childPointDto) {
		this.latitude = childPointDto.getLatitude();
		this.longitude = childPointDto.getLongitude();
	}
}
