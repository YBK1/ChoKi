package com.yeojiphap.choki.domain.user.service;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class FamilyService {
    private String generateInviteCode() {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        return uuid.substring(0, 6).toUpperCase();
    }
}
