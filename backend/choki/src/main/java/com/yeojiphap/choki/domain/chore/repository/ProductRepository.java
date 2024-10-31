package com.yeojiphap.choki.domain.chore.repository;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.yeojiphap.choki.domain.chore.domain.Product;
import com.yeojiphap.choki.domain.chore.domain.ProductDocument;

@Repository
public interface ProductRepository extends ElasticsearchRepository<ProductDocument, String> {

}
