package com.yeojiphap.choki.domain.family.controller;

import com.yeojiphap.choki.domain.family.service.FamilyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class FamilyController {

    private final FamilyService familyService;

//    @GetMapping(value = "/family/{familyId}")
//    public ResponseEntity<?> getChildrenInfoByFamilyId(@PathVariable Long familyId) {
//        try {
//            familyService.getChildInfoUsingFamilyId(familyId);
//        } catch (Exception e) {
//             return
//        }
//        return
//    }
}
