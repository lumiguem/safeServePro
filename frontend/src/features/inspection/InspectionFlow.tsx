import React from "react";
import { type CompletedAudit } from "../../types";
import { useInspectionFlow } from "./useInspectionFlow";
import { InspectionForm, LocationSelect, TemplateSelect } from "./components";

interface InspectionFlowProps {
    onSaveAudit: (audit: CompletedAudit) => void;
}

const InspectionFlow: React.FC<InspectionFlowProps> = ({ onSaveAudit }) => {
    const {
        step,
        locations,
        templates,
        loadingLocations,
        loadingTemplates,
        isSubmitting,
        isCreatingAudit,
        isAnalyzing,
        deletingEvidenceIds,
        submitMessage,
        submitError,
        templatesError,
        locationsError,
        selectedLocation,
        selectedTemplate,
        checklist,
        violations,
        evidences,
        progress,
        complianceScore,
        kpis,
        fileInputRef,
        startLocationChoice,
        startTemplateChoice,
        updateChecklistItem,
        handlePhotoUpload,
        deleteEvidence,
        deleteViolation,
        completeAudit,
        backToTemplateSelect,
        backToLocationSelect
    } = useInspectionFlow(onSaveAudit);

    if (step === "location-select") {
        return (
            <LocationSelect
                locations={locations}
                loadingLocations={loadingLocations}
                submitMessage={submitMessage}
                submitError={locationsError ?? submitError}
                onSelect={startLocationChoice}
            />
        );
    }

    if (step === "template-select") {
        return (
            <TemplateSelect
                templates={templates}
                selectedLocation={selectedLocation}
                loadingTemplates={loadingTemplates}
                submitError={templatesError ?? submitError}
                isCreatingAudit={isCreatingAudit}
                onBack={backToLocationSelect}
                onSelect={startTemplateChoice}
            />
        );
    }

    return (
        <InspectionForm
            selectedLocation={selectedLocation}
            selectedTemplate={selectedTemplate}
            checklist={checklist}
            violations={violations}
            evidences={evidences}
            progress={progress}
            complianceScore={complianceScore}
            kpis={kpis}
            isAnalyzing={isAnalyzing}
            deletingEvidenceIds={deletingEvidenceIds}
            isSubmitting={isSubmitting}
            fileInputRef={fileInputRef}
            onCancel={backToTemplateSelect}
            onUpdateChecklist={updateChecklistItem}
            onUploadPhoto={handlePhotoUpload}
            onDeleteEvidence={deleteEvidence}
            onDeleteViolation={deleteViolation}
            onComplete={completeAudit}
        />
    );
};

export default InspectionFlow;
