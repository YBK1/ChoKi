package com.yeojiphap.choki.global.principal;

import java.security.Principal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

public class ShoppingPrincipal implements Principal {
	private final String name;
	@Getter
	@Setter
	private String shoppingId;

	public ShoppingPrincipal(String name) {
		this.name = name;
	}

	@Override
	public String getName() {
		return name;
	}
}

