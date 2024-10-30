package com.yeojiphap.choki.domain.animal.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Animal {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Degree degree;

    private String enName;

    private String koName;

    private String animalImage;
}
