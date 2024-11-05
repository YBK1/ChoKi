package com.yeojiphap.choki.domain.shopping.dto;

import java.util.List;

import com.yeojiphap.choki.domain.shopping.domain.Location;
import com.yeojiphap.choki.domain.shopping.domain.Point;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ShoppingCreateRequestDto {
	private Long parentId;
	private Long childId;
	private Location startPoint;
	private Location destination;
	private List<Point> route;
	private List<BarcodeItem> shoppingList;
}
