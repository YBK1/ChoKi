package com.yeojiphap.choki.domain.shopping.service;

import java.time.Duration;

import org.bson.types.ObjectId;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.yeojiphap.choki.domain.notification.service.NotificationService;
import com.yeojiphap.choki.domain.shopping.domain.Shopping;
import com.yeojiphap.choki.domain.shopping.dto.AddProductToCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ProductCompareRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.AddProductToCartResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.ChangeQuantityRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.ChildPointDto;
import com.yeojiphap.choki.domain.shopping.dto.DeleteProductFromCartRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.HelpMessageDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.ChangeQuantityResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.DangerRequestDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.DangerResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.DeleteProductFromCartResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.ExceptionDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.FinishShoppingResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.HelpMessageResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.PointResponseDto;
import com.yeojiphap.choki.domain.shopping.dto.websocketDto.ShoppingResponseDto;
import com.yeojiphap.choki.domain.shopping.exception.UnauthorizedRoleException;
import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.auth.jwt.JWTUtil;
import com.yeojiphap.choki.global.principal.ShoppingPrincipal;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShoppingWebSocketService {
	private final SimpMessagingTemplate simpMessagingTemplate;
	private final ShoppingService shoppingService;
	private final UserService userService;
	private final NotificationService notificationService;
	private final RedisTemplate<String, Object> redisTemplate;
	private final JWTUtil jwtUtil;

	// 아이의 장보기 시작 메소드
	public void startShopping(String shoppingId, String access){
		String username = jwtUtil.getUsername(access);
		User currentUser = userService.findByUsername(username);
		Shopping shopping = shoppingService.getShoppingById(new ObjectId(shoppingId));

		// 현재 연결 중인 shoppingId 정보를 레디스에 저장
		redisTemplate.opsForValue().set(username, shoppingId);

		Double latitude = null;
		Double longitude = null;

		// 아이가 시작한 경우에만 알림이 가도록 해야 한다.
		if(currentUser.getRole() == Role.CHILD){
			// 시작점 초기 세팅 수행
			latitude = shopping.getStartPoint().getLatitude();
			redisTemplate.opsForHash().put(shoppingId, "latitude", latitude.toString());
			longitude = shopping.getStartPoint().getLongitude();
			redisTemplate.opsForHash().put(shoppingId, "longitude", longitude.toString());

			// 알림 추가
			notificationService.addNotificationFromShopping(shopping);
			// FCM 보내야겠지?
		}
		// 부모가 시작한 경우라면 아이의 현재 위치를 시작과 동시에 보내줘야 함
		else{
			String latitudeStr = (String) redisTemplate.opsForHash().get(shoppingId, "latitude");
			String longitudeStr = (String) redisTemplate.opsForHash().get(shoppingId, "longitude");

			latitude = latitudeStr != null ? Double.parseDouble(latitudeStr) : null;
			longitude = longitudeStr != null ? Double.parseDouble(longitudeStr) : null;

			PointResponseDto point = PointResponseDto.builder()
				.latitude(latitude)
				.longitude(longitude)
				.build();

			if(latitude == null && longitude == null){
				simpMessagingTemplate.convertAndSendToUser(username, "/sub/shopping/" + shoppingId, "아직 장보기를 시작하지 않았습니다.");
			}
			else simpMessagingTemplate.convertAndSendToUser(username,"/sub/shopping/" + shoppingId, point);
		}

		System.out.println(username);
		// 그리고 장바구니 정보도 보내야 함
		simpMessagingTemplate.convertAndSendToUser(username, "/sub/shopping/" + shoppingId, new ShoppingResponseDto(shopping));
	}

	// 장바구니에 상품을 담았음을 전송
	public void sendAddProductMessage(AddProductToCartRequestDto addProductToCartRequestDto, String access) {
		// ResponseDto로 변환
		AddProductToCartResponseDto addProductToCartResponseDto = new AddProductToCartResponseDto(addProductToCartRequestDto);
		addProductToCartResponseDto.setStatus(
			shoppingService.compareBarcode(
				new ProductCompareRequestDto(addProductToCartRequestDto.getListBarcode(),
					addProductToCartResponseDto.getBarcode()))
				.getMatchStatus());

		simpMessagingTemplate.convertAndSendToUser(getParentUserName(access),"/sub/shopping/" + addProductToCartRequestDto.getShoppingId(), addProductToCartResponseDto);
	}

	// 장바구니에서 상품 수량 변경 전송
	public void sendChangeQuantityMessage(ChangeQuantityRequestDto changeQuantityRequestDto, String access) {
		ChangeQuantityResponseDto changeQuantityResponseDto = new ChangeQuantityResponseDto(changeQuantityRequestDto);

		simpMessagingTemplate.convertAndSendToUser(getParentUserName(access), "/sub/shopping/" + changeQuantityRequestDto.getShoppingId(), changeQuantityResponseDto);
	}

	// 장바구니에서 상품을 제거했음을 전송
	public void sendDeleteProductMessage(DeleteProductFromCartRequestDto deleteProductFromCartRequestDto, String access) {
		DeleteProductFromCartResponseDto deleteProductFromCartResponseDto = new DeleteProductFromCartResponseDto(deleteProductFromCartRequestDto);

		simpMessagingTemplate.convertAndSendToUser(getParentUserName(access), "/sub/shopping/" + deleteProductFromCartRequestDto.getShoppingId(),
			deleteProductFromCartResponseDto);
	}

	// 아이의 위치를 전송
	public void sendChildPoint(ChildPointDto childPointDto, String access) {
		PointResponseDto pointResponseDto = new PointResponseDto(childPointDto);
		log.info(getParentUserName(access));
		simpMessagingTemplate.convertAndSendToUser(getParentUserName(access) ,"/sub/shopping/" + childPointDto.getShoppingId(), pointResponseDto);
	}

	// 위기 알림 메세지 전송
	public void sendDangerNotification(DangerRequestDto dangerRequestDto, String access){
		DangerResponseDto dangerResponseDto = new DangerResponseDto(dangerRequestDto);
		simpMessagingTemplate.convertAndSendToUser(getParentUserName(access), "/sub/shoppingId/" + dangerRequestDto.getShoppingId(), dangerResponseDto);
	}

	// 헬프 메시지 전송
	public void sendHelpMessage(HelpMessageDto helpMessageDto, String access) {
		// 부모의 username 가져오기
		String username = jwtUtil.getUsername(access);

		if(jwtUtil.getRole(access).equals("CHILD")){
			throw new UnauthorizedRoleException();
		}

		HelpMessageResponseDto helpMessageResponseDto = new HelpMessageResponseDto(helpMessageDto);

		// 이건 어쩔 수 없이 shopping에서 찾아서 전송해야 할듯..
		Shopping shopping = shoppingService.getShoppingById(new ObjectId(helpMessageDto.getShoppingId()));
		Long childId = shopping.getChildId();
		User user = userService.findById(childId);

		simpMessagingTemplate.convertAndSendToUser(user.getUsername(),"/sub/shopping/" + helpMessageDto.getShoppingId(), helpMessageResponseDto);
	}

	// 장보기 종료 메시지 전송
	public void sendFinishMessage(String shoppingId, String access){
		String message = "장보기가 종료되었습니다.";
		FinishShoppingResponseDto finishShoppingResponseDto = new FinishShoppingResponseDto(message);
		simpMessagingTemplate.convertAndSendToUser(getParentUserName(access), "/sub/shopping/" + shoppingId, finishShoppingResponseDto);
	}

	// 에러 발생시 메시지 전송
	public void sendErrorMessage(ShoppingPrincipal user, ExceptionDto exceptionDto){
		String shoppingId = (String) redisTemplate.opsForValue().get(user.getName());
		simpMessagingTemplate.convertAndSendToUser(user.getName(), "/sub/shopping/" + shoppingId, exceptionDto);
	}

	public String getParentUserName(String access){
		// 아이의 username 가져오기
		String username = jwtUtil.getUsername(access);

		if(jwtUtil.getRole(access).equals("PARENT")){
			throw new UnauthorizedRoleException();
		}

		// 부모의 username 조회..
		return userService.findParentUsernameByChildUsername(username);
	}

	// private MessageHeaders createHeaders(@Nullable String sessionId) {
	// 	SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
	// 	if (sessionId != null) headerAccessor.setSessionId(sessionId);
	// 	headerAccessor.setLeaveMutable(true);
	// 	return headerAccessor.getMessageHeaders();
	// }
}
