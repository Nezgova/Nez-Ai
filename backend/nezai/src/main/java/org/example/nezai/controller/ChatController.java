package org.example.nezai.controller;

import org.example.nezai.dto.ChatResponse;
import org.example.nezai.service.ChatService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping(value = "/chat", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ChatResponse chat(
            @RequestPart("message") String message,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "pdf", required = false) MultipartFile pdf
    ) {

        return chatService.chat(message, image, pdf);

    }

}