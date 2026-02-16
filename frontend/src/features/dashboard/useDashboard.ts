import { useEffect, useState } from "react";
import type { RestaurantLocation } from "../../types";
import { locationService } from "../../services/locationService";
import { logger } from "../../utils/logger";

export function useDashboard() {
    const [locations, setLocations] = useState<RestaurantLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLocations = async () => {
            try {
                const res = await locationService.getLocations();
                if (res.data) setLocations(res.data);
            } catch (error) {
                logger.error("Error cargando establecimientos", error);
                setError("No se pudieron cargar los establecimientos.");
            } finally {
                setLoading(false);
            }
        };

        loadLocations();
    }, []);

    return { locations, loading, error };
}
