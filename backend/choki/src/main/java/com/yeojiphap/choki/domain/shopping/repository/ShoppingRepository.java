package com.yeojiphap.choki.domain.shopping.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.yeojiphap.choki.domain.shopping.domain.Shopping;

public interface ShoppingRepository extends MongoRepository<Shopping, String> ,CustomShoppingRepository {

}
