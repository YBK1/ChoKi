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

// 만약 Spring으로 인덱스 생성부터 시작하고 싶다면 아래와 같은 어노테이션을 같이 써야한다
// json은 직접 만들어야 하고
// @Document(indexName = "product", createIndex = true)
// @Setting(settingPath = "/elasticsearch/settings/settings.json")
// @Mapping(mappingPath = "/elasticsearch/mappings/mappings.json")

@Getter
@Setter
@Document(indexName = "product")
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
