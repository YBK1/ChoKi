package com.yeojiphap.choki.domain.shopping.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.yeojiphap.choki.domain.shopping.domain.ProductDocument;

public interface CustomProductRepository {

	Page<ProductDocument> searchByName(String itemName, Pageable pageable);
}
