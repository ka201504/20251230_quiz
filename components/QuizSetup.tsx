
import React, { useState } from 'react';
import { Difficulty, QuizSettings } from '../types';
import { Brain, Trophy, BookOpen, Layers } from 'lucide-react';

interface QuizSetupProps {
  onStart: (settings: QuizSettings) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStart }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
  const [count, setCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStart({ topic, difficulty, questionCount: count });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <Brain className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Spark Quiz</h1>
        <p className="text-gray-500">好きなトピックでクイズを作って挑戦しよう</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 rounded-3xl shadow-xl space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-500" />
            興味のある分野 / トピック
          </label>
          <input
            type="text"
            required
            placeholder="例: 古代エジプト, 現代のプログラミング, ポケモン..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition outline-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Layers size={18} className="text-indigo-500" />
              難易度
            </label>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
              {Object.values(Difficulty).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    difficulty === d
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {d === 'easy' ? '初級' : d === 'medium' ? '中級' : '上級'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Trophy size={18} className="text-indigo-500" />
              問題数
            </label>
            <input
              type="range"
              min="3"
              max="10"
              step="1"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="text-right text-xs font-bold text-indigo-600 mt-1">{count}問</div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          クイズを開始
        </button>
      </form>
    </div>
  );
};

export default QuizSetup;
