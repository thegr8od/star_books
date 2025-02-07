package com.starbooks.backend.chatbot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.starbooks.backend.chatbot.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<String> chat(@RequestParam String email, @RequestParam String message) {
        String response = chatService.chatWithGPT(email, message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<String>> getChatHistory(@RequestParam String email) {
        return ResponseEntity.ok(chatService.getChatHistory(email));
    }
}
