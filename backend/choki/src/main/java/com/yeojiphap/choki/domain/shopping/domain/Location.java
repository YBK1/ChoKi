package com.yeojiphap.choki.domain.shopping.domain;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document
@Getter
@Builder
@AllArgsConstructor
public class Location {
	private Double latitude;
	private Double longitude;
	private String buildingName;
}
