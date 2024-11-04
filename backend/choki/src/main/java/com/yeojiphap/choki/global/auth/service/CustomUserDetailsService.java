package com.yeojiphap.choki.global.auth.service;

import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.user.dto.UserDto;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.global.auth.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(username).orElseThrow(UserNotFoundException::new);
        return new CustomUserDetails(UserDto.from(user));
    }
}
