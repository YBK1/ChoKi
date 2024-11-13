package com.yeojiphap.choki.domain.user.domain;

import com.yeojiphap.choki.domain.family.domain.Family;
import jakarta.persistence.*;
import lombok.*;

import static com.yeojiphap.choki.domain.user.domain.EXP.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "member")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

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
    public User(String username, String userPassword, String nickname, String address, Double latitude, Double longitude, String name, String tel, Role role) {
        this.username = username;
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

    public void updatePastLevel(int pastLevel) {
        this.pastLevel = pastLevel;
    }

    public void increaseExperience(int amount) {
        this.exp += amount;
        if (this.exp >= MAX_EXP.getExp()) {
            this.exp -= MAX_EXP.getExp();
            this.level++;
        }
    }
}
