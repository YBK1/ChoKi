package com.yeojiphap.choki.domain.shopping.domain;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document(collection = "shopping")
@Getter
@Builder
@AllArgsConstructor
public class Shopping {
	@Id
	private ObjectId id;
	private Long parentId;
	private Long childId;
	private Location startPoint;
	private Location destination;
	private List<Point> route;
	private List<Product> shoppingList;
	private String missionId;
}
