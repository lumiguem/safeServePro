
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
    source?: 'AI' | 'MANUAL';
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

export interface AuditoriaListItem {
    id: string;
    establecimientoId: string;
    establecimientoNombre?: string;
    plantillaId: string;
    plantillaLabel?: string;
    fechaAuditoria?: string;
    progreso?: number;
    puntuacionCumplimiento?: number;
    numeroHallazgos?: number;
}

export interface HallazgoDetalle {
    id: number;
    auditoriaId: string;
    evidenciaId: number;
    categoria: string | null;
    descripcion: string;
    prioridad: ViolationPriority;
    accionCorrectiva: string | null;
    estaResuelto: boolean;
    fechaHallazgo: string;
}

export interface EvidenciaDetalle {
    id: number;
    auditoriaId: string;
    urlArchivo: string;
    tipoArchivo: string;
    timestampCaptura: string;
}

export interface AuditoriaDetalle {
    auditoria: AuditoriaListItem;
    hallazgos: HallazgoDetalle[];
    evidencias: EvidenciaDetalle[];
    totalHallazgos: number;
    hallazgosResueltos: number;
    hallazgosPendientes: number;
    totalEvidencias: number;
}

export interface RestaurantLocation {
    id: string;
    name: string;
    address: string;
    currentRiskScore: number;

    lastInspectionDate?: string;
    openViolations?: number;
    manager?: string;
    status?: 'ACTIVE' | 'FLAGGED' | 'SUSPENDED';
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

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'inspections';
    token?: string;
}

// Auth Types based on Spring Boot Controller
export interface LoginRequestDto {
    username: string; // Mapped from email
    password: string;
}

export interface LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    accessTtlSeconds: number;
}


