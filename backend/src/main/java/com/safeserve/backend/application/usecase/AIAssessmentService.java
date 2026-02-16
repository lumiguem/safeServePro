package com.safeserve.backend.application.usecase;

import com.safeserve.backend.domain.model.Hallazgo;

import java.util.List;

public interface AIAssessmentService {
    List<Hallazgo> assessImage(String imageUrl);

}
