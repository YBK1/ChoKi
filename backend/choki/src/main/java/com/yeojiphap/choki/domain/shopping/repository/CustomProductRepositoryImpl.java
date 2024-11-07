package com.yeojiphap.choki.domain.shopping.repository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.yeojiphap.choki.domain.shopping.domain.ProductDocument;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CustomProductRepositoryImpl implements CustomProductRepository {
	private final ElasticsearchClient elasticsearchClient;

	@Override
	public Page<ProductDocument> searchByName(String itemName, Pageable pageable) {
		try {
			// 검색 쿼리 생성
			SearchRequest searchRequest = new SearchRequest.Builder()
				.index("product")
				.query(q -> q
					.match(m -> m
						.field("name")
						.query(itemName)
					)
				)
				.from((int)pageable.getOffset())
				.size(pageable.getPageSize())
				.build();

			// 검색 실행
			SearchResponse<ProductDocument> response = elasticsearchClient.search(searchRequest, ProductDocument.class);

			List<ProductDocument> products = response.hits().hits().stream()
				.map(hit -> hit.source())
				.collect(Collectors.toList());

			long totalHits = response.hits().total().value();

			return new PageImpl<>(products, pageable, totalHits);

		} catch (Exception e) {
			throw new RuntimeException("Failed to search products", e);
		}
	}
}
