package com.yeojiphap.choki.domain.character.exception;

import com.yeojiphap.choki.domain.user.exception.UserExceptionMessage;
import org.springframework.http.HttpStatus;

public class AnimalNotFoundException extends RuntimeException {
  @Override
  public String getMessage() {
    return AnimalExceptionMessage.ANIMAL_NOT_FOUND.getMessage();
  }
  public HttpStatus getStatus() {
    return AnimalExceptionMessage.ANIMAL_NOT_FOUND.getStatus();
  }
}
