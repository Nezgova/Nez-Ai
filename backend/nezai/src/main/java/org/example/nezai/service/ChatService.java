package org.example.nezai.service;

import org.example.nezai.dto.ChatResponse;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    public ChatResponse chat(String message) {

        return new ChatResponse(
                "Hello! I am Nez AI. You said: " + message
        );

    }

}