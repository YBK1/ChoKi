package com.yeojiphap.choki.global;

import com.yeojiphap.choki.domain.family.exception.ChildNotExistException;
import com.yeojiphap.choki.domain.family.exception.FamilyNotFoundException;
import com.yeojiphap.choki.domain.family.exception.InvalidInviteCodeException;
import com.yeojiphap.choki.domain.map.exception.GuidedRouteNotFoundException;
import com.yeojiphap.choki.domain.user.exception.InvalidUserRoleException;
import com.yeojiphap.choki.domain.user.exception.UserIdDuplicatedException;
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

    @ExceptionHandler(InvalidInviteCodeException.class)
    public ApiResponse<Void> handleInvalidInviteCodeException(InvalidInviteCodeException e) {
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

    @ExceptionHandler(GuidedRouteNotFoundException.class)
    public ApiResponse<Void> handleGuidedRouteNotFoundException(GuidedRouteNotFoundException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(FamilyNotFoundException.class)
    public ApiResponse<Void> handleFamilyNotFoundException(FamilyNotFoundException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(ChildNotExistException.class)
    public ApiResponse<Void> handleChildNotExistException(ChildNotExistException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    // 409 - Conflict
    @ExceptionHandler(UserIdDuplicatedException.class)
    public ApiResponse<Void> handleUserIdDuplicatedException(UserIdDuplicatedException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }
}
