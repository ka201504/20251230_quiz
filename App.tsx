
import React, { useState } from 'react';
import { QuizSettings, QuizQuestion, AppState, UserAnswer } from './types.ts';
import { generateQuizQuestions } from './services/geminiService.ts';
import QuizSetup from './components/QuizSetup.tsx';
import QuizEngine from './components/QuizEngine.tsx';
import QuizResult from './components/QuizResult.tsx';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [loadingStatus, setLoadingStatus] = useState('AIが最高のクイズを準備中...');
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async (settings: QuizSettings) => {
    try {
      setState(AppState.GENERATING);
      setError(null);
      setLoadingStatus(`「${settings.topic}」についてAIが学習しています...`);
      
      const generatedQuestions = await generateQuizQuestions(
        settings.topic,
        settings.difficulty,
        settings.questionCount
      );
      
      setQuestions(generatedQuestions);
      setState(AppState.QUIZ);
    } catch (err) {
      console.error(err);
      setError('クイズの生成中にエラーが発生しました。別のトピックで試してみてください。');
      setState(AppState.SETUP);
    }
  };

  const handleQuizComplete = (finalAnswers: UserAnswer[]) => {
    setAnswers(finalAnswers);
    setState(AppState.RESULT);
  };

  const handleRestart = () => {
    setAnswers([]);
    setState(AppState.QUIZ);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12">
      <header className="px-4 py-6 flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tight text-gray-900">AI Spark Quiz</span>
        </div>
        <div className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
          Powered by Gemini 3.0
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8">
        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-4">
            <AlertCircle size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {state === AppState.SETUP && (
          <QuizSetup onStart={handleStartQuiz} />
        )}

        {state === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-500">
            <div className="relative">
               <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
               <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative" />
            </div>
            <p className="mt-8 text-xl font-bold text-gray-800 animate-pulse text-center">
              {loadingStatus}
            </p>
            <p className="mt-3 text-sm text-gray-400">問題文とイメージプロンプトを構成しています...</p>
          </div>
        )}

        {state === AppState.QUIZ && (
          <QuizEngine 
            questions={questions} 
            onComplete={handleQuizComplete} 
          />
        )}

        {state === AppState.RESULT && (
          <QuizResult 
            questions={questions} 
            answers={answers} 
            onRestart={handleRestart} 
          />
        )}
      </main>

      <footer className="mt-12 text-center px-4">
        <p className="text-gray-400 text-xs font-medium">© 2024 AI Spark Quiz. Crafted with precision.</p>
      </footer>
    </div>
  );
};

export default App;
