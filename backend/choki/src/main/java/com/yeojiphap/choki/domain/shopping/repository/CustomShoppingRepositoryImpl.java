package com.yeojiphap.choki.domain.shopping.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.yeojiphap.choki.domain.shopping.domain.CartItem;
import com.yeojiphap.choki.domain.shopping.domain.Product;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CustomShoppingRepositoryImpl implements CustomShoppingRepository {
	private final MongoTemplate mongoTemplate;

	@Override
	public void insertCartItemNotInList(ObjectId shoppingId, Product product) {
		Query query = new Query(Criteria.where("_id").is(shoppingId));
		Update update = new Update().push("shoppingList", product);

		mongoTemplate.findAndModify(
			query,
			update,
			Shopping.class
		);
	}

	@Override
	public Optional<Shopping> insertCartItemById(ObjectId shoppingId, String barcode ,CartItem cartItem) {
		Query query = new Query();
		query.addCriteria(Criteria.where("_id").is(shoppingId)
			.and("shoppingList.barcode").is(barcode));

		Update update = new Update();
		update.set("shoppingList.$.cartItem", cartItem);

		return Optional.ofNullable(mongoTemplate.findAndModify(
			query,
			update,
			FindAndModifyOptions.options().returnNew(true),
			Shopping.class
		));
	}

	// 업데이트가 있어야 할듯..
	@Override
	public Optional<Shopping> changeQuantityOfCartItem(ObjectId shoppingId, String barcode, int quantity) {
		Query query = new Query();
		query.addCriteria(Criteria.where("_id").is(shoppingId)
			.and("shoppingList.barcode").is(barcode));

		Update update = new Update();
		update.set("shoppingList.$.cartItem.quantity", quantity);

		return Optional.ofNullable(mongoTemplate.findAndModify(
			query,
			update,
			FindAndModifyOptions.options().returnNew(true),
			Shopping.class
		));
	}

	@Override
	public void deleteCartItemById(ObjectId shoppingId, String listBarcode, String barcode) {
		Query query = new Query();
		query.addCriteria(Criteria.where("_id").is(shoppingId)
			.and("shoppingList.barcode").is(listBarcode));

		Update update = new Update();
		update.unset("shoppingList.$.cartItem");

		mongoTemplate.updateFirst(query, update, Shopping.class);
	}

	@Override
	public Optional<Shopping> findById(ObjectId shoppingId) {
		Query query = new Query(Criteria.where("_id").is(shoppingId));
		return Optional.ofNullable(mongoTemplate.findOne(query, Shopping.class));
	}
}
