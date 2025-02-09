package com.starbooks.backend.chatbot.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.starbooks.backend.chatbot.service.ChatService;
import com.starbooks.backend.chatbot.dto.ChatRequest;
import com.starbooks.backend.chatbot.repository.ChatHistoryRepository.ChatMessage;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<String> chat(@RequestBody ChatRequest request) {
        log.debug("🔹 [ChatController] 요청된 사용자: {}, 페르소나: {}",
                request.getEmail(), request.getPersona());

        // 새로 추가된 persona 정보도 넘겨준다
        String response = chatService.chatWithGPT(
                request.getEmail(),
                request.getMessage(),
                request.getPersona()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@RequestParam String email) {
        log.debug("🔹 [ChatController] 채팅 기록 조회 요청: {}", email);

        List<ChatMessage> history = chatService.getChatHistory(email);
        return ResponseEntity.ok(history);
    }
}
