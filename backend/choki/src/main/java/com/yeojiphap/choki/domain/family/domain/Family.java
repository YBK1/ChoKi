package com.yeojiphap.choki.domain.family.domain;

import com.yeojiphap.choki.domain.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@AllArgsConstructor
@Builder
public class Family {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String inviteCode;

    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> users;

    public static Family createWithInviteCode() {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        String inviteCode = uuid.substring(0, 6).toUpperCase();
        return Family.builder().inviteCode(inviteCode).build();
    }
}
