
import { GoogleGenAI } from "@google/genai";

// Use process.env.GEMINI_API_KEY directly and create instance at call-site as per guidelines
export class GeminiService {
  /**
   * Performs complex legal research using the Pro model with an optimized thinking budget.
   */
  async getLegalResearch(query: string) {
    try {
      // Create instance at call site to ensure up-to-date API key
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Act as a senior legal researcher. Provide a detailed summary and relevant case law references for the following query: ${query}`,
        config: {
          // Setting max thinking budget for the pro model to ensure high-quality reasoning
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Could not fetch legal research at this time.";
    }
  }

  /**
   * Analyzes legal documents for critical points and risks.
   */
  async analyzeDocument(docName: string, caseTitle: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
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

  /**
   * Drafts formal legal documents with high-quality reasoning using the Pro model.
   */
  async draftLegalDocument(type: string, details: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Upgraded to pro for better document drafting quality
        contents: `Draft a formal ${type} document based on these details: ${details}. Use standard Indian legal formatting.`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Could not draft document.";
    }
  }
}

export const gemini = new GeminiService();
