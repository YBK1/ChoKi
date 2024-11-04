package com.yeojiphap.choki.global.auth.util;

import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.global.auth.dto.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();
            return user.getUsername();
        }
        throw new UserNotFoundException();
    }
}