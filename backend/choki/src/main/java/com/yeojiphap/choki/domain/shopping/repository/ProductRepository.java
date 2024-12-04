package com.yeojiphap.choki.domain.shopping.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.yeojiphap.choki.domain.shopping.domain.ProductDocument;

@Repository
public interface ProductRepository extends ElasticsearchRepository<ProductDocument, String>, CustomProductRepository {

}
