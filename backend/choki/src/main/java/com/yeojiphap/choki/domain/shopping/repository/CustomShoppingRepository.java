package com.yeojiphap.choki.domain.shopping.repository;

import org.bson.types.ObjectId;

import com.yeojiphap.choki.domain.shopping.domain.CartItem;

public interface CustomShoppingRepository {
	void insertCartItemById(ObjectId shoppingId, CartItem cartItem);

	void deleteCartItemById(ObjectId shoppingId, String barcode);
}
