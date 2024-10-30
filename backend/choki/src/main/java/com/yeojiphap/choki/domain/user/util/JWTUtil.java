package com.yeojiphap.choki.domain.user.util;

import com.yeojiphap.choki.domain.user.exception.InvalidTokenException;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

import io.jsonwebtoken.Jwts;

@Component
public class JWTUtil {
    private final RedisTemplate redisTemplate;
    private SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret, @Qualifier("redisTemplate") RedisTemplate redisTemplate) {
        secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        this.redisTemplate = redisTemplate;
    }

    public Long getIdFromToken(String token) {
        try {
            return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("id", Long.class);
        } catch (JwtException e) {
            // 유효하지 않은 토큰인 경우 예외 처리
            throw new InvalidTokenException();
        }
    }
}
