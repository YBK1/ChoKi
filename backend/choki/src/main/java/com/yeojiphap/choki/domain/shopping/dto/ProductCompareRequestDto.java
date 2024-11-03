package com.yeojiphap.choki.domain.shopping.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductCompareRequestDto {
    private Long originBarcode;
    private Long inputBarcode;
}
