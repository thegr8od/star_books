package com.starbooks.backend.exception;

import com.starbooks.backend.common.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;

@Getter
public class TokenExpiredException extends AuthenticationException {
    private final String errorCode;
    private final HttpStatus httpStatus;

    public TokenExpiredException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode.getCode();
        this.httpStatus = errorCode.getHttpStatus();
    }

    public TokenExpiredException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = ErrorCode.TOKEN_EXPIRED.getCode();
        this.httpStatus = ErrorCode.TOKEN_EXPIRED.getHttpStatus();
    }
}
