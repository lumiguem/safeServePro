import type { RestaurantLocation } from "../../../types";
import type { EstablecimientoDto } from "../types";

export function mapEstablecimientoToLocation(dto: EstablecimientoDto): RestaurantLocation {
    return {
        id: String(dto.id),
        name: dto.nombre,
        address: dto.direccion,
        currentRiskScore: dto.riesgoActual
    };
}
