import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

const MODEL_TEXT = "gemini-3-flash-preview";
const MODEL_IMAGE = "gemini-2.5-flash-image";
const MODEL_VIDEO = "veo-3.1-fast-generate-preview";
const MODEL_TTS = "gemini-2.5-flash-preview-tts";

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  prunedText?: string;
  diagramTopic?: string;
  isEducational?: boolean;
}

export class GeminiService {
  private getApiKey(): string {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }
    return key;
  }

  /**
   * Prunes the context of a student's question.
   */
  async pruneContext(rawInput: string, language: string = 'English'): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `You are a context pruning engine for a rural AI companion. 
      Extract the core question, intent, or topic from the student's input.
      The student is speaking in ${language}.
      Input: "${rawInput}"
      Output:`,
      config: { temperature: 0.1 }
    });
    return response.text?.trim() || rawInput;
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  /**
   * Performs OCR.
   */
  async performOCR(base64Image: string, mimeType: string, language: string = 'English'): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: `Extract the educational question from this image. The text might be in ${language}.` }
        ]
      }
    });
    return response.text?.trim() || "";
  }

  /**
   * Generates a friendly greeting for the student.
   */
  async getGreeting(language: string = 'English'): Promise<Message> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Generate a short, friendly, and encouraging greeting for a student in rural India who is starting their learning session. 
      The greeting MUST be in ${language}.
      Include a warm "Namaste" or similar local greeting.
      Keep it under 20 words.`,
      config: { temperature: 0.7 }
    });
    const text = response.text?.trim() || "Namaste! I'm your AI Tutor. What would you like to learn today?";
    return {
      id: this.generateId(),
      role: 'model',
      text,
      isEducational: false
    };
  }

  /**
   * Summarizes the current chat history.
   */
  async summarizeChat(history: Message[], language: string = 'English'): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const chatContent = history.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Summarize the following educational chat history into a few key takeaways for the student. 
      Keep it simple and encouraging.
      The summary MUST be in ${language}.
      
      Chat History:
      ${chatContent}
      
      Summary:`,
      config: { temperature: 0.3 }
    });
    
    return response.text?.trim() || "I couldn't generate a summary of our conversation yet.";
  }

  /**
   * Generates a tutor response with a conversational and interactive tone.
   */
  async getChatResponse(history: Message[], currentQuery: string, language: string = 'English'): Promise<Message> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    
    const chat = ai.chats.create({
      model: MODEL_TEXT,
      config: {
        systemInstruction: `You are a friendly, encouraging AI companion and tutor for students in rural India. 
        You can help them with their studies, answer their questions about anything (science, history, daily life, hobbies, etc.), or just have a friendly conversation.
        Your goal is to make learning and interaction interactive and fun. 
        1. Explain concepts simply with local examples relevant to rural India.
        2. Use relevant emojis throughout your response to make it engaging and friendly.
        3. If the conversation is educational, end your response with a small "Check your understanding" question. If it's a general chat, end with a friendly follow-up question to keep the conversation going.
        4. Use encouraging language like "Great question!", "Interesting topic!", "Let's explore this together."
        5. Keep responses concise for low-bandwidth users.
        6. If explaining a complex concept, explicitly offer to generate a visual diagram by including the text "[OFFER_DIAGRAM: brief topic]" at the end of your explanation.
        7. IMPORTANT: You MUST respond in ${language}.
        Format with Markdown.`,
      },
      history: history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))
    });

    const response = await chat.sendMessage({ message: currentQuery });
    let text = response.text || "I'm sorry, I couldn't process that.";

    // Parse [OFFER_DIAGRAM: topic]
    let diagramTopic: string | undefined;
    const diagramMatch = text.match(/\[OFFER_DIAGRAM:\s*(.*?)\]/);
    if (diagramMatch) {
      diagramTopic = diagramMatch[1];
      text = text.replace(/\[OFFER_DIAGRAM:.*?\]/, "").trim();
    }

    // Detect if educational or casual
    const educationalKeywords = ['explain', 'how', 'why', 'what is', 'solve', 'formula', 'concept', 'lesson', 'study'];
    const hasKeywords = educationalKeywords.some(k => text.toLowerCase().includes(k) || currentQuery.toLowerCase().includes(k));
    const isEducational = (text.length > 150 && hasKeywords) || !!diagramTopic;

    return {
      id: this.generateId(),
      role: 'model',
      text,
      diagramTopic,
      isEducational
    };
  }

  /**
   * Generates an educational image based on a prompt.
   */
  async generateImage(prompt: string, language: string = 'English'): Promise<string | undefined> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    try {
      const response = await ai.models.generateContent({
        model: MODEL_IMAGE,
        contents: `A simple, clear, hand-drawn style educational diagram for a student in rural India explaining: ${prompt}. Use bright colors, clear labels, and a clean white background. Labels should be in ${language} if possible, or English if not.`,
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } catch (e) {
      console.error("Image generation failed", e);
    }
    return undefined;
  }

  /**
   * Generates a short educational video.
   */
  async generateEducationalVideo(topic: string): Promise<string | undefined> {
    // For Veo, we MUST use the user-selected API key from the platform.
    // Falling back to the default GEMINI_API_KEY will likely result in a 403 PERMISSION_DENIED
    // because Veo requires a paid Google Cloud project with billing enabled.
    const apiKey = (process.env as any).API_KEY;
    
    if (!apiKey) {
      throw new Error("PAID_KEY_REQUIRED: Video generation requires a paid Gemini API key. Please select one using the settings or the prompt provided.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    try {
      let operation = await ai.models.generateVideos({
        model: MODEL_VIDEO,
        prompt: `A simple educational animation explaining: ${topic}. Clear and slow.`,
        config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: { 'x-goog-api-key': apiKey },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Video download failed: ${JSON.stringify(errorData)}`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (e: any) {
      // Extract meaningful error message if it's a JSON response
      let msg = e.message || String(e);
      if (typeof e === 'object' && e !== null) {
        try {
          // Some SDK errors might have the response body in a specific property
          const body = e.response?.body || e.body;
          if (body) msg = typeof body === 'string' ? body : JSON.stringify(body);
        } catch (err) {
          // Ignore parsing errors
        }
      }
      throw new Error(msg);
    }
    return undefined;
  }

  /**
   * Generates speech for a given text.
   */
  async generateSpeech(text: string, voice: string = 'Kore'): Promise<string | undefined> {
    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    try {
      const response = await ai.models.generateContent({
        model: MODEL_TTS,
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return `data:audio/mpeg;base64,${base64Audio}`;
      }
    } catch (e) {
      console.error("Speech generation failed", e);
    }
    return undefined;
  }
}
