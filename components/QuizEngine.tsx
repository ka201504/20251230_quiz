
import React, { useState, useEffect } from 'react';
import { QuizQuestion, UserAnswer } from '../types.ts';
import { generateQuestionImage } from '../services/geminiService.ts';
import { CheckCircle2, XCircle, ChevronRight, Loader2, Sparkles } from 'lucide-react';

interface QuizEngineProps {
  questions: QuizQuestion[];
  onComplete: (answers: UserAnswer[]) => void;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const fetchImage = async () => {
      if (currentQuestion) {
        setIsImageLoading(true);
        setCurrentImage(null);
        const url = await generateQuestionImage(currentQuestion.imagePrompt);
        setCurrentImage(url);
        setIsImageLoading(false);
      }
    };
    fetchImage();
  }, [currentIndex, currentQuestion]);

  const handleOptionSelect = (idx: number) => {
    if (isShowingFeedback) return;
    setSelectedOption(idx);
    setIsShowingFeedback(true);

    const isCorrect = idx === currentQuestion.correctAnswerIndex;
    const newAnswer: UserAnswer = {
      questionIndex: currentIndex,
      selectedOptionIndex: idx,
      isCorrect
    };
    setAnswers(prev => [...prev, newAnswer]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsShowingFeedback(false);
    } else {
      onComplete(answers);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-500">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="glass-card rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="relative aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
          {isImageLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
              <p className="text-xs text-indigo-400 font-medium animate-pulse">AIが画像を生成中...</p>
            </div>
          ) : currentImage ? (
            <img 
              src={currentImage} 
              alt="Question Visual" 
              className="w-full h-full object-cover animate-in fade-in duration-700"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-300">
              <Sparkles size={48} />
              <p className="text-xs mt-2">イメージを生成できませんでした</p>
            </div>
          )}
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 leading-tight">
            {currentQuestion.question}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctAnswerIndex;
              let btnClass = "text-left p-4 rounded-2xl border-2 transition-all duration-200 text-sm font-semibold ";

              if (!isShowingFeedback) {
                btnClass += "border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 active:bg-indigo-100";
              } else {
                if (isCorrect) {
                  btnClass += "border-green-500 bg-green-50 text-green-700";
                } else if (isSelected) {
                  btnClass += "border-red-500 bg-red-50 text-red-700";
                } else {
                  btnClass += "border-gray-50 text-gray-300 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isShowingFeedback}
                  onClick={() => handleOptionSelect(idx)}
                  className={btnClass}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {isShowingFeedback && isCorrect && <CheckCircle2 size={20} className="text-green-500" />}
                    {isShowingFeedback && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {isShowingFeedback && (
          <div className="p-6 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">解説</p>
              <p className="text-gray-700 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-gray-200"
            >
              {currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
