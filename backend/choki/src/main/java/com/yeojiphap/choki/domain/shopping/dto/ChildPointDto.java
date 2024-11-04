package com.yeojiphap.choki.domain.shopping.dto;

import org.bson.types.ObjectId;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ChildPointDto {
	private ObjectId shoppingId;
	private Double latitude;
	private Double longitude;
}
