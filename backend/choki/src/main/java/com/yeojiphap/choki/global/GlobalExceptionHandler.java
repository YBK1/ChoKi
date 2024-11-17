package com.yeojiphap.choki.global;

import com.yeojiphap.choki.domain.character.exception.AnimalNotFoundException;
import com.yeojiphap.choki.domain.collected.exception.AllAnimalsOwnedException;
import com.yeojiphap.choki.domain.collected.exception.AnimalAlreadyExistException;
import com.yeojiphap.choki.domain.mission.exception.MissionNotFoundException;
import com.yeojiphap.choki.domain.notification.exception.NotificationNotFoundException;
import com.yeojiphap.choki.domain.shopping.exception.BadRequestException;
import com.yeojiphap.choki.domain.shopping.exception.ProductNotFoundException;
import com.yeojiphap.choki.domain.shopping.exception.ShoppingNotFoundException;
import com.yeojiphap.choki.domain.family.exception.ChildNotExistException;
import com.yeojiphap.choki.domain.family.exception.FamilyNotFoundException;
import com.yeojiphap.choki.domain.family.exception.InvalidInviteCodeException;
import com.yeojiphap.choki.domain.map.exception.RouteNotFoundException;
import com.yeojiphap.choki.domain.user.exception.InvalidUserRoleException;
import com.yeojiphap.choki.domain.user.exception.UserIdDuplicatedException;
import com.yeojiphap.choki.domain.user.exception.UserNotFoundException;
import com.yeojiphap.choki.global.auth.exception.ExpiredRefreshTokenException;
import com.yeojiphap.choki.global.auth.exception.InvalidRefreshTokenException;
import com.yeojiphap.choki.global.auth.exception.NotFoundRefreshTokenException;
import com.yeojiphap.choki.global.s3.S3UploadFailedException;

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

    @ExceptionHandler(AnimalNotFoundException.class)
    public ApiResponse<Void> handleAnimalNotFoundException(AnimalNotFoundException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(RouteNotFoundException.class)
    public ApiResponse<Void> handleGuidedRouteNotFoundException(RouteNotFoundException e) {
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

    @ExceptionHandler(AllAnimalsOwnedException.class)
    public ApiResponse<Void> handleAllAnimalsOwnedException(AllAnimalsOwnedException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    // 409 - Conflict
    @ExceptionHandler(UserIdDuplicatedException.class)
    public ApiResponse<Void> handleUserIdDuplicatedException(UserIdDuplicatedException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }
    @ExceptionHandler(BadRequestException.class)
    public ApiResponse<Void> handleNotFoundRefreshTokenException(BadRequestException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(ShoppingNotFoundException.class)
    public ApiResponse<Void> handleNotFoundRefreshTokenException(ShoppingNotFoundException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(S3UploadFailedException.class)
    public ApiResponse<Void> handleS3UploadFailedException(S3UploadFailedException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ApiResponse<Void> handleProductNotFoundException(ProductNotFoundException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(NotificationNotFoundException.class)
    public ApiResponse<Void> handleNotificationNotFoundException(NotificationNotFoundException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }

    @ExceptionHandler(MissionNotFoundException.class)
    public ApiResponse<Void> handleMissionNotFoundException(MissionNotFoundException e) {
        return ApiResponse.error(e.getStatus(), e.getMessage());
    }
}
