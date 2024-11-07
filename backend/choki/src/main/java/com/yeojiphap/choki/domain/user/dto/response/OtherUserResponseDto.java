package com.yeojiphap.choki.domain.user.dto.response;

import com.yeojiphap.choki.domain.collected.domain.Collected;
import com.yeojiphap.choki.domain.user.domain.User;

import java.util.List;

public record OtherUserResponseDto (Long id, String nickname, String address, String name, int level, Long mainAnimalId, List<Long> animals) {
    public static OtherUserResponseDto from(User user, List<Collected> animalList) {
        return new OtherUserResponseDto(
                user.getId(),
                user.getNickname(),
                getShortAddress(user.getAddress()),
                user.getName(),
                user.getLevel(),
                user.getMainAnimal(),
                animalList.stream()
                        .map(collected -> collected.getAnimal().getId())
                        .toList()
        );
    }

    // 제한된 주소를 보여주는 메서드
    private static String getShortAddress(String address) {
        String[] totalAddress = address.split(" ");

        if (totalAddress.length >= 3) {
            return totalAddress[0] + " " + totalAddress[1] + " " + totalAddress[2];
        } else {
            return address;
        }
    }
}
