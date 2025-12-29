
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateCourseDescription(title: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Escribe una descripción profesional y atractiva para un curso de e-learning titulado "${title}". Incluye 3 puntos clave de lo que aprenderán.`,
    });
    return response.text;
  }

  async generateModuleOutline(moduleTitle: string, courseTitle: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un experto pedagogo. Para el curso "${courseTitle}", genera una lista de 4 títulos de lecciones breves y lógicas para el módulo titulado "${moduleTitle}". Devuelve solo la lista numerada.`,
    });
    return response.text;
  }
}

export const geminiService = new GeminiService();
