package com.yeojiphap.choki.domain.chore.domain;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document(collection = "route")
@Getter
@Builder
@AllArgsConstructor
public class Route {
	@Id
	private ObjectId id;
	private List<Point> route;
}
