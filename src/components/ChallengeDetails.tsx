import React from 'react';
import { CheckCircle2, XCircle, Info, Lightbulb, Flame, BookOpen } from 'lucide-react';
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

export function ChallengeDetails({
  challenge,
  isCorrect,
  error,
  hintVisible,
  setHintVisible,
  track
}: ChallengeDetailsProps) {
  const isExcel = track === 'excel';
  const isPython = track === 'python';
  const isNarrative = challenge.challengeType === 'narrativa';

  const successMessage = isExcel
    ? 'Excelente! Sua fórmula retornou o resultado esperado.'
    : isPython
    ? 'Excelente! Seu script processou os dados corretamente.'
    : 'Excelente! Você acertou a query SQL.';

  const errorMessage = isExcel
    ? 'Erro na Fórmula'
    : isPython
    ? 'Erro de Script'
    : 'Erro de Sintaxe SQL';

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span
            className={
              challenge.difficulty === 'Básico'
                ? 'text-emerald-400 font-semibold'
                : challenge.difficulty === 'Intermediário'
                ? 'text-amber-400 font-semibold'
                : 'text-rose-400 font-semibold'
            }
          >
            {challenge.rank} · {challenge.difficulty}
          </span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-300 font-mono">{challenge.category}</span>
          <span aria-hidden="true">·</span>
          {isNarrative ? (
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5" /> Caso Real de Negócio (Sem Facilitação)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-sky-400 font-medium">
              <BookOpen className="w-3.5 h-3.5" /> Exercício Explicativo (Sintaxe & Conceito)
            </span>
          )}
        </div>

        {isNarrative && challenge.businessContext && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 font-medium">
            Contexto Corporativo: <strong className="text-white">{challenge.businessContext}</strong>
          </div>
        )}

        <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">{challenge.description}</p>
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
            <span className="font-medium">
              Os dados retornados ainda não conferem com o gabarito esperado. Revise as regras de filtragem, colunas e ordenação.
            </span>
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
          {hintVisible
            ? 'Esconder Orientação'
            : isNarrative
            ? 'Ver Pista Analítica (Sem Resposta Pronta)'
            : 'Ver Dica Explicativa'}
        </button>
        {hintVisible && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 text-sm italic text-slate-400"
          >
            {challenge.hint}
          </motion.p>
        )}
      </div>
    </div>
  );
}
