package com.yeojiphap.choki.domain.collected.controller;

import com.yeojiphap.choki.domain.collected.service.CollectedService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.yeojiphap.choki.domain.collected.message.CollectedSuccessMessage.*;

@RestController
@RequestMapping("/api/collected")
@RequiredArgsConstructor
public class CollectedController {
    private final CollectedService collectedService;

    @GetMapping("/animal")
    public ApiResponse getCollectedAnimals() {
        return ApiResponse.success(HttpStatus.OK, collectedService.getCollectedAnimals(), COLLECTED_SEARCH_MESSAGE.getMessage());
    }
}
