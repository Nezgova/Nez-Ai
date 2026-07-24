package org.example.nezai.dto.ollama;

public class OllamaResponse {

    private OllamaMessage message;

    public OllamaResponse() {
    }

    public OllamaMessage getMessage() {
        return message;
    }

    public void setMessage(OllamaMessage message) {
        this.message = message;
    }
}