package com.safeserve.backend.application.dto;

import java.util.List;

public record ChecklistTemplateDto(
        String id,
        String label,
        String category,
        List<String> items
) {}
