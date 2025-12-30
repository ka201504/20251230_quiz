import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, Difficulty } from "../types";

export const generateQuizQuestions = async (
  topic: string,
  difficulty: Difficulty,
  count: number
): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const difficultyLabel = {
    [Difficulty.EASY]: '初級（基礎的な知識）',
    [Difficulty.MEDIUM]: '中級（標準的な知識）',
    [Difficulty.HARD]: '上級（専門的な知識）'
  }[difficulty];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `「${topic}」についての4択クイズを ${count} 問作成してください。
      難易度は「${difficultyLabel}」に設定してください。
      
      【重要ルール】
      1. 問題文、選択肢、解説はすべて「日本語」で出力してください。
      2. 選択肢は必ず4つ作成してください。
      3. 各問題には、その内容を視覚的に表現するためのAI画像生成用プロンプト（imagePrompt）を英語で作成してください。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { 
              type: Type.STRING,
              description: "クイズの問題文（日本語）"
            },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "4つの選択肢（すべて日本語）"
            },
            correctAnswerIndex: { 
              type: Type.INTEGER, 
              description: "正解のインデックス（0から3）" 
            },
            explanation: { 
              type: Type.STRING,
              description: "正解に関する簡潔な解説文（日本語）"
            },
            imagePrompt: { 
              type: Type.STRING, 
              description: "AI画像生成モデル（Imagen）に渡すための詳細な英語プロンプト" 
            }
          },
          required: ["question", "options", "correctAnswerIndex", "explanation", "imagePrompt"]
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("AIからクイズデータを取得できませんでした。");
  return JSON.parse(text);
};

export const generateQuestionImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Professional educational illustration, vibrant digital art, clean composition: ${prompt}` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("画像生成中にエラーが発生しました:", error);
    return null;
  }
};