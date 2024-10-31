package com.yeojiphap.choki.domain.chore.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;

import com.yeojiphap.choki.domain.chore.domain.ProductDocument;
import com.yeojiphap.choki.domain.chore.dto.ProductDto;
import com.yeojiphap.choki.domain.chore.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChoreService {
	private final ProductRepository productRepository;

	public List<ProductDto> searchProductByName(String itemName){
		// elasticsearch 검색
		SearchHits<ProductDocument> searchHits = productRepository.findByName(itemName);

		// 결과
		List<ProductDto> productDtoList = new ArrayList<>();
		for(SearchHit<ProductDocument> hit : searchHits) {
			// DTO로 변환
			productDtoList.add(ProductDto.builder()
					.barcode(hit.getContent().getNumber())
					.productName(hit.getContent().getName())
					.category(hit.getContent().getCategory())
					.image(hit.getContent().getImage())
					.build());
		}
		return productDtoList;
	}

	public ProductDto searchProductByBarcode(String barcode) {
		// ID 기반 단일 검색
		Optional<ProductDocument> productDto = productRepository.findById(barcode);
		
		// DTO 변환
		return ProductDto.builder()
			.barcode(productDto.get().getNumber())
			.productName(productDto.get().getName())
			.category(productDto.get().getCategory())
			.image(productDto.get().getImage())
			.build();

		// excpetion은 나중에 만들고 분류하자 일단 놔둬
		// if(productDto.isPresent()){
		// }
		// else{
		// 	throw new RuntimeException();
		// }
	}

}
