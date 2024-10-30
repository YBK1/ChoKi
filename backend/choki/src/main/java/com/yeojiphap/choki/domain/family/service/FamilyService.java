package com.yeojiphap.choki.domain.family.service;

import com.yeojiphap.choki.domain.family.domain.Family;
import com.yeojiphap.choki.domain.family.dto.response.ChildDetailDto;
import com.yeojiphap.choki.domain.family.repository.FamilyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FamilyService {
    private final FamilyRepository familyRepository;

    public List<ChildDetailDto> getChildInfoUsingFamilyId(Long familyId) {
//         Exception, ResponseVO 추가 필요
        Family family = familyRepository.findById(familyId)
                .orElse(null);

        return family.getUsers().stream()
                .map(user -> ChildDetailDto.builder()
                        .childId(user.getId())
                        .name(user.getName())
                        .level(user.getLevel())
                        .address(user.getAddress())
                        .build())
                .toList();
    }
}
