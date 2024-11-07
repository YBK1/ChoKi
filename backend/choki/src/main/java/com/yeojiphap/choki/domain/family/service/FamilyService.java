package com.yeojiphap.choki.domain.family.service;

import com.yeojiphap.choki.domain.family.domain.Family;
import com.yeojiphap.choki.domain.family.dto.ChildrenResponseDto;
import com.yeojiphap.choki.domain.family.exception.InvalidInviteCodeException;
import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.family.dto.InviteCodeDto;
import com.yeojiphap.choki.domain.user.exception.InvalidUserRoleException;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.family.repository.FamilyRepository;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.yeojiphap.choki.domain.family.message.FamilySuccessMessage.*;

@Service
@RequiredArgsConstructor
public class FamilyService {

    private final UserRepository userRepository;
    private final FamilyRepository familyRepository;

    public InviteCodeDto createFamily() {
        User user = findCurrentUser();

        Family family = Family.createWithInviteCode();
        familyRepository.save(family);

        user.assignFamily(family);
        userRepository.save(user);

        return new InviteCodeDto(family.getInviteCode());
    }

    public InviteCodeDto getInviteCode() {
        Family family = familyRepository.findByUsers_UserId((SecurityUtil.getCurrentUserId())).orElseThrow();
        return new InviteCodeDto(family.getInviteCode());
    }

    public String acceptInviteCode(InviteCodeDto request) {
        String inviteCode = request.inviteCode();

        Family family = familyRepository.findByInviteCode(inviteCode).orElseThrow(InvalidInviteCodeException::new);
        User user = findCurrentUser();
        user.assignFamily(family);
        userRepository.save(user);

        return FAMILY_ASSIGN_SUCCESS.getMessage();
    }

    public List<ChildrenResponseDto> getChildInfoByFamilyId() {
        User user = findCurrentUser();

        if (!user.getRole().equals(Role.PARENT)) {
            throw new InvalidUserRoleException();
        }

        List<User> children = familyRepository.getChildren(user.getFamily().getId());

        return children.stream()
                .map(ChildrenResponseDto::from)
                .toList();
    }

    private User findCurrentUser() {
        return userRepository.findByUserId(SecurityUtil.getCurrentUserId())
                .orElseThrow(UserNotFoundException::new);
    }
}
