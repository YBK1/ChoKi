package com.yeojiphap.choki.domain.chore.domain;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Document(collection = "chore")
@Getter
@Builder
@AllArgsConstructor
public class Chore {
	@Id
	private ObjectId id;
	private Building startPoint;
	private Building destination;
}
