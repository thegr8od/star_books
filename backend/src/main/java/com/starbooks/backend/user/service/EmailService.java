package com.starbooks.backend.user.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("비밀번호 재설정 요청");
        message.setText("아래 링크를 클릭하여 비밀번호를 재설정하세요:\n" + resetLink);
        message.setFrom("ehdgus9370@gmail.com"); // 본인 이메일로 변경
        mailSender.send(message);
    }
}
