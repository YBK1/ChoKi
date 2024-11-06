package com.yeojiphap.choki.domain.shopping.repository;

import org.bson.types.ObjectId;

import com.yeojiphap.choki.domain.shopping.domain.CartItem;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;

public interface CustomShoppingRepository {
	void insertCartItemById(ObjectId shoppingId, String barcode, CartItem cartItem);

	// 업데이트가 있어야 할듯..
	void changeQuantityOfCartItem(ObjectId shoppingId, String barcode, int quantity);

	void deleteCartItemById(ObjectId shoppingId, String barcode);

	Shopping findById(ObjectId shoppingId);
}
