package org.example.nezai.dto;

public class ChatMessage {

    private String role;
    private String content;
    private boolean hasImage;

    public ChatMessage() {
    }

    public ChatMessage(String role, String content, boolean hasImage) {
        this.role = role;
        this.content = content;
        this.hasImage = hasImage;
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

    public boolean isHasImage() {
        return hasImage;
    }

    public void setHasImage(boolean hasImage) {
        this.hasImage = hasImage;
    }
}
