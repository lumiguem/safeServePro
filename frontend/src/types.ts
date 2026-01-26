
export const ViolationPriority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
} as const;

export type ViolationPriority =
    typeof ViolationPriority[keyof typeof ViolationPriority];

export interface Violation {
    id: string;
    category: string;
    description: string;
    priority: ViolationPriority;
    correctiveAction: string;
    deadline?: string;
    imageUrl?: string;
    isResolved: boolean;
}

export interface InspectionKPIs {
    criticalCount: number;
    complianceScore: number;
    evidenceCount: number;
    aiAssistanceRate: number;
}

export interface CompletedAudit {
    id: string;
    locationId: string;
    locationName: string;
    templateLabel: string;
    date: string;
    violationsCount: number;
    evidencesCount: number;
    progress: number;
    violations: Violation[];
    kpis: InspectionKPIs;
    serverSynced: boolean;
}

export interface RestaurantLocation {
    id: string;
    name: string;
    lastInspectionDate: string;
    currentRiskScore: number;
    openViolations: number;
    manager: string;
    address: string;
    status: 'ACTIVE' | 'FLAGGED' | 'SUSPENDED';
}

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
    loading: boolean;
}

export type Tab =
    | 'dashboard'
    | 'inspections'
    | 'risk-map'
    | 'history'
    | 'analytics'
    | 'settings';

export interface PlantillaItem {
    id: string;
    tarea: string;
    esCritico: boolean;
}

export interface Plantilla {
    id: string;
    titulo: string;
    categoria: string;
    descripcion: string;
    items: PlantillaItem[];
}

