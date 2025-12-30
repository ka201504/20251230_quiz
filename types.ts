
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface QuizSettings {
  topic: string;
  difficulty: Difficulty;
  questionCount: number;
}

export enum AppState {
  SETUP = 'setup',
  GENERATING = 'generating',
  QUIZ = 'quiz',
  RESULT = 'result'
}

export interface UserAnswer {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}
