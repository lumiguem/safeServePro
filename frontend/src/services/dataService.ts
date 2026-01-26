import type {RestaurantLocation} from '../types';

export const MOCK_LOCATIONS: RestaurantLocation[] = [
    { id: 'LOC-001', name: 'Bistro del Centro', lastInspectionDate: '2024-05-15', currentRiskScore: 78, openViolations: 4, manager: 'Alex Rivera', address: 'Calle Mayor 123', status: 'FLAGGED' },
    { id: 'LOC-002', name: 'Airport Express', lastInspectionDate: '2024-05-20', currentRiskScore: 12, openViolations: 0, manager: 'Sara Chen', address: 'Terminal 4', status: 'ACTIVE' },
    { id: 'LOC-003', name: 'Parrilla del Puerto', lastInspectionDate: '2024-05-10', currentRiskScore: 45, openViolations: 2, manager: 'Marcos Thompson', address: 'Muelle 39', status: 'ACTIVE' },
    { id: 'LOC-004', name: 'Pizzería Urbana', lastInspectionDate: '2024-05-18', currentRiskScore: 89, openViolations: 7, manager: 'Lisa G.', address: 'Av. Las Palmeras 88', status: 'FLAGGED' },
];

export const CHECKLIST_TEMPLATES = [
    {
        id: 'TMPL-1',
        label: 'Higiene de Cámara Frigorífica',
        category: 'Almacenamiento',
        items: [
            "Juntas de puertas limpias y herméticas",
            "Suelo libre de residuos",
            "Temperatura ambiente < 4°C",
            "Alimentos a 15cm del suelo",
            "Sin óxido en el interior"
        ]
    },
    {
        id: 'TMPL-2',
        label: 'Separación de Carnes Crudas',
        category: 'Seguridad',
        items: [
            "Aves crudas en el estante inferior",
            "Separación de alimentos listos para consumo",
            "Recipientes cubiertos",
            "Sin goteos",
            "Etiquetado de fechas correcto"
        ]
    },
    {
        id: 'TMPL-3',
        label: 'Control de Lavado de Manos',
        category: 'Limpieza',
        items: [
            "Accesible y sin obstáculos",
            "Agua fría/caliente operativa",
            "Jabón y toallas disponibles",
            "Papelera disponible",
            "Señalización visible"
        ]
    },
    {
        id: 'TMPL-4',
        label: 'EPP del Personal',
        category: 'Personal',
        items: [
            "Redes para el cabello puestas",
            "Sin joyas en manos",
            "Delantales limpios",
            "Cambio de guantes frecuente",
            "No comer en área de preparación"
        ]
    },
];
