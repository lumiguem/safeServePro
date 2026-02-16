import type { Plantilla } from "../../../types";
import type { ChecklistTemplateDto } from "../types";

export function mapChecklistTemplateToPlantilla(dto: ChecklistTemplateDto): Plantilla {
    return {
        id: dto.id,
        titulo: dto.label,
        categoria: dto.category,
        descripcion: "",
        items: dto.items.map((item, index) => ({
            id: `${dto.id}-item-${index}`,
            tarea: item,
            esCritico: true
        }))
    };
}
