package com.yeojiphap.choki.domain.shopping.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.yeojiphap.choki.domain.shopping.domain.CartItem;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomShoppingRepositoryImpl implements CustomShoppingRepository {
	private final MongoTemplate mongoTemplate;

	@Override
	public void insertCartItemById(ObjectId shoppingId, CartItem cartItem) {
		Query query = new Query(Criteria.where("_id").is(shoppingId));
		Update update = new Update().push("cartItem", cartItem);
		mongoTemplate.updateFirst(query, update, Shopping.class);
	}

	@Override
	public void deleteCartItemById(ObjectId shoppingId, String barcode) {
		Query query = new Query(Criteria.where("_id").is(shoppingId));
		Update update = new Update().pull("cartItems", Query.query(Criteria.where("barcode").is(barcode)));
		mongoTemplate.updateFirst(query, update, Shopping.class);
	}
}
