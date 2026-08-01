package org.example.nezai.service;

import org.example.nezai.dto.ChatResponse;
import org.example.nezai.dto.ChatMessage;
import org.example.nezai.service.ollama.OllamaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private final OllamaService ollamaService;
    private final PdfService pdfService;

    public ChatService(OllamaService ollamaService, PdfService pdfService) {
        this.ollamaService = ollamaService;
        this.pdfService = pdfService;
    }

    public ChatResponse chat(String conversationId, List<ChatMessage> history, List<MultipartFile> images, MultipartFile pdf, boolean think, boolean stream) {
        if (history == null || history.isEmpty()) {
            throw new IllegalArgumentException("Conversation history must contain at least one message.");
        }

        if (pdf != null && !pdf.isEmpty()) {
            pdfService.cachePdf(conversationId, pdf);
        }

        ChatMessage latestUserMessage = history.getLast();
        if ("user".equals(latestUserMessage.getRole())) {
            String userPrompt = latestUserMessage.getContent();
            if (pdf != null && !pdf.isEmpty()) {
                latestUserMessage.setContent(pdfService.preparePdfContext(conversationId, pdf, userPrompt));
            }
        }

        if (images != null) {
            images.stream()
                    .filter(image -> image != null && !image.isEmpty())
                    .forEach(image -> logger.info("Image received: {}", image.getOriginalFilename()));
        }

        String reply = ollamaService.ask(history, images, think, stream);

        return new ChatResponse(reply);
    }
}
