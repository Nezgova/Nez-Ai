package org.example.nezai.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Service
public class PdfService {
    private static final int CHUNK_SIZE = 1000;
    private static final int OVERLAP = 200;
    private final Map<String, List<String>> chunksByConversation = new ConcurrentHashMap<>();

    public void cachePdf(String conversationId, MultipartFile pdf) {
        try (PDDocument document = PDDocument.load(pdf.getBytes())) {
            if (document.isEncrypted()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This PDF is encrypted and cannot be read.");
            }
            String text = new PDFTextStripper().getText(document).replaceAll("\\s+", " ").trim();
            if (text.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This PDF contains images only. OCR is not supported yet.");
            }
            chunksByConversation.put(conversationId, chunk(text));
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This PDF is corrupted or cannot be read.", exception);
        }
    }

    public String addRelevantContext(String conversationId, String question) {
        List<String> chunks = chunksByConversation.get(conversationId);
        if (chunks == null || chunks.isEmpty()) return question;
        String effectiveQuestion = "PDF attached".equalsIgnoreCase(question.trim()) ? "Summarize the attached PDF." : question;
        List<String> relevant = chunks.stream().sorted(Comparator.comparingInt((String chunk) -> score(chunk, effectiveQuestion)).reversed()).limit(3).toList();
        return "Use the following excerpts from the attached PDF to answer the question. If the answer is not in them, say so.\n\n"
                + String.join("\n\n---\n\n", relevant) + "\n\nQuestion: " + effectiveQuestion;
    }

    private List<String> chunk(String text) {
        List<String> chunks = new ArrayList<>();
        for (int start = 0; start < text.length(); start += CHUNK_SIZE - OVERLAP) {
            int end = Math.min(text.length(), start + CHUNK_SIZE);
            chunks.add(text.substring(start, end));
            if (end == text.length()) break;
        }
        return chunks;
    }

    private int score(String chunk, String question) {
        String lowerChunk = chunk.toLowerCase(Locale.ROOT);
        return (int) Pattern.compile("[\\p{L}\\p{N}]{3,}").matcher(question.toLowerCase(Locale.ROOT)).results()
                .map(match -> match.group()).distinct().filter(lowerChunk::contains).count();
    }
}
