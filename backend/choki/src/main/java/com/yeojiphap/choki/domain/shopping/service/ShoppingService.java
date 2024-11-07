package com.yeojiphap.choki.domain.shopping.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.yeojiphap.choki.domain.mission.service.MissionService;
import com.yeojiphap.choki.domain.notification.service.NotificationService;
import com.yeojiphap.choki.domain.shopping.dto.*;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.yeojiphap.choki.domain.shopping.domain.CartItem;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;
import com.yeojiphap.choki.domain.shopping.domain.Product;
import com.yeojiphap.choki.domain.shopping.domain.ProductDocument;
import com.yeojiphap.choki.domain.shopping.exception.BadRequestException;
import com.yeojiphap.choki.domain.shopping.repository.ShoppingRepository;
import com.yeojiphap.choki.domain.shopping.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@Slf4j
@RequiredArgsConstructor
public class ShoppingService {
	private final ProductRepository productRepository;
	private final ShoppingRepository shoppingRepository;
	private final MissionService missionService;
	private final NotificationService notificationService;
	private final RedisTemplate<String, Object> redisTemplate;

	// 쇼핑 정보 검색하기
	public Shopping getShoppingById(ObjectId id) {
		return shoppingRepository.findById(id);
	}

	// 사용자가 입력한 내용으로 새로운 장보기를 만드는 함수
	@Transactional
	public void createShopping(ShoppingCreateRequestDto createRequestDto) {
		// 미션을 먼저 생성해야 함
		ObjectId missionId = missionService.addShoppingMission(createRequestDto);

		try{
			if(!createRequestDto.validate()){
				throw new BadRequestException();
			}

			Shopping shopping = Shopping.builder()
				.parentId(createRequestDto.getParentId())
				.childId(createRequestDto.getChildId())
				.startPoint(createRequestDto.getStartPoint())
				.destination(createRequestDto.getDestination())
				.route(createRequestDto.getRoute())
				.shoppingList(createRequestDto.getShoppingList().stream()
					.map(barcodeItem -> {
						// 바코드 값만 들어온 request를 실제 상품 값으로 조회해서 저장
						ProductDto productDto = searchProductByBarcode(barcodeItem.getBarcode());

						return Product.builder()
							.barcode(barcodeItem.getBarcode())
							.quantity(barcodeItem.getQuantity())
							.productName(productDto.getProductName())
							.category(productDto.getCategory())
							.image(productDto.getImage())
							.cartItem(null)
							.build();
					}).collect(Collectors.toList()))
				// 매핑되는 미션을 포함해서 저장해야 함
				.missionId(missionId.toString())
				.build();

			Shopping savedShopping = shoppingRepository.save(shopping);

			try{
				missionService.allocateShoppingMission(missionId, savedShopping.getId());
			}catch(Exception e){
				// 미션에 할당 실패시 다 삭제 해야 함
				shoppingRepository.delete(savedShopping);
				throw e;
			}
		}catch(Exception e){
			// 장보기 생성하다 오류 발생시 미션도 삭제한다 ( 일관성 )
			missionService.deleteMission(missionId);
			throw e;
		}

	}

	// 장바구니에 상품 담기
	@Transactional
	public void addProductToShopping(AddProductToCartRequestDto addProductToCartRequestDto) {
		ProductDto productDto = searchProductByBarcode(addProductToCartRequestDto.getBarcode());

		// CartItem 생성
		CartItem cartItem = CartItem.builder()
			.barcode(addProductToCartRequestDto.getBarcode())
			.quantity(addProductToCartRequestDto.getQuantity())
			.productName(productDto.getProductName())
			.category(productDto.getCategory())
			.image(productDto.getImage())
			.comment(addProductToCartRequestDto.getComment())
			.build();
		// 삽입
		shoppingRepository.insertCartItemById(new ObjectId(addProductToCartRequestDto.getShoppingId()),
			addProductToCartRequestDto.getListBarcode(), cartItem);
	}

	// 상품 수량 변경
	@Transactional
	public void changeQuantityOfCartItem(ChangeQuantityRequestDto changeQuantityRequestDto){
		shoppingRepository.changeQuantityOfCartItem(new ObjectId(changeQuantityRequestDto.getShoppingId()), changeQuantityRequestDto.getBarcode(), changeQuantityRequestDto.getQuantity());
	}

	// 장바구니에서 상품 빼기
	@Transactional
	public void deleteProductFromShopping(DeleteProductFromCartRequestDto deleteProductFromCartRequestDto){
		// 삭제 수행
		shoppingRepository.deleteCartItemById(new ObjectId(deleteProductFromCartRequestDto.getShoppingId()), deleteProductFromCartRequestDto.getBarcode());
	}

	// 이름 기반 상품 검색
	public List<ProductDto> searchProductByName(ProductNameSearchDto productNameSearchDto){
		String itemName = productNameSearchDto.getItemName();
		Pageable pageable = PageRequest.of(productNameSearchDto.getPage(), productNameSearchDto.getSize());
		// elasticsearch 검색
		// Page<ProductDocument> pages = productRepository.findByNameContaining(itemName, pageable);
		Page<ProductDocument> pages = productRepository.searchByName(itemName, pageable);
		// 결과
		List<ProductDto> productDtoList = new ArrayList<>();
		for(ProductDocument product : pages) {
			// DTO로 변환
			productDtoList.add(ProductDto.builder()
					.barcode(product.getNumber().toString())
					.productName(product.getName())
					.category(product.getCategory())
					.image(product.getImage())
					.build());
		}
		return productDtoList;
	}

	// 바코드 기반 단일 상품 검색
	public ProductDto searchProductByBarcode(String barcode) {
		Optional<ProductDocument> productOptional = productRepository.findById(barcode);
		if(productOptional.isPresent()){
			// DTO 변환
			return ProductDto.builder()
				.barcode(productOptional.get().getNumber().toString())
				.productName(productOptional.get().getName())
				.category(productOptional.get().getCategory())
				.image(productOptional.get().getImage())
				.build();
		}
		else{
			return null;
		}


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
		ProductDto originProduct = searchProductByBarcode(productCompareRequestDto.getOriginBarcode());
		// 입력 바코드 정보 확인
		ProductDto inputProduct = searchProductByBarcode(productCompareRequestDto.getOriginBarcode());

		ProductCompareResponseDto productCompareResponseDto = new ProductCompareResponseDto();
		if(originProduct.getBarcode().equals(inputProduct.getBarcode())) {
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

		return productCompareResponseDto;
	}

	public String compareMessage(ProductCompareResponseDto productCompareResponseDto){
		if(productCompareResponseDto.getMatchStatus().equals("MATCH")){
			return "상품 일치";
		}else if(productCompareResponseDto.getMatchStatus().equals("NOT_MATCH")){
			return "상품 불일치";
		}else{
			return "상품 유사";
		}
	}


	// Redis에 현재 아이 위치 저장
	public void saveChildPoint(ChildPointDto childPointDto) {
		redisTemplate.opsForHash().put(childPointDto.getShoppingId(), "latitude", childPointDto.getLatitude().toString());
		redisTemplate.opsForHash().put(childPointDto.getShoppingId(), "longitude", childPointDto.getLongitude().toString());

		System.out.println(childPointDto.getLatitude().toString());
	}

	// 장보기 완료 처리
	// 1. 장보기 미션의 상태를 PENDING으로 변경
	// 2. 그에 따른 알림 생성
	// 3. FCM 메세지 보내기
	@Transactional
	public void completeShopping(String shoppingId){
		Optional<Shopping> shoppingOptional = shoppingRepository.findById(shoppingId);
		if(shoppingOptional.isPresent()) {
			Shopping shopping = shoppingOptional.get();

			// 미션의 상태를 변경
			ObjectId missionId = new ObjectId(shopping.getMissionId());
			missionService.setMissionStatusPending(missionId);

			// 그에 따른 알림
			notificationService.addNotificationIfShoppingEnd(shopping);

			// FCM 가능?;;
		}
	}
}
