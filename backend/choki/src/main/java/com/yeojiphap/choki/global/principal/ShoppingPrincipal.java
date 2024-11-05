package com.yeojiphap.choki.global.principal;

import java.security.Principal;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShoppingPrincipal implements Principal {
	private final String id;
	private final String shoppingId;

	// 필수 함수라서 뺼 수는 없고.. 일단 id 반환하게 두긴 하자
	@Override
	public String getName() {
		return id;
	}
}

