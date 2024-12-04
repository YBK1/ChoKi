package com.yeojiphap.choki.domain.shopping.dto.websocketDto;

import java.util.List;

import com.yeojiphap.choki.domain.shopping.domain.Location;
import com.yeojiphap.choki.domain.shopping.domain.Point;
import com.yeojiphap.choki.domain.shopping.domain.Product;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ShoppingResponseDto {
	private final String type = "SHOPPING";
	private String id;
	private Long parentId;
	private Long childId;
	private Location startPoint;
	private Location destination;
	private List<Point> route;
	private List<Product> shoppingList;
	private String missionId;

	public ShoppingResponseDto(Shopping shopping) {
		this.id = shopping.getId().toString();
		this.parentId = shopping.getParentId();
		this.childId = shopping.getChildId();
		this.startPoint = shopping.getStartPoint();
		this.destination = shopping.getDestination();
		this.route = shopping.getRoute();
		this.shoppingList = shopping.getShoppingList();
		this.missionId = shopping.getMissionId();
	}
}
