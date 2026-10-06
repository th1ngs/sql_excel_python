import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Swords,
  Trophy,
  Copy,
  Check,
  Plus,
  ArrowLeft,
  Database,
  CheckCircle2,
  Loader2,
  Terminal,
  Flame,
  Zap
} from 'lucide-react';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  query as fsQuery,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Challenge, Difficulty, DuelRoom, SimpleUser, SqlResult } from '../types';
import { duelQuestions } from '../data/duelQuestions';
import { SqlEditor } from './SqlEditor';
import { DataTable } from './DataTable';
import { ChallengeDetails } from './ChallengeDetails';

interface DuelModeProps {
  user: SimpleUser;
  sqlChallenges: Challenge[];
  runQuery: (setup: string[], query: string) => { success: boolean; data?: SqlResult[]; error?: string };
  getSchema: (setup: string[]) => { name: string; data: SqlResult }[];
  onBack: () => void;
  onChallengeCompleted: (challengeId: string) => void;
}

const QUESTIONS_PER_DUEL = 5;

/**
 * Calcula quantos pontos o jogador GANHA ao acertar uma pergunta do duelo:
 * O placar começa em 0 e NUNCA desce — o jogador apenas GANHA pontos a cada acerto
 * com base nos mesmos 3 critérios:
 * 1) +1.000 pts pela resposta correta
 * 2) Até +500 pts de Bônus por Menor Tempo (curva suave: perde apenas 5 pts a cada 2s, mínimo +100 pts)
 * 3) Até +500 pts de Bônus por Menos Caracteres (concisão SQL, mínimo +100 pts)
 */
export function calculateQuestionGain(questionTimeMs: number, charCount: number): {
  basePts: number;
  timeBonus: number;
  charBonus: number;
  totalGain: number;
} {
  const basePts = 1000;
  const elapsedSec = Math.floor(questionTimeMs / 1000);
  const timeBonus = Math.max(100, 500 - Math.floor(elapsedSec / 2) * 5);
  const charBonus = Math.max(100, Math.min(500, 550 - charCount * 2));
  return {
    basePts,
    timeBonus,
    charBonus,
    totalGain: basePts + timeBonus + charBonus
  };
}

export function getNormalizedCharCount(sql: string): number {
  const cleaned = sql.trim().replace(/\s+/g, ' ');
  return cleaned.length;
}

export function formatDurationMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}s`;
}

// Extrai quantas perguntas foram respondidas a partir do log salvo em hostQuery / guestQuery
function parseSolvedCount(queryLog: string, isCompleted: boolean): number {
  if (isCompleted) return QUESTIONS_PER_DUEL;
  if (!queryLog) return 0;
  const matches = queryLog.match(/\[Q\d\/5\]/g);
  return matches ? matches.length : 0;
}

export function DuelMode({
  user,
  sqlChallenges,
  runQuery,
  getSchema,
  onBack,
  onChallengeCompleted
}: DuelModeProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Básico');
  const [selectedPack, setSelectedPack] = useState<'random' | 'pack1' | 'pack2' | 'pack3'>('random');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [activeDuelId, setActiveDuelId] = useState<string | null>(null);
  const [playerRole, setPlayerRole] = useState<'host' | 'guest'>('host');
  const [activeDuel, setActiveDuel] = useState<DuelRoom | null>(null);
  const [openDuels, setOpenDuels] = useState<DuelRoom[]>([]);
  const [myDuels, setMyDuels] = useState<DuelRoom[]>([]);
  const [lobbyError, setLobbyError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Estado da série de 5 perguntas na Arena
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 a 4
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState<SqlResult[]>([]);
  const [queryError, setQueryError] = useState<string | undefined>();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [questionElapsedMs, setQuestionElapsedMs] = useState(0);
  const [lastGainBanner, setLastGainBanner] = useState<{
    questionNum: number;
    totalGain: number;
    timeBonus: number;
    charBonus: number;
  } | null>(null);

  const questionStartRef = useRef<number | null>(null);

  const playerName = (user.displayName || user.email?.split('@')[0] || 'Analista').slice(0, 100);

  // Listen to open waiting rooms
  useEffect(() => {
    const q = fsQuery(collection(db, 'duels'), where('status', '==', 'waiting'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const rooms = snap.docs.map(d => d.data() as DuelRoom);
        setOpenDuels(rooms);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'duels');
      }
    );
    return () => unsub();
  }, []);

  // Listen to user's recent duels
  useEffect(() => {
    const qHost = fsQuery(collection(db, 'duels'), where('hostUid', '==', user.uid));
    const qGuest = fsQuery(collection(db, 'duels'), where('guestUid', '==', user.uid));

    let hostList: DuelRoom[] = [];
    let guestList: DuelRoom[] = [];

    const mergeDuels = () => {
      const map = new Map<string, DuelRoom>();
      [...hostList, ...guestList].forEach(d => map.set(d.duelId, d));
      setMyDuels(Array.from(map.values()));
    };

    const unsubHost = onSnapshot(
      qHost,
      (snap) => {
        hostList = snap.docs.map(d => d.data() as DuelRoom);
        mergeDuels();
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'duels');
      }
    );

    const unsubGuest = onSnapshot(
      qGuest,
      (snap) => {
        guestList = snap.docs.map(d => d.data() as DuelRoom);
        mergeDuels();
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'duels');
      }
    );

    return () => {
      unsubHost();
      unsubGuest();
    };
  }, [user.uid]);

  // Listen to currently active duel document
  useEffect(() => {
    if (!activeDuelId) {
      setActiveDuel(null);
      questionStartRef.current = null;
      return;
    }

    const duelRef = doc(db, 'duels', activeDuelId);
    const unsub = onSnapshot(
      duelRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as DuelRoom;
          setActiveDuel(data);

          if (data.status === 'in_progress' && questionStartRef.current === null) {
            questionStartRef.current = Date.now();
          }
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `duels/${activeDuelId}`);
      }
    );

    return () => unsub();
  }, [activeDuelId]);

  const amIHost = useMemo(() => {
    if (!activeDuel) return true;
    if (activeDuel.hostUid !== activeDuel.guestUid) {
      return activeDuel.hostUid === user.uid;
    }
    return playerRole === 'host';
  }, [activeDuel, user.uid, playerRole]);

  const myCompleted = amIHost ? activeDuel?.hostCompleted : activeDuel?.guestCompleted;

  // Cronômetro calmo (atualiza apenas 1x por segundo para medir o tempo da questão)
  useEffect(() => {
    if (!activeDuel || activeDuel.status !== 'in_progress' || myCompleted) {
      return;
    }
    if (questionStartRef.current === null) {
      questionStartRef.current = Date.now();
    }

    const interval = setInterval(() => {
      if (questionStartRef.current !== null) {
        setQuestionElapsedMs(Date.now() - questionStartRef.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeDuel?.status, myCompleted, currentStepIndex]);

  // Decodifica as 5 perguntas do duelo a partir de activeDuel.challengeId (separadas por '--')
  const duelSeries = useMemo((): Challenge[] => {
    if (!activeDuel) return [];
    const ids = activeDuel.challengeId.split('--').filter(Boolean);
    const resolved = ids
      .map(id => duelQuestions.find(c => c.id === id) || sqlChallenges.find(c => c.id === id))
      .filter((c): c is Challenge => Boolean(c));

    if (resolved.length >= QUESTIONS_PER_DUEL) {
      return resolved.slice(0, QUESTIONS_PER_DUEL);
    }

    const fallbackPool = duelQuestions.filter(c => c.difficulty === activeDuel.difficulty);
    const combined = [...resolved];
    for (const item of fallbackPool) {
      if (combined.length >= QUESTIONS_PER_DUEL) break;
      if (!combined.some(x => x.id === item.id)) {
        combined.push(item);
      }
    }
    return combined;
  }, [activeDuel, sqlChallenges]);

  const currentQuestion = duelSeries[currentStepIndex] || duelSeries[0] || null;

  const duelSchema = useMemo(() => {
    if (!currentQuestion) return [];
    return getSchema(currentQuestion.tableSetup);
  }, [currentQuestion, getSchema]);

  // Seleciona 5 perguntas coerentes do banco dedicado de 45 questões de duelo
  const pickFiveDuelQuestions = (difficulty: Difficulty, pack: 'random' | 'pack1' | 'pack2' | 'pack3'): Challenge[] => {
    const candidates = duelQuestions.filter(c => c.difficulty === difficulty);
    if (pack === 'pack1') return candidates.slice(0, 5);
    if (pack === 'pack2') return candidates.slice(5, 10);
    if (pack === 'pack3') return candidates.slice(10, 15);
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, QUESTIONS_PER_DUEL);
  };

  // Preview das perguntas do pacote selecionado no Lobby
  const lobbyPreviewQuestions = useMemo(() => {
    const candidates = duelQuestions.filter(c => c.difficulty === selectedDifficulty);
    if (selectedPack === 'pack1') return candidates.slice(0, 5);
    if (selectedPack === 'pack2') return candidates.slice(5, 10);
    if (selectedPack === 'pack3') return candidates.slice(10, 15);
    return candidates.slice(0, 5);
  }, [selectedDifficulty, selectedPack]);

  const handleCreateDuel = async (customDifficulty?: Difficulty) => {
    setLobbyError(null);
    setCreating(true);
    try {
      const targetDiff = customDifficulty || selectedDifficulty;
      const fiveQuestions = pickFiveDuelQuestions(targetDiff, customDifficulty ? 'random' : selectedPack);
      const encodedIds = fiveQuestions.map(q => q.id).join('--');

      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const duelId = `DUEL-${randomCode}`;

      const newDuel: DuelRoom = {
        duelId,
        challengeId: encodedIds,
        difficulty: targetDiff,
        status: 'waiting',
        hostUid: user.uid,
        hostName: playerName,
        hostCompleted: false,
        hostTimeMs: 0,
        hostCharCount: 0,
        hostQuery: '',
        hostScore: 0,
        guestUid: '',
        guestName: '',
        guestCompleted: false,
        guestTimeMs: 0,
        guestCharCount: 0,
        guestQuery: '',
        guestScore: 0,
        winnerUid: ''
      };

      await setDoc(doc(db, 'duels', duelId), {
        ...newDuel,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setPlayerRole('host');
      setCurrentStepIndex(0);
      setQueryText('');
      setResults([]);
      setQueryError(undefined);
      setIsCorrect(null);
      setQuestionElapsedMs(0);
      setLastGainBanner(null);
      questionStartRef.current = null;
      setActiveDuelId(duelId);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'duels');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinDuel = async (codeToJoin: string) => {
    const cleanCode = codeToJoin.trim().toUpperCase();
    if (!cleanCode || !/^[A-Z0-9_-]{4,64}$/.test(cleanCode)) {
      setLobbyError('Informe um código de sala válido (ex: DUEL-4A2B).');
      return;
    }

    setLobbyError(null);
    setJoining(true);
    try {
      const duelRef = doc(db, 'duels', cleanCode);
      const snap = await getDoc(duelRef);
      if (!snap.exists()) {
        setLobbyError('Sala de duelo não encontrada. Verifique o código.');
        setJoining(false);
        return;
      }

      const data = snap.data() as DuelRoom;
      if (data.status === 'waiting') {
        await updateDoc(duelRef, {
          guestUid: user.uid,
          guestName: data.hostUid === user.uid ? `${playerName} (Desafiante)` : playerName,
          status: 'in_progress',
          updatedAt: serverTimestamp()
        });
        setPlayerRole('guest');
        setCurrentStepIndex(0);
      } else {
        const isHostUser = data.hostUid === user.uid;
        setPlayerRole(isHostUser ? 'host' : 'guest');
        const existingLog = isHostUser ? data.hostQuery : data.guestQuery;
        const solvedSoFar = parseSolvedCount(existingLog, isHostUser ? data.hostCompleted : data.guestCompleted);
        setCurrentStepIndex(Math.min(QUESTIONS_PER_DUEL - 1, solvedSoFar));
      }

      setQueryText('');
      setResults([]);
      setQueryError(undefined);
      setIsCorrect(null);
      setQuestionElapsedMs(0);
      setLastGainBanner(null);
      questionStartRef.current = Date.now();
      setActiveDuelId(cleanCode);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `duels/${cleanCode}`);
    } finally {
      setJoining(false);
    }
  };

  const handleCancelWaitingRoom = async () => {
    if (!activeDuel || activeDuel.status !== 'waiting') {
      setActiveDuelId(null);
      return;
    }
    try {
      await updateDoc(doc(db, 'duels', activeDuel.duelId), {
        status: 'completed',
        winnerUid: 'cancelled',
        updatedAt: serverTimestamp()
      });
      setActiveDuelId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `duels/${activeDuel.duelId}`);
    }
  };

  const validateDuelResult = (result: SqlResult, challenge: Challenge): boolean => {
    const normalize = (val: any) => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'number') return Number(val.toFixed(4));
      if (typeof val === 'string') return val.trim();
      return val;
    };

    const userValues = result.values.map(row => row.map(normalize));
    const expectedOutput = challenge.expectedOutput;

    if (userValues.length !== expectedOutput.length) return false;
    if (expectedOutput.length === 0) return true;

    const expectedKeys = Object.keys(expectedOutput[0]);
    if (userValues[0].length !== expectedKeys.length) return false;

    const expectedRows = expectedOutput.map(obj => expectedKeys.map(k => normalize(obj[k])));

    const checkMatch = (userRows: any[][], expRows: any[][]) => {
      const sortFn = (a: any[], b: any[]) => JSON.stringify(a).localeCompare(JSON.stringify(b));
      const uToCompare = challenge.orderSensitive ? userRows : [...userRows].sort(sortFn);
      const eToCompare = challenge.orderSensitive ? expRows : [...expRows].sort(sortFn);
      return JSON.stringify(uToCompare) === JSON.stringify(eToCompare);
    };

    const numCols = expectedKeys.length;
    const colIndices = Array.from({ length: numCols }, (_, i) => i);
    const permutations: number[][] = [];

    const generate = (arr: number[], m: number[] = []) => {
      if (arr.length === 0) {
        permutations.push(m);
      } else {
        for (let i = 0; i < arr.length; i++) {
          const curr = arr.slice();
          const next = curr.splice(i, 1);
          generate(curr.slice(), m.concat(next));
        }
      }
    };

    if (numCols <= 6) {
      generate(colIndices);
    } else {
      permutations.push(colIndices);
    }

    for (const p of permutations) {
      const permutedUserRows = userValues.map(row => p.map(idx => row[idx]));
      if (checkMatch(permutedUserRows, expectedRows)) {
        return true;
      }
    }
    return false;
  };

  const handleRunDuelQuery = async () => {
    if (!currentQuestion || !activeDuel) return;
    setQueryError(undefined);
    setIsCorrect(null);

    const trimmedQuery = queryText.trim().slice(0, 350);
    if (!trimmedQuery) {
      setQueryError('Escreva uma query SQL antes de executar.');
      return;
    }

    const res = runQuery(currentQuestion.tableSetup, trimmedQuery);
    if (!res.success || !res.data) {
      setQueryError(res.error);
      return;
    }

    setResults(res.data);

    const solved =
      (res.data.length > 0 && validateDuelResult(res.data[0], currentQuestion)) ||
      (res.data.length === 0 && currentQuestion.expectedOutput.length === 0);

    setIsCorrect(solved);

    if (solved && !myCompleted) {
      onChallengeCompleted(currentQuestion.id);

      const qTimeMs = Math.max(
        1000,
        questionElapsedMs || (questionStartRef.current ? Date.now() - questionStartRef.current : 5000)
      );
      const qChars = getNormalizedCharCount(trimmedQuery);
      const gain = calculateQuestionGain(qTimeMs, qChars);

      const questionNumber = currentStepIndex + 1;
      const isLastQuestion = questionNumber >= QUESTIONS_PER_DUEL;

      const prevScore = amIHost ? activeDuel.hostScore : activeDuel.guestScore;
      const prevTimeMs = amIHost ? activeDuel.hostTimeMs : activeDuel.guestTimeMs;
      const prevChars = amIHost ? activeDuel.hostCharCount : activeDuel.guestCharCount;
      const prevQueryLog = amIHost ? activeDuel.hostQuery : activeDuel.guestQuery;

      const newAccumulatedScore = prevScore + gain.totalGain;
      const newTotalTimeMs = prevTimeMs + qTimeMs;
      const newTotalChars = prevChars + qChars;
      const entryLog = `[Q${questionNumber}/5] (+${gain.totalGain} pts · ${formatDurationMs(qTimeMs)} · ${qChars}c) ${trimmedQuery}`;
      const newQueryLog = (prevQueryLog ? `${prevQueryLog}\n${entryLog}` : entryLog).slice(0, 2000);

      setLastGainBanner({
        questionNum: questionNumber,
        totalGain: gain.totalGain,
        timeBonus: gain.timeBonus,
        charBonus: gain.charBonus
      });

      try {
        const duelRef = doc(db, 'duels', activeDuel.duelId);
        if (amIHost) {
          const bothFinishedAll = isLastQuestion && activeDuel.guestCompleted;
          let winner = activeDuel.winnerUid;
          let nextStatus: DuelRoom['status'] = activeDuel.status;

          if (bothFinishedAll) {
            nextStatus = 'completed';
            if (newAccumulatedScore > activeDuel.guestScore) winner = 'host';
            else if (activeDuel.guestScore > newAccumulatedScore) winner = 'guest';
            else winner = 'tie';
          }

          await updateDoc(duelRef, {
            hostCompleted: isLastQuestion,
            hostTimeMs: newTotalTimeMs,
            hostCharCount: newTotalChars,
            hostQuery: newQueryLog,
            hostScore: newAccumulatedScore,
            status: nextStatus,
            winnerUid: winner,
            updatedAt: serverTimestamp()
          });
        } else {
          const bothFinishedAll = isLastQuestion && activeDuel.hostCompleted;
          let winner = activeDuel.winnerUid;
          let nextStatus: DuelRoom['status'] = activeDuel.status;

          if (bothFinishedAll) {
            nextStatus = 'completed';
            if (newAccumulatedScore > activeDuel.hostScore) winner = 'guest';
            else if (activeDuel.hostScore > newAccumulatedScore) winner = 'host';
            else winner = 'tie';
          }

          await updateDoc(duelRef, {
            guestCompleted: isLastQuestion,
            guestTimeMs: newTotalTimeMs,
            guestCharCount: newTotalChars,
            guestQuery: newQueryLog,
            guestScore: newAccumulatedScore,
            status: nextStatus,
            winnerUid: winner,
            updatedAt: serverTimestamp()
          });
        }

        // Se ainda não é a 5ª pergunta, avança automaticamente para a próxima pergunta do duelo!
        if (!isLastQuestion) {
          setTimeout(() => {
            setCurrentStepIndex(prev => Math.min(QUESTIONS_PER_DUEL - 1, prev + 1));
            setQueryText('');
            setResults([]);
            setQueryError(undefined);
            setIsCorrect(null);
            setHintVisible(false);
            setQuestionElapsedMs(0);
            questionStartRef.current = Date.now();
          }, 950);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `duels/${activeDuel.duelId}`);
      }
    }
  };

  const handleFinalizeDuelNow = async () => {
    if (!activeDuel || activeDuel.status !== 'in_progress' || !myCompleted) return;
    try {
      const duelRef = doc(db, 'duels', activeDuel.duelId);
      const winner = amIHost
        ? activeDuel.guestScore > activeDuel.hostScore
          ? 'guest'
          : 'host'
        : activeDuel.hostScore > activeDuel.guestScore
        ? 'host'
        : 'guest';

      if (amIHost) {
        await updateDoc(duelRef, {
          hostCompleted: activeDuel.hostCompleted,
          hostTimeMs: activeDuel.hostTimeMs,
          hostCharCount: activeDuel.hostCharCount,
          hostQuery: activeDuel.hostQuery,
          hostScore: activeDuel.hostScore,
          status: 'completed',
          winnerUid: winner,
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(duelRef, {
          guestCompleted: activeDuel.guestCompleted,
          guestTimeMs: activeDuel.guestTimeMs,
          guestCharCount: activeDuel.guestCharCount,
          guestQuery: activeDuel.guestQuery,
          guestScore: activeDuel.guestScore,
          status: 'completed',
          winnerUid: winner,
          updatedAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `duels/${activeDuel.duelId}`);
    }
  };

  const copyRoomCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentLiveChars = getNormalizedCharCount(queryText);

  // 1. WAITING ROOM VIEW
  if (activeDuel && activeDuel.status === 'waiting') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <button
            onClick={handleCancelWaitingRoom}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Cancelar Sala
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Swords className="w-4 h-4 text-sky-400" />
            <span>Desafio de 5 Perguntas · Sala de Espera</span>
          </div>
          <div className="text-xs font-mono text-slate-400 tabular-nums">{activeDuel.duelId}</div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto">
              <Swords className="w-8 h-8 text-sky-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="text-xs text-slate-400">
                <span>Dificuldade {activeDuel.difficulty}</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Bateria de {QUESTIONS_PER_DUEL} Perguntas SQL</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Aguardando Oponente...</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Compartilhe o código da sala ou abra outra aba com outro usuário para disputar as 5 perguntas SQL simultaneamente.
              </p>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center gap-4">
              <span className="text-xs text-slate-500 font-medium">Código da Sala de Duelo</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-mono font-bold tracking-wider text-sky-400 tabular-nums">
                  {activeDuel.duelId}
                </span>
                <button
                  onClick={() => copyRoomCode(activeDuel.duelId)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedCode ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Preview das 5 perguntas sorteadas */}
            <div className="text-left space-y-2 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-semibold text-slate-400 block">
                5 Perguntas deste Desafio:
              </span>
              <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                {duelSeries.map((q) => (
                  <li key={q.id} className="truncate">
                    <span className="text-sky-400 font-mono mr-1">[{q.category}]</span> {q.title}
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-left">
                Quer iniciar a bateria de 5 perguntas agora mesmo?
              </p>
              <button
                onClick={() => handleJoinDuel(activeDuel.duelId)}
                className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
              >
                Iniciar as 5 Perguntas Agora
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2. COMPLETED DUEL RESULTS VIEW
  if (activeDuel && activeDuel.status === 'completed' && activeDuel.winnerUid !== 'cancelled') {
    const isHostWinner = activeDuel.hostScore > activeDuel.guestScore;
    const isGuestWinner = activeDuel.guestScore > activeDuel.hostScore;
    const isTie = activeDuel.hostScore === activeDuel.guestScore;

    const hostSolvedCount = parseSolvedCount(activeDuel.hostQuery, activeDuel.hostCompleted);
    const guestSolvedCount = parseSolvedCount(activeDuel.guestQuery, activeDuel.guestCompleted);

    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <button
            onClick={() => setActiveDuelId(null)}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Lobby de Duelos
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Resultado Final (5 Perguntas) · {activeDuel.duelId}</span>
          </div>
          <button
            onClick={() => handleCreateDuel(activeDuel.difficulty)}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
          >
            Novo Desafio de 5 Perguntas
          </button>
        </header>

        <main className="max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <div className="text-xs text-slate-400">
              <span>Desafio de {QUESTIONS_PER_DUEL} Perguntas SQL</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Dificuldade {activeDuel.difficulty}</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isTie
                ? 'Empate Técnico na Série!'
                : isHostWinner
                ? `Vitória de ${activeDuel.hostName} (+${activeDuel.hostScore} pts)!`
                : `Vitória de ${activeDuel.guestName || 'Desafiante 2'} (+${activeDuel.guestScore} pts)!`}
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Pontos ganhos e acumulados ao longo das 5 questões pelos mesmos critérios: acerto da query (+1.000 pts), menor tempo de resolução (até +500 pts) e menos caracteres digitados (até +500 pts).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Host Card */}
            <div
              className={`p-6 rounded-2xl border ${
                isHostWinner && !isTie
                  ? 'bg-slate-900 border-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              } space-y-6`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400 block">
                    Jogador 1 · {hostSolvedCount}/{QUESTIONS_PER_DUEL} Resolvidas
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{activeDuel.hostName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total de Pontos Ganhos</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                    +{activeDuel.hostScore} pts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Tempo Total nas 5 Questões</span>
                  <span className="text-lg font-mono font-bold text-white tabular-nums">
                    {formatDurationMs(activeDuel.hostTimeMs)}
                  </span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Total de Caracteres</span>
                  <span className="text-lg font-mono font-bold text-sky-400 tabular-nums">
                    {activeDuel.hostCharCount} chars
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400 block">
                  Histórico das 5 Queries e Pontos Ganhos
                </span>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-sky-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {activeDuel.hostQuery || '-- Nenhuma query submetida'}
                </pre>
              </div>
            </div>

            {/* Guest Card */}
            <div
              className={`p-6 rounded-2xl border ${
                isGuestWinner && !isTie
                  ? 'bg-slate-900 border-emerald-500/40'
                  : 'bg-slate-900/60 border-slate-800'
              } space-y-6`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400 block">
                    Jogador 2 · {guestSolvedCount}/{QUESTIONS_PER_DUEL} Resolvidas
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {activeDuel.guestName || 'Desafiante 2'}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total de Pontos Ganhos</span>
                  <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                    +{activeDuel.guestScore} pts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Tempo Total nas 5 Questões</span>
                  <span className="text-lg font-mono font-bold text-white tabular-nums">
                    {formatDurationMs(activeDuel.guestTimeMs)}
                  </span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Total de Caracteres</span>
                  <span className="text-lg font-mono font-bold text-sky-400 tabular-nums">
                    {activeDuel.guestCharCount} chars
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400 block">
                  Histórico das 5 Queries e Pontos Ganhos
                </span>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-sky-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {activeDuel.guestQuery || '-- Nenhuma query submetida'}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. LIVE DUEL ARENA VIEW (in_progress — 5 QUESTIONS)
  if (activeDuel && activeDuel.status === 'in_progress' && currentQuestion) {
    const myScore = amIHost ? activeDuel.hostScore : activeDuel.guestScore;
    const mySolvedCount = parseSolvedCount(
      amIHost ? activeDuel.hostQuery : activeDuel.guestQuery,
      Boolean(myCompleted)
    );

    const opponentCompleted = amIHost ? activeDuel.guestCompleted : activeDuel.hostCompleted;
    const opponentName = amIHost ? activeDuel.guestName || 'Desafiante 2' : activeDuel.hostName;
    const opponentScore = amIHost ? activeDuel.guestScore : activeDuel.hostScore;
    const opponentSolvedCount = parseSolvedCount(
      amIHost ? activeDuel.guestQuery : activeDuel.hostQuery,
      Boolean(opponentCompleted)
    );

    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
        {/* Top Real-Time 5-Question Duel HUD */}
        <header className="px-6 py-3 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveDuelId(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Sair
              </button>
              <div className="h-5 w-px bg-slate-800" />
              <div>
                <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold">
                  <span>
                    Pergunta {currentStepIndex + 1} de {QUESTIONS_PER_DUEL}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400 font-mono">{activeDuel.duelId}</span>
                </div>
                {/* 5-Step Progress Bar */}
                <div className="flex items-center gap-1.5 mt-1">
                  {Array.from({ length: QUESTIONS_PER_DUEL }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-7 rounded-sm transition-colors ${
                        idx < mySolvedCount
                          ? 'bg-emerald-500'
                          : idx === currentStepIndex
                          ? 'bg-sky-400'
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Additive Points & Efficiency Criteria (Only Goes Up!) */}
            <div className="flex items-center gap-5 bg-slate-950 border border-slate-800 px-5 py-2 rounded-xl">
              <div>
                <span className="text-[11px] text-slate-400 block">Seus Pontos Ganhos</span>
                <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                  +{myScore} pts
                </span>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div>
                <span className="text-[11px] text-slate-400 block">Resolvidas</span>
                <span className="text-sm font-mono font-semibold text-sky-400 tabular-nums">
                  {mySolvedCount}/{QUESTIONS_PER_DUEL}
                </span>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div>
                <span className="text-[11px] text-slate-400 block">Tempo / Caracteres</span>
                <span className="text-sm font-mono text-slate-200 tabular-nums">
                  {formatDurationMs(questionElapsedMs)} · {currentLiveChars} chars
                </span>
              </div>
            </div>

            {/* Opponent Live Status */}
            <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">
                  Oponente: <strong className="text-white">{opponentName}</strong>
                </span>
                <span className="text-xs font-mono text-sky-400 tabular-nums">
                  {opponentCompleted
                    ? `Concluiu 5/5 · +${opponentScore} pts`
                    : `Pergunta ${Math.min(5, opponentSolvedCount + 1)}/5 · +${opponentScore} pts`}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Reward Toast when player solves a question */}
        {lastGainBanner && !myCompleted && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-2.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-emerald-300">
              <span className="font-semibold">
                Pergunta {lastGainBanner.questionNum}/5 correta! Você GANHOU +{lastGainBanner.totalGain} pts (+1.000 acerto, +{lastGainBanner.timeBonus} menor tempo, +{lastGainBanner.charBonus} menos caracteres).
              </span>
              <span className="font-mono">Carregando próxima pergunta...</span>
            </div>
          </div>
        )}

        {/* Banner when current user finished all 5 questions */}
        {myCompleted && !opponentCompleted && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Parabéns! Você completou todas as <strong>5 perguntas do desafio</strong> ganhando{' '}
                  <strong>+{myScore} pontos</strong>! Aguarde o oponente terminar ou encerre para ver o placar comparativo.
                </span>
              </div>
              <button
                onClick={handleFinalizeDuelNow}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
              >
                Ver Placar Final Agora
              </button>
            </div>
          </div>
        )}

        {/* Split Arena Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 min-w-0">
            <ChallengeDetails
              challenge={currentQuestion}
              isCorrect={isCorrect}
              error={queryError}
              hintVisible={hintVisible}
              setHintVisible={setHintVisible}
              track="sql"
            />

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                Tabelas da Pergunta {currentStepIndex + 1} de {QUESTIONS_PER_DUEL}
              </h3>
              <div className="space-y-4">
                {duelSchema.map((table) => (
                  <div key={table.name} className="space-y-2">
                    <div className="text-xs font-mono text-sky-400">Tabela: {table.name}</div>
                    <DataTable result={table.data} variant="sql" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                Resultado da sua Query
              </h3>
              {results.length > 0 ? (
                <DataTable result={results[0]} variant="sql" />
              ) : (
                <div className="h-36 border border-dashed border-slate-800 rounded-xl flex items-center justify-center bg-slate-900/30">
                  <p className="text-slate-500 text-xs">
                    Execute sua query SQL para validar a Pergunta {currentStepIndex + 1}/5 e ganhar pontos!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 min-h-[460px]">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white">Como você ganha pontos ao acertar:</strong> +1.000 pts base + Bônus Menor Tempo (até +500) + Bônus Menos Caracteres (até +500)
                </span>
              </div>
              <span className="font-mono text-sky-400 font-semibold tabular-nums">
                {currentLiveChars} chars digitados
              </span>
            </div>

            <div className="flex-1 min-h-[380px]">
              <SqlEditor
                query={queryText}
                setQuery={setQueryText}
                onRun={handleRunDuelQuery}
                track="sql"
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 4. MAIN DUEL LOBBY VIEW
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar às Trilhas
        </button>

        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-sky-400" />
          <span className="text-base font-bold text-white tracking-tight">
            Modo Duelo SQL · 5 Perguntas por Desafio
          </span>
        </div>

        <div className="text-xs text-slate-400 hidden sm:block">
          Jogador: <strong className="text-white">{playerName}</strong>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto p-6 md:p-10 space-y-10">
        {/* Hero Explanation & Additive Scoring Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs text-sky-400 font-semibold">
              45 Questões Reais de Negócio · 5 Perguntas por Desafio · Pontuação Cumulativa
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Desafio de 5 Perguntas SQL: Ganhe Pontos por Velocidade e Concisão
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Cada desafio de duelo possui <strong className="text-white">5 perguntas práticas de SQL que fazem sentido no mundo real</strong>. Seu placar começa em <strong className="text-white">0 pts</strong> e <strong className="text-emerald-400">nunca desce</strong>: a cada pergunta resolvida, você <strong className="text-emerald-400">ganha pontos</strong> somando acerto, menor tempo de resolução e menor quantidade de caracteres!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 shrink-0">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-500 block">Por Questão Certa</span>
              <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">+1.000 pts</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-500 block">Bônus Menor Tempo</span>
              <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">Até +500 pts</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-500 block">Bônus Menos Chars</span>
              <span className="text-lg font-mono font-bold text-sky-400 tabular-nums">Até +500 pts</span>
            </div>
          </div>
        </div>

        {lobbyError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-between">
            <span>{lobbyError}</span>
            <button onClick={() => setLobbyError(null)} className="text-xs underline ml-4">
              Fechar
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Duel Room */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Criar Desafio de 5 Perguntas</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Escolha o nível de dificuldade e a bateria de 5 perguntas práticas de SQL.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 block">Nível de Dificuldade</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                  {(['Básico', 'Intermediário', 'Avançado'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        selectedDifficulty === diff
                          ? 'bg-sky-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 block">
                  Seleção das 5 Perguntas do Desafio (15 questões disponíveis no nível {selectedDifficulty})
                </label>
                <select
                  value={selectedPack}
                  onChange={(e) => setSelectedPack(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500"
                >
                  <option value="random">Sorteio Aleatório (5 de 15 perguntas do nível {selectedDifficulty})</option>
                  <option value="pack1">Bateria 1 — Operações Comerciais, Vendas & Estoque (5 perguntas)</option>
                  <option value="pack2">Bateria 2 — Contratos, Logística & Indicadores (5 perguntas)</option>
                  <option value="pack3">Bateria 3 — Finanças, Auditoria & Performance (5 perguntas)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-400">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  {selectedPack === 'random'
                    ? `Exemplos de perguntas que caem no nível ${selectedDifficulty}:`
                    : `5 Perguntas incluídas nesta bateria (${selectedDifficulty}):`}
                </div>
                <ol className="space-y-1 text-slate-300 list-decimal list-inside">
                  {lobbyPreviewQuestions.map((q) => (
                    <li key={q.id} className="truncate">
                      <span className="text-sky-400 font-mono mr-1">[{q.category}]</span> {q.title}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <button
              onClick={() => handleCreateDuel()}
              disabled={creating}
              className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Criar Sala com 5 Perguntas ({selectedDifficulty})
            </button>
          </div>

          {/* Join By Room Code or Open Rooms */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Entrar com Código de Sala</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Digite o código compartilhado pelo seu oponente ou aceite um duelo aberto abaixo.
                </p>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="Ex: DUEL-8F2K"
                  maxLength={32}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white outline-none focus:border-sky-500 uppercase"
                />
                <button
                  onClick={() => handleJoinDuel(joinCodeInput)}
                  disabled={joining || !joinCodeInput.trim()}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
                >
                  {joining ? 'Entrando...' : 'Entrar na Sala'}
                </button>
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Salas Abertas Aguardando Oponente ({openDuels.length})
                  </span>
                </div>

                {openDuels.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {openDuels.map((room) => (
                      <div
                        key={room.duelId}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-mono text-sky-400 font-semibold">{room.duelId}</span>
                            <span aria-hidden="true">·</span>
                            <span>Host: {room.hostName}</span>
                            <span aria-hidden="true">·</span>
                            <span>{room.difficulty}</span>
                          </div>
                          <p className="text-xs font-medium text-white truncate mt-0.5">
                            Desafio de 5 Perguntas SQL · Nível {room.difficulty}
                          </p>
                        </div>
                        <button
                          onClick={() => handleJoinDuel(room.duelId)}
                          className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500 hover:text-slate-950 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                        >
                          Aceitar Duelo
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-950/50 border border-dashed border-slate-800 rounded-xl text-center">
                    <p className="text-xs text-slate-500">
                      Nenhuma sala aguardando no momento. Crie um desafio de 5 perguntas ao lado para começar!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Duels Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Meus Duelos Recentes</h2>
            <span className="text-xs text-slate-500 font-mono tabular-nums">{myDuels.length} registros</span>
          </div>

          {myDuels.filter(d => d.winnerUid !== 'cancelled').length > 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs text-slate-400 bg-slate-950/50">
                      <th className="py-3 px-4 font-medium">Sala</th>
                      <th className="py-3 px-4 font-medium">Nível (5 Perguntas)</th>
                      <th className="py-3 px-4 font-medium">Confronto</th>
                      <th className="py-3 px-4 font-medium text-right">Tempo Total</th>
                      <th className="py-3 px-4 font-medium text-right">Total Chars</th>
                      <th className="py-3 px-4 font-medium text-right">Pontos Ganhos</th>
                      <th className="py-3 px-4 font-medium text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {myDuels
                      .filter(d => d.winnerUid !== 'cancelled')
                      .slice(0, 10)
                      .map((duel) => (
                        <tr key={duel.duelId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-mono text-xs text-sky-400 tabular-nums">
                            {duel.duelId}
                          </td>
                          <td className="py-3 px-4 text-xs text-white font-medium">
                            5 Perguntas · {duel.difficulty}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-300">
                            {duel.hostName} <span className="text-slate-600">vs</span>{' '}
                            {duel.guestName || 'Aguardando...'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-xs text-slate-300 tabular-nums">
                            {formatDurationMs(duel.hostTimeMs)} / {formatDurationMs(duel.guestTimeMs)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-xs text-slate-300 tabular-nums">
                            {duel.hostCharCount}c / {duel.guestCharCount}c
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                            +{duel.hostScore} vs +{duel.guestScore} pts
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleJoinDuel(duel.duelId)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                              {duel.status === 'completed' ? 'Ver Placar' : 'Continuar Duelo'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400 text-sm">Você ainda não disputou nenhum duelo SQL.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
