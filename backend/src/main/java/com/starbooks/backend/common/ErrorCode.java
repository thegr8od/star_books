package com.starbooks.backend.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Internal Server Error
    INTERNAL_SERVER_ERROR("C001", HttpStatus.INTERNAL_SERVER_ERROR, "서버에 오류가 발생했습니다."),
    NOT_FOUND_API_URL("C002", HttpStatus.NOT_FOUND, "요청한 API url을 찾을 수 없습니다."),
    RESOURCE_NOT_FOUND("C003", HttpStatus.NOT_FOUND, "요청한 리소스를 찾을 수 없습니다."),
    ACCESS_DENIED("C004", HttpStatus.FORBIDDEN, "접근이 거부되었습니다."),

    // User Error
    USER_REGISTER_FAILED("U001", HttpStatus.BAD_REQUEST, "사용자 등록에 실패했습니다."),
    USER_NOT_FOUND("U002", HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    PASSWORD_NOT_MATCH("U003", HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다."),
    USER_NOT_AUTHORIZED("U004", HttpStatus.FORBIDDEN, "해당 작업을 수행할 권한이 없습니다."),
    EMAIL_CODE_NOT_MATCH("U005", HttpStatus.BAD_REQUEST, "인증 코드가 일치하지 않습니다."),
    USER_DELETE_FAILED("U006", HttpStatus.BAD_REQUEST, "회원 탈퇴에 실패했습니다."),
    TEMP_USER_NOT_FOUND("U007", HttpStatus.NOT_FOUND, "임시 사용자를 찾을 수 없습니다."),
    OAUTH_CODE_NOT_FOUND("U008", HttpStatus.NOT_FOUND, "OAuth 코드를 찾을 수 없습니다."),
    ALREADY_EXIST_PHONE_NUMBER("U009", HttpStatus.BAD_REQUEST, "이미 존재하는 전화번호입니다."),
    USER_UPDATE_FAILED("U010", HttpStatus.BAD_REQUEST, "사용자 정보 업데이트에 실패했습니다."),
    EMAIL_ALREADY_EXIST("U011", HttpStatus.BAD_REQUEST, "이미 존재하는 이메일입니다."),

    // Email Error
    EMAIL_SEND_FAIL("E001", HttpStatus.BAD_REQUEST, "이메일 전송에 실패했습니다."),
    PASSWORD_RESET_TOKEN_NOT_VALID("E002", HttpStatus.BAD_REQUEST, "비밀번호 재설정 토큰이 유효하지 않습니다."),

    // JWT Error
    INVALID_JWT_TOKEN("J001", HttpStatus.UNAUTHORIZED, "유효하지 않은 JWT 토큰입니다."),
    TOKEN_EXPIRED("J002", HttpStatus.UNAUTHORIZED, "만료된 JWT 토큰입니다."),
    REFRESH_TOKEN_BLACKLISTED("J003", HttpStatus.UNAUTHORIZED, "이미 로그아웃 처리된 리프레시 토큰입니다."),

    // Universe (Personal Univ) Error
    UNIVERSE_NOT_FOUND("U100", HttpStatus.NOT_FOUND, "해당 유니버스를 찾을 수 없습니다."),
    UNIVERSE_SAVE_FAILED("U101", HttpStatus.BAD_REQUEST, "유니버스 저장에 실패했습니다."),
    UNIVERSE_UPDATE_FAILED("U102", HttpStatus.BAD_REQUEST, "유니버스 업데이트에 실패했습니다."),
    UNIVERSE_DELETE_FAILED("U103", HttpStatus.BAD_REQUEST, "유니버스 삭제에 실패했습니다.");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
