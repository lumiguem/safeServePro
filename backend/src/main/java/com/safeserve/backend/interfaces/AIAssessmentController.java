package com.safeserve.backend.interfaces;

import com.safeserve.backend.application.usecase.AIAssessmentService;
import com.safeserve.backend.domain.model.Hallazgo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-assessments")
@RequiredArgsConstructor
public class AIAssessmentController {

    private final AIAssessmentService aiAssessmentService;

    @PostMapping("/image")
    public ResponseEntity<List<Hallazgo>> assessImage(@RequestBody Map<String, String> request) {

        String imageUrl = request.get("imageUrl");
        if (imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        List<Hallazgo> hallazgos = aiAssessmentService.assessImage(imageUrl);

        if (hallazgos == null || hallazgos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(hallazgos);
    }
}
