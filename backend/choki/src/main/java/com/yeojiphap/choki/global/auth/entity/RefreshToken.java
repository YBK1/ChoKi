package com.yeojiphap.choki.global.auth.entity;


import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@RedisHash(value = "refresh_token")
public class RefreshToken {
    @Id
    private String username;

    @Indexed
    private String refresh;

    @TimeToLive
    private Long expiration;

    @Builder
    public RefreshToken(String username, String refresh, Long expiration) {
        this.username = username;
        this.refresh = refresh;
        this.expiration = expiration;
    }
}
