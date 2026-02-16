import { useEffect, useMemo, useState } from "react";
import type { RestaurantLocation } from "../../types";
import { locationService } from "../../services/locationService";
import { logger } from "../../utils/logger";

export interface RiskMapLocation extends RestaurantLocation {
    x?: number;
    y?: number;
    lastInspectionDate?: string;
    openViolations?: number;
    manager?: string;
}

export function useRiskMap() {
    const [locations, setLocations] = useState<RiskMapLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoc, setSelectedLoc] = useState<RiskMapLocation | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await locationService.getLocations();
                if (res.data) setLocations(res.data as RiskMapLocation[]);
            } catch (err) {
                logger.error("Error cargando mapa de riesgo", err);
                setError("No se pudo cargar el mapa de riesgo.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const getRiskColor = useMemo(() => {
        return (score: number) => {
            if (score < 30) return "text-emerald-500 fill-emerald-500";
            if (score < 70) return "text-amber-500 fill-amber-500";
            return "text-rose-500 fill-rose-500";
        };
    }, []);

    const getRiskBg = useMemo(() => {
        return (score: number) => {
            if (score < 30) return "bg-emerald-50 border-emerald-100 text-emerald-700";
            if (score < 70) return "bg-amber-50 border-amber-100 text-amber-700";
            return "bg-rose-50 border-rose-100 text-rose-700";
        };
    }, []);

    return {
        locations,
        loading,
        error,
        selectedLoc,
        setSelectedLoc,
        getRiskColor,
        getRiskBg
    };
}
