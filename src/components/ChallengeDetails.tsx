import React from 'react';
import { CheckCircle2, XCircle, Info, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { Challenge } from '../types';

interface ChallengeDetailsProps {
  challenge: Challenge;
  isCorrect: boolean | null;
  error?: string;
  hintVisible: boolean;
  setHintVisible: (v: boolean) => void;
  track?: string;
}

export function ChallengeDetails({ challenge, isCorrect, error, hintVisible, setHintVisible, track }: ChallengeDetailsProps) {
  const isExcel = track === 'excel';
  const isPython = track === 'python';

  const successMessage = isExcel 
    ? "Excelente! Sua fórmula retornou o resultado esperado." 
    : isPython 
      ? "Excelente! Seu script processou os dados corretamente." 
      : "Excelente! Você acertou a query SQL.";

  const errorMessage = isExcel 
    ? "Erro na Fórmula" 
    : isPython 
      ? "Erro de Script" 
      : "Erro de Sintaxe SQL";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
            challenge.difficulty === 'Básico' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
            challenge.difficulty === 'Intermediário' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
            'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {challenge.rank}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
            {challenge.difficulty}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border border-slate-700 text-slate-500 italic">
            {challenge.category}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{challenge.title}</h2>
        <p className="text-slate-300 leading-relaxed">{challenge.description}</p>
      </div>

      <div className="space-y-3">
        {isCorrect === true && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </motion.div>
        )}

        {isCorrect === false && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400"
          >
            <Info className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Quase lá! Os dados não conferem com o esperado. Tente novamente.</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
          >
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-sm uppercase">{errorMessage}</span>
              <span className="text-sm font-mono opacity-80">{error}</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={() => setHintVisible(!hintVisible)}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-sky-400 transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          {hintVisible ? 'Esconder Dica' : 'Ver Dica'}
        </button>
        {hintVisible && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 text-sm italic text-slate-500"
          >
            {challenge.hint}
          </motion.p>
        )}
      </div>
    </div>
  );
}
