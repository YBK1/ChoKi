package com.yeojiphap.choki.domain.user.domain;

import com.yeojiphap.choki.domain.family.domain.Family;
import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    private String userPassword;

    private String nickname;

    private String address;

    private Double latitude;

    private Double longitude;

    private String name;

    private String tel;

    private Role role;

    private int level;

    private int exp;

    private int pastLevel;

    private Long mainAnimal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private Family family;
}
