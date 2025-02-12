package com.starbooks.backend.chatbot.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequest {
    private String email;
    private String message;
    private int persona;
}
