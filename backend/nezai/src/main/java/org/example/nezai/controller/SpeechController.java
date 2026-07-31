package org.example.nezai.controller;

import org.example.nezai.dto.SpeechResponse;
import org.example.nezai.service.SpeechService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/speech")
@CrossOrigin(origins = "http://localhost:5173")
public class SpeechController {

    private final SpeechService speechService;

    public SpeechController(SpeechService speechService) {
        this.speechService = speechService;
    }

    @PostMapping(value = "/transcribe", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public SpeechResponse transcribe(@RequestPart("audio") MultipartFile audio) {
        return new SpeechResponse(speechService.transcribe(audio));
    }
}
