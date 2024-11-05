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
	private String parentId;
	private String childId;
	private Location startPoint;
	private Location destination;
	private Route route;
	private List<Product> shoppingList;
	private List<CartItem> cartItem;
	private ObjectId missionId;
}
