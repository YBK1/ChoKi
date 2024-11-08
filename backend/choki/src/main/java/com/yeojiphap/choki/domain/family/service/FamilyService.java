package com.yeojiphap.choki.domain.family.service;

import com.yeojiphap.choki.domain.family.domain.Family;
import com.yeojiphap.choki.domain.family.dto.ChildDetailResponseDto;
import com.yeojiphap.choki.domain.family.dto.ChildrenResponseDto;
import com.yeojiphap.choki.domain.family.exception.InvalidInviteCodeException;
import com.yeojiphap.choki.domain.user.domain.Role;
import com.yeojiphap.choki.domain.user.domain.User;
import com.yeojiphap.choki.domain.family.dto.InviteCodeDto;
import com.yeojiphap.choki.domain.user.exception.InvalidUserRoleException;
import com.yeojiphap.choki.domain.family.repository.FamilyRepository;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.domain.user.repository.UserRepository;
import com.yeojiphap.choki.domain.user.service.UserService;
import com.yeojiphap.choki.global.auth.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.yeojiphap.choki.domain.family.message.FamilySuccessMessage.*;

@Service
@RequiredArgsConstructor
public class FamilyService {

    private final UserService userService;
    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;

    public InviteCodeDto createFamily() {
        User user = userService.findCurrentUser();

        Family family = Family.createWithInviteCode();
        familyRepository.save(family);

        user.assignFamily(family);
        userService.saveUser(user);

        return new InviteCodeDto(family.getInviteCode());
    }

    public InviteCodeDto getInviteCode() {
        Family family = familyRepository.findByUsers_Username((SecurityUtil.getCurrentUsername())).orElseThrow();
        return new InviteCodeDto(family.getInviteCode());
    }

    public String acceptInviteCode(InviteCodeDto request) {
        String inviteCode = request.inviteCode();

        Family family = familyRepository.findByInviteCode(inviteCode).orElseThrow(InvalidInviteCodeException::new);
        User user = userService.findCurrentUser();
        user.assignFamily(family);
        userService.saveUser(user);

        return FAMILY_ASSIGN_SUCCESS.getMessage();
    }

    public List<ChildrenResponseDto> getChildInfoByFamilyId() {
        User user = userService.findCurrentUser();

        if (!user.getRole().equals(Role.PARENT)) {
            throw new InvalidUserRoleException();
        }

        List<User> children = familyRepository.getChildren(user.getFamily().getId());

        return children.stream()
                .map(ChildrenResponseDto::from)
                .toList();
    }

    public ChildDetailResponseDto getChildInfoByChildName(String childUsername) {
        User user = userRepository.findByUsername(childUsername).orElseThrow(UserNotFoundException::new);
        return ChildDetailResponseDto.from(user);
    }
}
