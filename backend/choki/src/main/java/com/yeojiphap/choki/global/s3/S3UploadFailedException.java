package com.yeojiphap.choki.global.s3;

import org.springframework.http.HttpStatus;

public class S3UploadFailedException extends RuntimeException {
	@Override
	public String getMessage() {
		return "이미지 등록에 실패했습니다.";
	}
	public HttpStatus getStatus() {
		return HttpStatus.INTERNAL_SERVER_ERROR;
	}
}
