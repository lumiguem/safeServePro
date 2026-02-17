package com.safeserve.backend.application.usecase;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.safeserve.backend.domain.model.Hallazgo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAIAssessmentService implements AIAssessmentService {

    private static final long MAX_IMAGE_BYTES = 7_000_000;

    private final WebClient webClient;
    private final String geminiApiKey;
    private final String geminiModel;
    private final ObjectMapper objectMapper;

    public GeminiAIAssessmentService(
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.api.model:gemini-2.5-flash}") String geminiModel,
            WebClient.Builder webClientBuilder
    ) {
        this.geminiApiKey = apiKey == null ? "" : apiKey.trim();
        this.geminiModel = geminiModel == null || geminiModel.isBlank()
                ? "gemini-2.5-flash"
                : geminiModel.trim();
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
            return List.of(errorHallazgo("GEMINI_API_KEY no configurada. IA deshabilitada."));
        }
        if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            return List.of(errorHallazgo("La URL de imagen debe iniciar con http:// o https://"));
        }

        try {
            URLConnection connection = new URL(imageUrl).openConnection();
            connection.setRequestProperty("User-Agent", "SafeServePro/1.0");

            byte[] imageBytes;
            try (InputStream input = connection.getInputStream()) {
                imageBytes = input.readAllBytes();
            }

            if (imageBytes.length == 0) {
                return List.of(errorHallazgo("La imagen descargada esta vacia."));
            }
            if (imageBytes.length > MAX_IMAGE_BYTES) {
                return List.of(errorHallazgo(
                        "La imagen pesa " + imageBytes.length + " bytes. Reduce tamano para IA."
                ));
            }

            String mimeType = connection.getContentType();
            if (mimeType != null) {
                mimeType = mimeType.split(";")[0].trim();
            }
            if (mimeType == null || mimeType.isBlank()) {
                mimeType = URLConnection.guessContentTypeFromName(imageUrl);
            }
            if (mimeType == null) {
                mimeType = "image/jpeg";
            }
            if (!mimeType.toLowerCase().startsWith("image/")) {
                return List.of(errorHallazgo("La URL no devuelve imagen valida. MIME: " + mimeType));
            }

            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            String prompt =
                    "Analiza la imagen y detecta riesgos de higiene o seguridad en un establecimiento de alimentos. " +
                    "Devuelve SOLO un ARRAY JSON valido. " +
                    "Cada objeto debe contener: categoria, descripcion, accionCorrectiva, prioridad (LOW, MEDIUM, HIGH, CRITICAL).";

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", prompt),
                                    Map.of("inlineData", Map.of("mimeType", mimeType, "data", base64Image))
                            ))
                    )
            );

            Mono<Map> responseMono = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v1/models/" + geminiModel + ":generateContent")
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
            for (Hallazgo h : hallazgos) {
                h.setAuditoriaId("AUTO_AI");
                h.setEstaResuelto(false);
                if (h.getFechaHallazgo() == null) {
                    h.setFechaHallazgo(LocalDateTime.now());
                }
            }
            return hallazgos;

        } catch (WebClientResponseException e) {
            String body = e.getResponseBodyAsString();
            if (body == null) {
                body = "";
            }
            body = body.replaceAll("\\s+", " ");
            if (body.length() > 280) {
                body = body.substring(0, 280) + "...";
            }
            return List.of(errorHallazgo("Error Gemini (" + e.getStatusCode().value() + "): " + body));
        } catch (Exception e) {
            return List.of(errorHallazgo("Error procesando imagen: " + e.getMessage()));
        }
    }

    private String extractTextFromGemini(Map<String, Object> response) {
        if (response == null || !response.containsKey("candidates")) {
            return null;
        }
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        if (candidates.isEmpty()) {
            return null;
        }
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        if (content == null || !content.containsKey("parts")) {
            return null;
        }
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts.isEmpty()) {
            return null;
        }
        return (String) parts.get(0).get("text");
    }

    private String extractJsonArrayFromString(String text) {
        if (text == null) {
            return null;
        }
        int start = text.indexOf('[');
        int end = text.lastIndexOf(']');
        if (start == -1 || end == -1 || end <= start) {
            return null;
        }
        return text.substring(start, end + 1);
    }

    private List<Hallazgo> parseGeminiResponseToHallazgos(String jsonArray) {
        try {
            return objectMapper.readValue(jsonArray, new TypeReference<List<Hallazgo>>() {});
        } catch (JsonProcessingException e) {
            return Collections.singletonList(hallazgoFallback());
        }
    }

    private Hallazgo hallazgoFallback() {
        return Hallazgo.builder()
                .auditoriaId("AUTO_AI")
                .categoria("General")
                .descripcion("La IA no devolvio hallazgos validos")
                .prioridad(Hallazgo.Prioridad.MEDIUM)
                .accionCorrectiva("Revisar prompt o formato de respuesta de Gemini")
                .fechaHallazgo(LocalDateTime.now())
                .estaResuelto(false)
                .build();
    }

    private Hallazgo errorHallazgo(String descripcion) {
        return Hallazgo.builder()
                .auditoriaId("AUTO_AI")
                .categoria("Error AI")
                .descripcion(descripcion)
                .prioridad(Hallazgo.Prioridad.CRITICAL)
                .accionCorrectiva("Verifica API key, modelo Gemini, URL/MIME/tamano de imagen.")
                .fechaHallazgo(LocalDateTime.now())
                .estaResuelto(false)
                .build();
    }
}

