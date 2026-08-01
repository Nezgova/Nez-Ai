package org.example.nezai.service;

import org.example.nezai.dto.ChatResponse;
import org.example.nezai.dto.ChatMessage;
import org.example.nezai.service.ollama.OllamaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.util.List;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private OllamaService ollamaService;

    @Mock
    private PdfService pdfService;

    @InjectMocks
    private ChatService chatService;

    @Test
    void shouldPassThinkPreferenceToOllamaForTextChats() {
        List<ChatMessage> history = List.of(
                new ChatMessage("user", "The secret word is pineapple.", false),
                new ChatMessage("assistant", "Got it.", false),
                new ChatMessage("user", "What is the secret word?", false)
        );
        when(ollamaService.ask(history, null, true, false)).thenReturn("reply");

        ChatResponse response = chatService.chat("conversation-1", history, null, null, true, false);

        assertEquals("reply", response.getReply());
        verify(ollamaService).ask(history, null, true, false);
    }

    @Test
    void shouldRoutePdfAttachmentsThroughPdfPipeline() {
        MultipartFile pdf = mock(MultipartFile.class);
        List<ChatMessage> history = List.of(new ChatMessage("user", "Summarize the attached PDF.", false));
        when(pdfService.preparePdfContext("conversation-1", pdf, "Summarize the attached PDF.")).thenReturn("PDF context");
        when(ollamaService.ask(history, null, true, false)).thenReturn("reply");

        ChatResponse response = chatService.chat("conversation-1", history, null, pdf, true, false);

        assertEquals("reply", response.getReply());
        verify(pdfService).preparePdfContext("conversation-1", pdf, "Summarize the attached PDF.");
        verify(ollamaService).ask(history, null, true, false);
    }
}
