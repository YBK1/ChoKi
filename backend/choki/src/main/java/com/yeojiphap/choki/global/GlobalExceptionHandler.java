package com.yeojiphap.choki.global;

import com.yeojiphap.choki.domain.character.exception.AnimalNotFoundException;
import com.yeojiphap.choki.domain.collected.exception.AnimalAlreadyExistException;
import com.yeojiphap.choki.domain.user.exception.InvalidUserRoleException;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.global.auth.exception.ExpiredRefreshTokenException;
import com.yeojiphap.choki.global.auth.exception.InvalidRefreshTokenException;
import com.yeojiphap.choki.global.auth.exception.NotFoundRefreshTokenException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //400 - Bad Request
    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ApiResponse<Void> handleInvalidRefreshTokenException(InvalidRefreshTokenException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(ExpiredRefreshTokenException.class)
    public ApiResponse<Void> handleExpiredRefreshTokenException(ExpiredRefreshTokenException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(AnimalAlreadyExistException.class)
    public ApiResponse<Void> handleAnimalAlreadyExistException(AnimalAlreadyExistException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    // 403 - Forbidden
    @ExceptionHandler(InvalidUserRoleException.class)
    public ApiResponse<Void> handleInvalidUserRoleException(InvalidUserRoleException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    // 404 - Not Found
    @ExceptionHandler(UserNotFoundException.class)
    public ApiResponse<Void> handleUserNotFoundException(UserNotFoundException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(NotFoundRefreshTokenException.class)
    public ApiResponse<Void> handleNotFoundRefreshTokenException(NotFoundRefreshTokenException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(AnimalNotFoundException.class)
    public ApiResponse<Void> handleAnimalNotFoundException(AnimalNotFoundException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }
}
