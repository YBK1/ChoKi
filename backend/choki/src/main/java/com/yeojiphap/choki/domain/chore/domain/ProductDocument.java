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

	@Field(type = FieldType.Text, analyzer = "nori")
	private String name;

	@Field(type = FieldType.Text, index = false, docValues = false)
	private String image;

	@Field(type = FieldType.Text, index = false, docValues = false)
	private String category;
}
