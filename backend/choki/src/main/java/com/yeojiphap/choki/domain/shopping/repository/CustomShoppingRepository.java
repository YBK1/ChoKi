package com.yeojiphap.choki.domain.shopping.repository;

import java.util.Optional;

import org.bson.types.ObjectId;

import com.yeojiphap.choki.domain.shopping.domain.CartItem;
import com.yeojiphap.choki.domain.shopping.domain.Product;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;

public interface CustomShoppingRepository {
	void insertCartItemNotInList(ObjectId shoppingId, Product product);

	Optional<Shopping> insertCartItemById(ObjectId shoppingId, String barcode, CartItem cartItem);

	// 업데이트가 있어야 할듯..
	Optional<Shopping> changeQuantityOfCartItem(ObjectId shoppingId, String barcode, int quantity);

	void deleteCartItemById(ObjectId shoppingId, String barcode);

	Optional<Shopping> findById(ObjectId shoppingId);
}
