
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export async function analyzeInspectionPhoto(base64Image: string) {
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const prompt = `Analiza esta foto de una cocina comercial para cumplimiento de seguridad alimentaria. 
  1. Identifica cualquier violación visible (ej. contaminación cruzada, falta de higiene, falta de redes para el cabello, carne cruda mal almacenada).
  2. Escaneo OCR: Busca lecturas de termómetros o etiquetas de caducidad.
  3. IMPORTANTE: Devuelve todo el texto en ESPAÑOL.
  4. Devuelve un objeto JSON con: 
     - violations: array de { category: string, description: string, priority: 'LOW'|'MEDIUM'|'HIGH'|'CRITICAL', recommendation: string }
     - readings: array de { type: 'Temperatura'|'Etiqueta', value: string, confidence: number }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    violations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                category: { type: Type.STRING },
                                description: { type: Type.STRING },
                                priority: { type: Type.STRING },
                                recommendation: { type: Type.STRING }
                            }
                        }
                    },
                    readings: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING },
                                value: { type: Type.STRING },
                                confidence: { type: Type.NUMBER }
                            }
                        }
                    }
                }
            }
        }
    });

    return JSON.parse(response.text);
}

export async function processVoiceNote(dictation: string) {
    const prompt = `Eres un experto en seguridad alimentaria. Convierte la siguiente observación hablada en un informe de infracción estructurado en ESPAÑOL: "${dictation}".
  Identifica la categoría, evalúa la prioridad según estándares internacionales y sugiere una acción correctiva.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING },
                    description: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    correctiveAction: { type: Type.STRING }
                },
                required: ["category", "description", "priority", "correctiveAction"]
            }
        }
    });

    return JSON.parse(response.text);
}

export async function generateExecutiveSummary(reports: any[]) {
    const prompt = `Analiza estos informes de seguridad alimentaria y proporciona un resumen ejecutivo tipo "Mapa de Calor" en ESPAÑOL.
  Identifica los problemas más recurrentes y sugiere mejoras sistémicas.
  Datos de informes: ${JSON.stringify(reports)}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });

    return response.text;
}
