export interface EstablecimientoDto {
    id: string;
    nombre: string;
    direccion: string;
    riesgoActual: number;
}

export interface ChecklistTemplateDto {
    id: string;
    label: string;
    category: string;
    items: string[];
}

export interface HallazgoDto {
    id: number;
    auditoriaId: string;
    evidenciaId: number;
    categoria: string | null;
    descripcion: string;
    prioridad: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    accionCorrectiva: string | null;
    estaResuelto: boolean;
    fechaHallazgo: string;
}

export interface EvidenciaDto {
    id: number;
    auditoriaId: string;
    urlArchivo: string;
    tipoArchivo: string;
    timestampCaptura: string;
    hallazgos: HallazgoDto[];
}
