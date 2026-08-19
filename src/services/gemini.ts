import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiModel = "gemini-3-flash-preview";

export interface StudyRecommendation {
  type: 'doc' | 'project' | 'video' | 'architecture';
  title: string;
  content: string;
  links: string[];
}

export async function getStudyRecommendations(level: string, goal: string): Promise<StudyRecommendation[]> {
  const prompt = `You are an expert JavaScript mentor. The student is at a ${level} level and wants to ${goal}. 
  Provide exactly:
  1. One relevant documentation reference.
  2. One mini-project idea.
  3. One YouTube video search keyword/concept for visual learning.
  4. One architectural pattern or reference for study.
  
  Format the response in JSON.`;

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['doc', 'project', 'video', 'architecture'] },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            links: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['type', 'title', 'content', 'links']
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export async function exploreDocumentation(query: string) {
  // Using googleSearch tool for real-time documentation search
  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: `Find the most relevant and beginner-friendly documentation for: ${query}. Explain it simply.`,
    config: {
      tools: [{ googleSearch: {} }],
      toolConfig: { includeServerSideToolInvocations: true }
    }
  });

  return response.text;
}
