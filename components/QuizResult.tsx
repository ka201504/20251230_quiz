
import React from 'react';
import { UserAnswer, QuizQuestion } from '../types';
import { RefreshCw, Star, ArrowLeft, Trophy, Medal, Award, BookOpen, Sparkles } from 'lucide-react';

interface QuizResultProps {
  questions: QuizQuestion[];
  answers: UserAnswer[];
  onRestart: () => void;
}

interface RankContent {
  title: string;
  message: string;
  subMessage: string;
  emoji: string;
  colorClass: string;
  bgGradient: string;
  icon: React.ReactNode;
}

const QuizResult: React.FC<QuizResultProps> = ({ questions, answers, onRestart }) => {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  const getRankContent = (score: number): RankContent => {
    if (score === 100) {
      return {
        title: "全知全能の神降臨！",
        message: "凄すぎる！あなたはまさにこの分野の支配者です！",
        subMessage: "一問のミスもなく、完璧にマスターしています。歴史に名を刻むレベルです！",
        emoji: "👑",
        colorClass: "text-yellow-600",
        bgGradient: "from-yellow-400 via-amber-500 to-yellow-600",
        icon: <Trophy size={64} className="text-yellow-500 animate-bounce" />
      };
    }
    if (score >= 80) {
      return {
        title: "超人級のマスター！",
        message: "素晴らしい！ほとんど全ての知識を網羅しています！",
        subMessage: "あと一歩で神の領域でした。あなたの集中力と知識量に脱帽です！",
        emoji: "🌟",
        colorClass: "text-slate-700",
        bgGradient: "from-slate-300 via-slate-400 to-slate-500",
        icon: <Medal size={64} className="text-slate-400 animate-pulse" />
      };
    }
    if (score >= 60) {
      return {
        title: "輝く秀才！",
        message: "ナイスチャレンジ！安定した実力を持っていますね。",
        subMessage: "基礎はバッチリです。さらに深掘りすれば、さらなる高みを目指せます！",
        emoji: "✨",
        colorClass: "text-blue-600",
        bgGradient: "from-blue-400 to-indigo-500",
        icon: <Award size={64} className="text-blue-500" />
      };
    }
    return {
      title: "伸びしろの塊！",
      message: "どんまい！次はもっともっと取れるはず！",
      subMessage: "「失敗は成功の母」です。今の悔しさをバネに、もう一度挑戦してみよう！",
      emoji: "🌱",
      colorClass: "text-orange-600",
      bgGradient: "from-orange-300 to-red-400",
      icon: <BookOpen size={64} className="text-orange-400" />
    };
  };

  const rank = getRankContent(scorePercent);

  return (
    <div className="max-w-xl mx-auto p-4 animate-in fade-in zoom-in duration-700">
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 mb-8 text-center shadow-2xl transition-all duration-1000`}>
        {/* Decorative Background Elements */}
        <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${rank.bgGradient}`} />
        <div className="absolute top-[-10%] left-[-10%] w-40 h-40 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-white/80 backdrop-blur-md rounded-full shadow-inner">
              {rank.icon}
            </div>
          </div>
          
          <h2 className={`text-sm font-black uppercase tracking-[0.2em] mb-2 ${rank.colorClass} opacity-80`}>
             Quiz Result / {scorePercent}% Score
          </h2>
          <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
            {rank.title}
          </h1>
          <div className="inline-block px-6 py-2 bg-gray-900 text-white rounded-full font-bold text-lg mb-6 shadow-lg">
             {correctCount} / {questions.length} 正解
          </div>
          
          <p className="text-gray-800 font-bold text-xl mb-2">{rank.message}</p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{rank.subMessage}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">称号</p>
          <p className={`text-lg font-black ${rank.colorClass}`}>{rank.emoji} {scorePercent === 100 ? '神' : scorePercent >= 80 ? 'マスター' : scorePercent >= 60 ? '秀才' : '見習い'}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">評価</p>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.ceil(scorePercent / 20) ? "currentColor" : "none"}
                className={i < Math.ceil(scorePercent / 20) ? "text-yellow-400" : "text-gray-200"}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onRestart}
          className={`w-full flex items-center justify-center gap-3 text-white font-black py-5 rounded-[2rem] shadow-xl transition-all transform hover:scale-[1.03] active:scale-[0.97] bg-gradient-to-r ${rank.bgGradient}`}
        >
          <RefreshCw size={24} className={scorePercent === 100 ? "animate-spin-slow" : ""} />
          同じトピックで再挑戦
        </button>
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-600 font-bold py-5 rounded-[2rem] border-2 border-gray-100 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
          新しいクイズを作る
        </button>
      </div>

      {scorePercent === 100 && (
        <div className="mt-8 flex justify-center gap-2 animate-bounce">
          <Sparkles className="text-yellow-500" />
          <span className="text-yellow-600 font-black text-sm">PERFECT SCORE CELEBRATION!</span>
          <Sparkles className="text-yellow-500" />
        </div>
      )}
    </div>
  );
};

export default QuizResult;
