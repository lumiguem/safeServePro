import type {CompletedAudit} from '../types';

const STORAGE_KEY = 'safeserve_audits';

export const saveAuditToStorage = (audit: CompletedAudit) => {
    const existing = getAuditsFromStorage();
    const updated = [audit, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
};

export const getAuditsFromStorage = (): CompletedAudit[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};
