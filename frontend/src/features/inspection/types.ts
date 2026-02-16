export interface ChecklistItem {
    id: string;
    task: string;
    esCritico: boolean;
    status: "pending" | "pass" | "fail";
}

export interface EvidenceItem {
    id: string;
    url: string;
    timestamp: string;
    backendId?: number;
}
