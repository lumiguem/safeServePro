
import { type Violation, ViolationPriority,type InspectionKPIs } from '../types';

export const calculateProgress = (items: { status: string }[]): number => {
    if (items.length === 0) return 0;
    const completed = items.filter(item => item.status !== 'pending').length;
    return Math.round((completed / items.length) * 100);
};

export const calculateComplianceScore = (items: { status: string }[]): number => {
    if (items.length === 0) return 100;
    const failed = items.filter(item => item.status === 'fail').length;
    return Math.round(100 - (failed / items.length * 100));
};

export const calculateKPIs = (
    violations: Violation[],
    complianceScore: number,
    evidenceCount: number
): InspectionKPIs => {
    const criticalCount = violations.filter(v => v.priority === ViolationPriority.CRITICAL).length;
    return {
        criticalCount,
        complianceScore,
        evidenceCount,
        aiAssistanceRate: 85 // Mocked value for demonstration
    };
};

export const generateAuditId = () => Math.random().toString(36).substr(2, 9).toUpperCase();
