package com.safeserve.backend.application.usecase;

import com.safeserve.backend.domain.model.Hallazgo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;

import java.net.URL;
import java.net.URLConnection;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAIAssessmentService implements AIAssessmentService {

    private final WebClient webClient;
    private final String geminiApiKey;
    private final ObjectMapper objectMapper;

    public GeminiAIAssessmentService(
            @Value("${gemini.api.key:}") String apiKey,
            WebClient.Builder webClientBuilder
    ) {
        this.geminiApiKey = apiKey == null ? "" : apiKey.trim();
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();

        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<Hallazgo> assessImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return List.of();
        }
        if (geminiApiKey.isBlank()) {
            return List.of(
                    Hallazgo.builder()
                            .auditoriaId("AUTO_AI")
                            .categoria("Configuracion")
                            .descripcion("GEMINI_API_KEY no configurada. La evaluacion IA esta deshabilitada.")
                            .prioridad(Hallazgo.Prioridad.MEDIUM)
                            .accionCorrectiva("Configura GEMINI_API_KEY para habilitar IA.")
                            .fechaHallazgo(LocalDateTime.now())
                            .estaResuelto(false)
                            .build()
            );
        }
        if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            return List.of();
        }

        try {
            byte[] imageBytes = new URL(imageUrl).openStream().readAllBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            String prompt =
                    "Analiza la imagen y detecta riesgos de higiene o seguridad en un establecimiento de alimentos. " +
                            "Devuelve SOLO un ARRAY JSON válido. " +
                            "Cada objeto debe contener exactamente estos campos: " +
                            "categoria, descripcion, accionCorrectiva, prioridad (LOW, MEDIUM, HIGH, CRITICAL). " +
                            "No incluyas texto adicional ni explicaciones.";

            Map<String, Object> partText = Map.of("text", prompt);

            String mimeType = URLConnection.guessContentTypeFromName(imageUrl);
            if (mimeType == null) {
                mimeType = "image/jpeg";
            }
            if (!mimeType.toLowerCase().startsWith("image/")) {
                return List.of();
            }

            Map<String, Object> partImage = Map.of(
                    "inlineData", Map.of(
                            "mimeType", mimeType,
                            "data", base64Image
                    )
            );

            Map<String, Object> content = Map.of(
                    "parts", List.of(partText, partImage)
            );

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(content)
            );

            Mono<Map> responseMono = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/models/gemini-2.5-flash:generateContent")
                            .queryParam("key", geminiApiKey)
                            .build()
                    )
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class);

            Map<String, Object> geminiResponse = responseMono.block();

            String aiResponse = extractTextFromGemini(geminiResponse);
            String jsonArray = extractJsonArrayFromString(aiResponse);

            if (jsonArray == null || jsonArray.isBlank()) {
                return List.of(hallazgoFallback());
            }

            List<Hallazgo> hallazgos = parseGeminiResponseToHallazgos(jsonArray);

            // Completar campos del dominio
            for (Hallazgo h : hallazgos) {
                h.setAuditoriaId("AUTO_AI");
                h.setEstaResuelto(false);
                if (h.getFechaHallazgo() == null) {
                    h.setFechaHallazgo(LocalDateTime.now());
                }
            }

            return hallazgos;

        } catch (Exception e) {
            return List.of(
                    Hallazgo.builder()
                            .auditoriaId("AUTO_AI")
                            .categoria("Error AI")
                            .descripcion("Error procesando imagen: " + e.getMessage())
                            .prioridad(Hallazgo.Prioridad.CRITICAL)
                            .accionCorrectiva("Verificar imagen y configuración de Gemini")
                            .fechaHallazgo(LocalDateTime.now())
                            .estaResuelto(false)
                            .build()
            );
        }
    }

    // ===================== Helpers =====================

    private String extractTextFromGemini(Map<String, Object> response) {
        if (response == null || !response.containsKey("candidates")) return null;

        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) response.get("candidates");

        if (candidates.isEmpty()) return null;

        Map<String, Object> content =
                (Map<String, Object>) candidates.get(0).get("content");

        if (content == null || !content.containsKey("parts")) return null;

        List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");

        if (parts.isEmpty()) return null;

        return (String) parts.get(0).get("text");
    }

    private String extractJsonArrayFromString(String text) {
        if (text == null) return null;

        int start = text.indexOf('[');
        int end = text.lastIndexOf(']');

        if (start == -1 || end == -1 || end <= start) {
            return null;
        }

        return text.substring(start, end + 1);
    }

    private List<Hallazgo> parseGeminiResponseToHallazgos(String jsonArray) {
        try {
            return objectMapper.readValue(
                    jsonArray,
                    new TypeReference<List<Hallazgo>>() {}
            );
        } catch (JsonProcessingException e) {
            System.err.println("Error parsing Gemini JSON array: " + e.getMessage());
            System.err.println("Raw JSON: " + jsonArray);
            return Collections.singletonList(hallazgoFallback());
        }
    }

    private Hallazgo hallazgoFallback() {
        return Hallazgo.builder()
                .auditoriaId("AUTO_AI")
                .categoria("General")
                .descripcion("La IA no devolvió hallazgos válidos")
                .prioridad(Hallazgo.Prioridad.MEDIUM)
                .accionCorrectiva("Revisar prompt o formato de respuesta de Gemini")
                .fechaHallazgo(LocalDateTime.now())
                .estaResuelto(false)
                .build();
    }
}
