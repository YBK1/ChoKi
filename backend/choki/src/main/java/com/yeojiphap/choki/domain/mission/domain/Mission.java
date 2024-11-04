package com.yeojiphap.choki.domain.mission.domain;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "mission")
@Getter
@Builder
@AllArgsConstructor
public class Mission {
    @Id
    private ObjectId id;

    private Long parentId;

    private Long childId;

    private String content;

    private int exp;

    private Status status;

    private String completedAt;

    private String afterImg;

    private MissionType missionType;

    private String comment;
}
