package org.example.nezai.dto.ollama;

public class OllamaMessage {

    private String role;
    private String content;

    public OllamaMessage() {
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}