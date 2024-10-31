package com.yeojiphap.choki.domain.chore.domain;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;
import org.springframework.data.elasticsearch.annotations.WriteOnlyProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(indexName = "alcohols")
@Setting(replicas = 0)
public class ProductDocument {
	@Id
	private String id;

	@Field(type = FieldType.Long, index = false, docValues = false)
	private Long number;

	// 검색이 필요한 필드는 text + nori
	@Field(type = FieldType.Text, analyzer = "nori")
	private String name;

	// 검색이 필요 없고 단순 저장용이면 keyword
	@Field(type = FieldType.Keyword, index = false, docValues = false)
	private String image;

	@Field(type = FieldType.Keyword, index = false, docValues = false)
	private String category;
}
