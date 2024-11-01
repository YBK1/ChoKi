package com.yeojiphap.choki.domain.chore.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

	public List<ProductDto> searchProductByName(String itemName, Pageable pageable){
		// elasticsearch 검색
		Page<ProductDocument> pages = productRepository.findByNameContaining(itemName, pageable);

		// 결과
		List<ProductDto> productDtoList = new ArrayList<>();
		for(ProductDocument product : pages) {
			// DTO로 변환
			productDtoList.add(ProductDto.builder()
					.barcode(product.getNumber())
					.productName(product.getName())
					.category(product.getCategory())
					.image(product.getImage())
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
