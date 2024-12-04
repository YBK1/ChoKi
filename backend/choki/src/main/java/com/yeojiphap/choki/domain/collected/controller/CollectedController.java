package com.yeojiphap.choki.domain.collected.controller;

import com.yeojiphap.choki.domain.collected.service.CollectedService;
import com.yeojiphap.choki.global.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import static com.yeojiphap.choki.domain.collected.message.CollectedSuccessMessage.*;

@RestController
@RequestMapping("/api/collected")
@RequiredArgsConstructor
public class CollectedController implements SpringDocCollectedController {
    private final CollectedService collectedService;

    @GetMapping("/animal")
    public ApiResponse getCollectedAnimals() {
        return ApiResponse.success(HttpStatus.OK, collectedService.getCollectedAnimals(), COLLECTED_SEARCH_MESSAGE.getMessage());
    }

    @PutMapping("/animal/{animalId}/main")
    public ApiResponse updateMainAnimal(@PathVariable Long animalId) {
        return ApiResponse.success(HttpStatus.OK, collectedService.updateMainAnimal(animalId));
    }

    @PostMapping("/animal/draw")
    public ApiResponse drawRandomAnimal() {
        return ApiResponse.success(HttpStatus.OK, collectedService.drawRandomAnimal());
    }
}
