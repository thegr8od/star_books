package com.starbooks.backend.radio.controller;

import com.starbooks.backend.radio.dto.request.EmojiMessage;
import com.starbooks.backend.radio.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class EmojiController {

    private final WebSocketService webSocketService;

    @MessageMapping("/emoji/send")
    public void handleEmoji(@Payload EmojiMessage message, Principal principal) {
        webSocketService.broadcastEmoji(
                message.getRoomId(),
                principal.getName(),
                message.getEmojiCode()
        );
    }
}
