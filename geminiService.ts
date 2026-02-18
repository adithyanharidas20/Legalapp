
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY });
  }

  async getLegalResearch(query: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as a senior legal researcher. Provide a detailed summary and relevant case law references for the following query: ${query}`,
        config: {
            thinkingConfig: { thinkingBudget: 10000 }
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Could not fetch legal research at this time.";
    }
  }

  async analyzeDocument(docName: string, caseTitle: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the document titled "${docName}" within the context of the legal case "${caseTitle}". 
        Since you don't have the full raw text, provide a checklist of critical legal points an advocate should verify 
        in such a document and predict potential risks or missing clauses typical for this document type.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "AI analysis failed.";
    }
  }

  async draftLegalDocument(type: string, details: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Draft a formal ${type} document based on these details: ${details}. Use standard Indian legal formatting.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Could not draft document.";
    }
  }
}

export const gemini = new GeminiService();
