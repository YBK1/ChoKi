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

    @Enumerated(EnumType.STRING)
    private Role role;

    private int level = 1;

    private int exp = 0;

    private int pastLevel = 1;

    private Long mainAnimal = 21L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private Family family;

    @Builder
    public User(String userId, String userPassword, String nickname, String address, Double latitude, Double longitude, String name, String tel, Role role) {
        this.userId = userId;
        this.userPassword = userPassword;
        this.nickname = nickname;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.tel = tel;
        this.role = role;
    }

    public void assignFamily(Family family) {
        this.family = family;
    }

    public void updateMainAnimal(Long mainAnimal) {
        this.mainAnimal = mainAnimal;
    }
}
