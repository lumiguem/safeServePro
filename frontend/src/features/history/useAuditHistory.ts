import { useEffect, useState } from "react";
import type { AuditoriaListItem } from "../../types";
import { auditService } from "../../services/auditService";
import { logger } from "../../utils/logger";

export function useAuditHistory() {
    const [audits, setAudits] = useState<AuditoriaListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const auditsData = await auditService.getAudits();
                setAudits(auditsData);
            } catch (err) {
                logger.error("Error cargando auditorias", err);
                setError("No se pudieron cargar las auditorias.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return { audits, loading, error };
}
