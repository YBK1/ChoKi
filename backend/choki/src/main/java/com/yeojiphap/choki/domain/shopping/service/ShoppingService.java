package com.yeojiphap.choki.domain.shopping.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.yeojiphap.choki.domain.mission.service.MissionService;
import com.yeojiphap.choki.domain.shopping.domain.Point;
import com.yeojiphap.choki.domain.shopping.dto.*;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.yeojiphap.choki.domain.shopping.domain.CartItem;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;
import com.yeojiphap.choki.domain.shopping.domain.Product;
import com.yeojiphap.choki.domain.shopping.domain.ProductDocument;
import com.yeojiphap.choki.domain.shopping.domain.Route;
import com.yeojiphap.choki.domain.shopping.repository.ShoppingRepository;
import com.yeojiphap.choki.domain.shopping.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@Slf4j
@RequiredArgsConstructor
public class ShoppingService {
	private final ProductRepository productRepository;
	private final ShoppingRepository shoppingRepository;
	private final RedisTemplate<String, Object> redisTemplate;
	private final MissionService missionService;

	// 쇼핑 정보 검색하기
	public Shopping getShoppingById(ObjectId id) {
		return shoppingRepository.findById(id);
	}

	// 사용자가 입력한 내용으로 새로운 장보기를 만드는 함수
	@Transactional
	public void createShopping(ShoppingCreateRequestDto createRequestDto) {
		Shopping shopping = Shopping.builder()
			.startPoint(createRequestDto.getStartPoint())
			.destination(createRequestDto.getDestination())
			.route(Route.builder().route(createRequestDto.getRoute()).build())
			.shoppingList(createRequestDto.getShoppingList().stream()
				.map(barcodeItem -> {
					// 바코드 값만 들어온 request를 실제 상품 값으로 조회해서 저장
					ProductDto productDto = searchProductByBarcode(Long.toString(barcodeItem.getBarcode()));

					return Product.builder()
						.barcode(Long.toString(barcodeItem.getBarcode()))
						.quantity(barcodeItem.getQuantity())
						.productName(productDto.getProductName())
						.category(productDto.getCategory())
						.image(productDto.getImage())
						.build();
				}).collect(Collectors.toList()))
			.cartItem(new ArrayList<>())
			.build();

		shoppingRepository.save(shopping);

		// 미션도 생성해야 함
		missionService.addShoppingMission(createRequestDto);
	}

	// 장바구니에 상품 담기
	@Transactional
	public void addProductToShopping(AddProductToCartRequestDto addProductToCartRequestDto) {
		ProductDto productDto = searchProductByBarcode(Long.toString(addProductToCartRequestDto.getBarcode()));

		// CartItem 생성
		CartItem cartItem = CartItem.builder()
			.barcode(Long.toString(addProductToCartRequestDto.getBarcode()))
			.quantity(addProductToCartRequestDto.getQuantity())
			.productName(productDto.getProductName())
			.category(productDto.getCategory())
			.image(productDto.getImage())
			.comment(addProductToCartRequestDto.getComment())
			.build();
		// 삽입
		shoppingRepository.insertCartItemById(addProductToCartRequestDto.getShoppingId(), cartItem);
	}

	// 장바구니에서 상품 빼기
	@Transactional
	public void deleteProductFromShopping(DeleteProductFromCartReqeustDto deleteProductFromCartReqeustDto){
		// 삭제 수행
		shoppingRepository.deleteCartItemById(new ObjectId(deleteProductFromCartReqeustDto.getShoppingId()), deleteProductFromCartReqeustDto.getBarcode());
	}

	// 이름 기반 상품 검색
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

	// 바코드 기반 단일 상품 검색
	public ProductDto searchProductByBarcode(String barcode) {
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

	public ProductCompareResponseDto compareBarcode(ProductCompareRequestDto productCompareRequestDto) {
		// log
		log.info("상품 비교 시작");

		// 장바구니 리스트 바코드 정보 확인
		ProductDto originProduct =searchProductByBarcode(Long.toString(productCompareRequestDto.getOriginBarcode()));
		// 입력 바코드 정보 확인
		ProductDto inputProduct = searchProductByBarcode(Long.toString(productCompareRequestDto.getInputBarcode()));

		ProductCompareResponseDto productCompareResponseDto = new ProductCompareResponseDto();
		if(originProduct.getBarcode() == inputProduct.getBarcode()) {
			productCompareResponseDto.setMatchStatus("MATCH");
		}
		else{
			// 문자열을 '>'로 나눠 배열로 변환
			String[] originCategory = originProduct.getCategory().split(">");
			String[] inputCategory = inputProduct.getCategory().split(">");

			// 마지막 요소 비교
			if(originCategory[originCategory.length - 1].equals(inputCategory[inputCategory.length - 1])){
				productCompareResponseDto.setMatchStatus("SIMILAR");
			}
			else {
				productCompareResponseDto.setMatchStatus("NOT_MATCH");
			}
		}

		// sub로 메세지를 전송
		return productCompareResponseDto;
	}

	// Redis에 현재 아이 위치 저장
	public void saveChildPoint(ChildPointDto childPointDto) {
		Point point = Point.builder()
			.latitude(childPointDto.getLatitude())
			.longitude(childPointDto.getLongitude())
			.build();

		redisTemplate.opsForHash().put(childPointDto.getShoppingId().toString(), "location", point);
	}
}
