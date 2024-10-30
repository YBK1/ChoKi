package com.yeojiphap.choki.domain.user.exception;

public class UserNotFoundException extends RuntimeException {
  @Override
  public String getMessage() {
    return UserNotFoundExceptionMessage.USER_NOT_FOUND.getMessage();
  }

  public int getStatus() {
    return UserNotFoundExceptionMessage.USER_NOT_FOUND.getStatus();
  }
}
