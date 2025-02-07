package com.starbooks.backend.diary.exception;

public class NotFoundException extends RuntimeException {

    // 기본 생성자 (선택 사항)
    public NotFoundException() {
        super();
    }

    // 메시지를 받는 생성자 (필수)
    public NotFoundException(String message) {
        super(message);
    }
}