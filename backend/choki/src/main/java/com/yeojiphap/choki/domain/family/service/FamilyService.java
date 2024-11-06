package com.yeojiphap.choki.domain.family.service;

import com.yeojiphap.choki.domain.family.domain.Family;
import com.yeojiphap.choki.domain.family.dto.ChildResponseDto;
import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.family.dto.InviteCodeResponse;
import com.yeojiphap.choki.domain.user.exception.InvalidUserRoleException;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.family.repository.FamilyRepository;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FamilyService {

    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;

    public InviteCodeResponse createFamily() {
        User user = findCurrentUser();

        Family family = Family.createWithInviteCode();
        familyRepository.save(family);

        user.assignFamily(family);
        userRepository.save(user);

        return new InviteCodeResponse(family.getInviteCode());
    }

    public InviteCodeResponse getInviteCode() {
        Family family = familyRepository.findByUsers_UserId((SecurityUtil.getCurrentUserId())).orElseThrow();
        return new InviteCodeResponse(family.getInviteCode());
    }

    private User findCurrentUser() {
        return userRepository.findByUserId(SecurityUtil.getCurrentUserId())
                .orElseThrow(UserNotFoundException::new);
    }

    public List<ChildResponseDto> getChildInfoByFamilyId() {
        User user = findCurrentUser();

        if (user == null) {
            throw new UserNotFoundException();
        }

        if (!user.getRole().equals(Role.PARENT)) {
            throw new InvalidUserRoleException();
        }

        List<User> children = familyRepository.getChildren(user.getFamily().getId());

        return children.stream()
                .map(ChildResponseDto::from)
                .toList();
    }
}
