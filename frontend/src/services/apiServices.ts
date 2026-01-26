
import { db } from './dbService';
import type {CompletedAudit, RestaurantLocation, Plantilla, ApiResponse} from '../types';
import { analyzeInspectionPhoto as aiPhoto, processVoiceNote as aiVoice } from './geminiService';

const simulateDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_URL = 'http://localhost:8080/api';

export const api = {
    // --- Locations ---
    async getLocations(): Promise<ApiResponse<RestaurantLocation[]>> {
        try {
            const response = await fetch(`${BASE_URL}/establecimientos`);

            if (!response.ok) {
                throw new Error('Error al obtener establecimientos');
            }

            const backendData = await response.json();

            // 🔁 Mapeo Backend → Frontend
            const locations: RestaurantLocation[] = backendData.map((e: any) => ({
                id: e.id,
                name: e.nombre,
                address: e.direccion,
                currentRiskScore: e.riesgoActual
            }));

            return {
                data: locations,
                error: null,
                status: response.status,
                loading: false
            };

        } catch (error) {
            return {
                data: null,
                error: 'No se pudo conectar con el backend',
                status: 500,
                loading: false
            };
        }
    },

    //Plantillas

    async getPlantillas(): Promise<ApiResponse<Plantilla[]>> {
        try {
            const response = await fetch(`${BASE_URL}/plantillas`);
            if (!response.ok) throw new Error('Error al obtener plantillas');

            const data: Plantilla[] = await response.json();

            return {
                data,
                error: null,
                status: response.status,
                loading: false
            };
        } catch (error) {
            return {
                data: null,
                error: 'No se pudo cargar plantillas',
                status: 500,
                loading: false
            };
        }
    },


    // --- Audits ---
    async getAudits(): Promise<ApiResponse<CompletedAudit[]>> {
        await simulateDelay(1000);
        try {
            const data = db.get().audits;
            return { data, error: null, status: 200, loading: false };
        } catch (e) {
            return { data: null, error: 'Failed to load audit history', status: 500, loading: false };
        }
    },

    async submitAudit(audit: CompletedAudit): Promise<ApiResponse<CompletedAudit>> {
        await simulateDelay(1500);
        try {
            const syncedAudit = { ...audit, serverSynced: true };
            db.insertAudit(syncedAudit);
            return { data: syncedAudit, error: null, status: 201, loading: false };
        } catch (e) {
            return { data: null, error: 'Server error during submission', status: 500, loading: false };
        }
    },

    // --- Intelligence ---
    async analyzeEvidence(base64: string) {
        // This is treated as an "Intelligent Backend Endpoint"
        try {
            return await aiPhoto(base64);
        } catch (e) {
            throw new Error('AI Engine unavailable');
        }
    },

    async processDictation(text: string) {
        try {
            return await aiVoice(text);
        } catch (e) {
            throw new Error('NLP Backend unavailable');
        }
    }
};
