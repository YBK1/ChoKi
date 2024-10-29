package com.yeojiphap.choki.domain.user.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@AllArgsConstructor
@Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
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

    private String inviteCode;

    private int level;

    private int exp;

    private int pastLevel;

    private int mainCharacter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private Family family;
}
