import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Swords,
  Timer,
  Code2,
  Trophy,
  Copy,
  Check,
  Play,
  Users,
  Plus,
  ArrowLeft,
  Zap,
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Award,
  Terminal,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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

// Efficiency formula: Base 10,000 pts - 50 pts/second - 15 pts/character (min 100 pts)
export function calculateEfficiencyScore(timeMs: number, charCount: number): number {
  const secondsPenalty = Math.floor(timeMs / 100) * 5; // 50 pts per second
  const charPenalty = charCount * 15; // 15 pts per character
  return Math.max(100, 10000 - secondsPenalty - charPenalty);
}

// Normalize SQL query length: trim and collapse multiple whitespace into single space
export function getNormalizedCharCount(sql: string): number {
  const cleaned = sql.trim().replace(/\s+/g, ' ');
  return cleaned.length;
}

export function formatDurationMs(ms: number): string {
  const totalTenths = Math.floor(ms / 100);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
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
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('random');
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

  // Arena state
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState<SqlResult[]>([]);
  const [queryError, setQueryError] = useState<string | undefined>();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const arenaStartRef = useRef<number | null>(null);

  const playerName = (user.displayName || user.email?.split('@')[0] || 'Analista').slice(0, 100);

  // Filter challenges by difficulty for selector
  const difficultyChallenges = useMemo(() => {
    return sqlChallenges.filter(c => c.difficulty === selectedDifficulty && !c.isFinalTest);
  }, [sqlChallenges, selectedDifficulty]);

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

  // Listen to user's recent duels as host or guest
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
      arenaStartRef.current = null;
      return;
    }

    const duelRef = doc(db, 'duels', activeDuelId);
    const unsub = onSnapshot(
      duelRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as DuelRoom;
          setActiveDuel(data);

          if (data.status === 'in_progress' && arenaStartRef.current === null) {
            arenaStartRef.current = Date.now();
          }
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `duels/${activeDuelId}`);
      }
    );

    return () => unsub();
  }, [activeDuelId]);

  // Live stopwatch while duel is in_progress and current player hasn't finished
  const amIHost = useMemo(() => {
    if (!activeDuel) return true;
    if (activeDuel.hostUid !== activeDuel.guestUid) {
      return activeDuel.hostUid === user.uid;
    }
    return playerRole === 'host';
  }, [activeDuel, user.uid, playerRole]);

  const myCompleted = amIHost ? activeDuel?.hostCompleted : activeDuel?.guestCompleted;

  useEffect(() => {
    if (!activeDuel || activeDuel.status !== 'in_progress') {
      return;
    }
    if (myCompleted) {
      return;
    }
    if (arenaStartRef.current === null) {
      arenaStartRef.current = Date.now();
    }

    const interval = setInterval(() => {
      if (arenaStartRef.current !== null) {
        setElapsedMs(Date.now() - arenaStartRef.current);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeDuel?.status, myCompleted]);

  // Current duel challenge & schema
  const duelChallenge = useMemo(() => {
    if (!activeDuel) return null;
    return sqlChallenges.find(c => c.id === activeDuel.challengeId) || sqlChallenges[0];
  }, [activeDuel, sqlChallenges]);

  const duelSchema = useMemo(() => {
    if (!duelChallenge) return [];
    return getSchema(duelChallenge.tableSetup);
  }, [duelChallenge, getSchema]);

  // Sync live character count to Firestore (throttled when query changes)
  useEffect(() => {
    if (!activeDuel || activeDuel.status !== 'in_progress' || myCompleted) return;
    const charCount = getNormalizedCharCount(queryText);
    const timer = setTimeout(async () => {
      try {
        const duelRef = doc(db, 'duels', activeDuel.duelId);
        if (amIHost) {
          await updateDoc(duelRef, {
            hostCharCount: charCount,
            updatedAt: serverTimestamp()
          });
        } else {
          await updateDoc(duelRef, {
            guestCharCount: charCount,
            updatedAt: serverTimestamp()
          });
        }
      } catch {
        // Ignore transient throttle errors
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [queryText, activeDuel?.duelId, activeDuel?.status, myCompleted, amIHost]);

  const handleCreateDuel = async (customDifficulty?: Difficulty, customChallengeId?: string) => {
    setLobbyError(null);
    setCreating(true);
    try {
      const targetDiff = customDifficulty || selectedDifficulty;
      const pool = sqlChallenges.filter(c => c.difficulty === targetDiff && !c.isFinalTest);
      const chosenChallenge =
        customChallengeId && customChallengeId !== 'random'
          ? sqlChallenges.find(c => c.id === customChallengeId) || pool[0]
          : selectedChallengeId !== 'random'
          ? sqlChallenges.find(c => c.id === selectedChallengeId) || pool[0]
          : pool[Math.floor(Math.random() * pool.length)] || sqlChallenges[0];

      const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const duelId = `DUEL-${randomCode}`;

      const newDuel: DuelRoom = {
        duelId,
        challengeId: chosenChallenge.id,
        difficulty: chosenChallenge.difficulty,
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
      setQueryText('');
      setResults([]);
      setQueryError(undefined);
      setIsCorrect(null);
      setElapsedMs(0);
      arenaStartRef.current = null;
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
      } else if (data.hostUid === user.uid || data.guestUid === user.uid) {
        setPlayerRole(data.hostUid === user.uid ? 'host' : 'guest');
      } else {
        setLobbyError('Esta sala de duelo já está cheia ou encerrada.');
        setJoining(false);
        return;
      }

      setQueryText('');
      setResults([]);
      setQueryError(undefined);
      setIsCorrect(null);
      setElapsedMs(0);
      arenaStartRef.current = Date.now();
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
    if (!duelChallenge || !activeDuel) return;
    setQueryError(undefined);
    setIsCorrect(null);

    const trimmedQuery = queryText.trim().slice(0, 2000);
    if (!trimmedQuery) {
      setQueryError('Escreva uma query SQL antes de executar.');
      return;
    }

    const res = runQuery(duelChallenge.tableSetup, trimmedQuery);
    if (!res.success || !res.data) {
      setQueryError(res.error);
      return;
    }

    setResults(res.data);

    const solved =
      (res.data.length > 0 && validateDuelResult(res.data[0], duelChallenge)) ||
      (res.data.length === 0 && duelChallenge.expectedOutput.length === 0);

    setIsCorrect(solved);

    if (solved && !myCompleted) {
      onChallengeCompleted(duelChallenge.id);
      const finalTimeMs = Math.max(100, elapsedMs || (arenaStartRef.current ? Date.now() - arenaStartRef.current : 5000));
      const finalCharCount = getNormalizedCharCount(trimmedQuery);
      const finalScore = calculateEfficiencyScore(finalTimeMs, finalCharCount);

      try {
        const duelRef = doc(db, 'duels', activeDuel.duelId);
        if (amIHost) {
          const bothDone = activeDuel.guestCompleted;
          let winner = activeDuel.winnerUid;
          let nextStatus: DuelRoom['status'] = activeDuel.status;

          if (bothDone) {
            nextStatus = 'completed';
            if (finalScore > activeDuel.guestScore) winner = 'host';
            else if (activeDuel.guestScore > finalScore) winner = 'guest';
            else winner = 'tie';
          }

          await updateDoc(duelRef, {
            hostCompleted: true,
            hostTimeMs: finalTimeMs,
            hostCharCount: finalCharCount,
            hostQuery: trimmedQuery,
            hostScore: finalScore,
            status: nextStatus,
            winnerUid: winner,
            updatedAt: serverTimestamp()
          });
        } else {
          const bothDone = activeDuel.hostCompleted;
          let winner = activeDuel.winnerUid;
          let nextStatus: DuelRoom['status'] = activeDuel.status;

          if (bothDone) {
            nextStatus = 'completed';
            if (finalScore > activeDuel.hostScore) winner = 'guest';
            else if (activeDuel.hostScore > finalScore) winner = 'host';
            else winner = 'tie';
          }

          await updateDoc(duelRef, {
            guestCompleted: true,
            guestTimeMs: finalTimeMs,
            guestCharCount: finalCharCount,
            guestQuery: trimmedQuery,
            guestScore: finalScore,
            status: nextStatus,
            winnerUid: winner,
            updatedAt: serverTimestamp()
          });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `duels/${activeDuel.duelId}`);
      }
    }
  };

  // Allow player who already solved to finalize the duel if opponent gave up or disconnected
  const handleFinalizeDuelNow = async () => {
    if (!activeDuel || activeDuel.status !== 'in_progress' || !myCompleted) return;
    try {
      const duelRef = doc(db, 'duels', activeDuel.duelId);
      const winner = amIHost
        ? activeDuel.guestCompleted && activeDuel.guestScore > activeDuel.hostScore
          ? 'guest'
          : 'host'
        : activeDuel.hostCompleted && activeDuel.hostScore > activeDuel.guestScore
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
  const currentLiveScore = calculateEfficiencyScore(elapsedMs, currentLiveChars);

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
            <span>Lobby de Espera · Modo Duelo SQL</span>
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
                <span>Desafio: {duelChallenge?.title}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Aguardando Oponente...</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Compartilhe o código abaixo com outro usuário (ou abra outra aba para testar simultaneamente). O duelo iniciará automaticamente assim que o oponente entrar.
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

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-left">
                <span className="text-xs text-slate-500 block mb-1">Desafiante 1 (Host)</span>
                <p className="text-sm font-semibold text-white truncate">{activeDuel.hostName}</p>
                <span className="text-xs text-emerald-400 mt-1 inline-block">Pronto na arena</span>
              </div>
              <div className="p-4 bg-slate-950/60 border border-dashed border-slate-800 rounded-xl text-left flex flex-col justify-between">
                <span className="text-xs text-slate-500 block mb-1">Desafiante 2</span>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Conectando...</span>
                </div>
                <span className="text-xs text-slate-600 mt-1">Sala visível no lobby</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 text-left">
                Quer testar o duelo agora mesmo sem esperar outro jogador?
              </p>
              <button
                onClick={() => handleJoinDuel(activeDuel.duelId)}
                className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
              >
                Iniciar Arena Imediatamente
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2. COMPLETED DUEL RESULTS VIEW
  if (activeDuel && activeDuel.status === 'completed' && activeDuel.winnerUid !== 'cancelled') {
    const isHostWinner =
      activeDuel.winnerUid === 'host' ||
      (activeDuel.winnerUid === activeDuel.hostUid && activeDuel.hostScore >= activeDuel.guestScore);
    const isGuestWinner =
      activeDuel.winnerUid === 'guest' ||
      (activeDuel.winnerUid === activeDuel.guestUid && activeDuel.guestScore > activeDuel.hostScore);
    const isTie = activeDuel.winnerUid === 'tie' || activeDuel.hostScore === activeDuel.guestScore;

    const fasterPlayer =
      activeDuel.hostCompleted && activeDuel.guestCompleted
        ? activeDuel.hostTimeMs <= activeDuel.guestTimeMs
          ? 'host'
          : 'guest'
        : activeDuel.hostCompleted
        ? 'host'
        : 'guest';

    const shorterQueryPlayer =
      activeDuel.hostCompleted && activeDuel.guestCompleted
        ? activeDuel.hostCharCount <= activeDuel.guestCharCount
          ? 'host'
          : 'guest'
        : activeDuel.hostCompleted
        ? 'host'
        : 'guest';

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
            <span>Resultado Oficial · {activeDuel.duelId}</span>
          </div>
          <button
            onClick={() => handleCreateDuel(activeDuel.difficulty, activeDuel.challengeId)}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
          >
            Nova Partida
          </button>
        </header>

        <main className="max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
          {/* Winner Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
            <div className="text-xs text-slate-400">
              <span>Desafio: {duelChallenge?.title}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Dificuldade {activeDuel.difficulty}</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isTie
                ? 'Empate Técnico de Eficiência!'
                : isHostWinner
                ? `Vitória de ${activeDuel.hostName}!`
                : `Vitória de ${activeDuel.guestName || 'Desafiante 2'}!`}
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              A pontuação final combina velocidade de raciocínio (menor tempo de execução) e concisão de código SQL (menor número de caracteres).
            </p>
          </div>

          {/* Side-by-Side Efficiency Comparison */}
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
                     Jogador 1 · {isHostWinner && !isTie ? 'Vencedor Mais Eficiente' : 'Participante'}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">{activeDuel.hostName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Índice de Eficiência</span>
                  <span className="text-2xl font-mono font-bold text-sky-400 tabular-nums">
                    {activeDuel.hostScore} pts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Tempo de Resolução</span>
                  <span className="text-lg font-mono font-bold text-white tabular-nums">
                    {activeDuel.hostCompleted ? formatDurationMs(activeDuel.hostTimeMs) : 'Não concluiu'}
                  </span>
                  {fasterPlayer === 'host' && activeDuel.hostCompleted && (
                    <span className="block text-xs text-emerald-400 mt-1">Mais rápido</span>
                  )}
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Tamanho da Query</span>
                  <span className="text-lg font-mono font-bold text-white tabular-nums">
                    {activeDuel.hostCharCount} caracteres
                  </span>
                  {shorterQueryPlayer === 'host' && activeDuel.hostCompleted && (
                    <span className="block text-xs text-emerald-400 mt-1">Query mais enxuta</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400 block">Query SQL Submetida</span>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-sky-400 overflow-x-auto whitespace-pre-wrap">
                  {activeDuel.hostQuery || '-- Nenhuma query finalizada'}
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
                    Jogador 2 · {isGuestWinner && !isTie ? 'Vencedor Mais Eficiente' : 'Participante'}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    {activeDuel.guestName || 'Desafiante 2'}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Índice de Eficiência</span>
                  <span className="text-2xl font-mono font-bold text-sky-400 tabular-nums">
                    {activeDuel.guestScore} pts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Tempo de Resolução</span>
                  <span className="text-lg font-mono font-bold text-white tabular-nums">
                    {activeDuel.guestCompleted ? formatDurationMs(activeDuel.guestTimeMs) : 'Não concluiu'}
                  </span>
                  {fasterPlayer === 'guest' && activeDuel.guestCompleted && (
                    <span className="block text-xs text-emerald-400 mt-1">Mais rápido</span>
                  )}
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-xs text-slate-400 block mb-1">Tamanho da Query</span>
                  <span className="text-lg font-mono font-bold text-white tabular-nums">
                    {activeDuel.guestCharCount} caracteres
                  </span>
                  {shorterQueryPlayer === 'guest' && activeDuel.guestCompleted && (
                    <span className="block text-xs text-emerald-400 mt-1">Query mais enxuta</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400 block">Query SQL Submetida</span>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-sky-400 overflow-x-auto whitespace-pre-wrap">
                  {activeDuel.guestQuery || '-- Nenhuma query finalizada'}
                </pre>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. LIVE DUEL ARENA VIEW (in_progress)
  if (activeDuel && activeDuel.status === 'in_progress' && duelChallenge) {
    const opponentCompleted = amIHost ? activeDuel.guestCompleted : activeDuel.hostCompleted;
    const opponentName = amIHost ? activeDuel.guestName || 'Desafiante 2' : activeDuel.hostName;
    const opponentChars = amIHost ? activeDuel.guestCharCount : activeDuel.hostCharCount;
    const opponentTimeMs = amIHost ? activeDuel.guestTimeMs : activeDuel.hostTimeMs;
    const opponentScore = amIHost ? activeDuel.guestScore : activeDuel.hostScore;

    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
        {/* Top Real-Time Duel HUD */}
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
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono">{activeDuel.duelId}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeDuel.difficulty}</span>
                </div>
                <h1 className="text-sm font-bold text-white truncate max-w-xs">
                  {duelChallenge.title}
                </h1>
              </div>
            </div>

            {/* Live Efficiency Telemetry */}
            <div className="flex items-center gap-6 bg-slate-950 border border-slate-800 px-5 py-2 rounded-xl">
              <div>
                <span className="text-[11px] text-slate-500 block">Tempo Decorrido</span>
                <span className="text-base font-mono font-bold text-white tabular-nums">
                  {formatDurationMs(myCompleted ? (amIHost ? activeDuel.hostTimeMs : activeDuel.guestTimeMs) : elapsedMs)}
                </span>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div>
                <span className="text-[11px] text-slate-500 block">Caracteres SQL</span>
                <span className="text-base font-mono font-bold text-sky-400 tabular-nums">
                  {myCompleted ? (amIHost ? activeDuel.hostCharCount : activeDuel.guestCharCount) : currentLiveChars} chars
                </span>
              </div>
              <div className="h-7 w-px bg-slate-800" />
              <div>
                <span className="text-[11px] text-slate-500 block">Eficiência Estimada</span>
                <span className="text-base font-mono font-bold text-emerald-400 tabular-nums">
                  {myCompleted ? (amIHost ? activeDuel.hostScore : activeDuel.guestScore) : currentLiveScore} pts
                </span>
              </div>
            </div>

            {/* Opponent Live Status */}
            <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">
                  Oponente: <strong className="text-white">{opponentName}</strong>
                </span>
                {opponentCompleted ? (
                  <span className="text-xs font-mono text-emerald-400 tabular-nums">
                    Concluiu · {formatDurationMs(opponentTimeMs)} · {opponentChars} chars ({opponentScore} pts)
                  </span>
                ) : (
                  <span className="text-xs font-mono text-amber-400 tabular-nums">
                    Codificando... · {opponentChars} chars
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Banner when current user finished first and is waiting for opponent */}
        {myCompleted && !opponentCompleted && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Você resolveu o desafio com <strong>{amIHost ? activeDuel.hostCharCount : activeDuel.guestCharCount} caracteres</strong> em{' '}
                  <strong>{formatDurationMs(amIHost ? activeDuel.hostTimeMs : activeDuel.guestTimeMs)}</strong>! Aguardando o oponente concluir ou encerre para ver o placar.
                </span>
              </div>
              <button
                onClick={handleFinalizeDuelNow}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
              >
                Ver Resultado Final Agora
              </button>
            </div>
          </div>
        )}

        {/* Split Arena Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Problem Statement, Tables & Output */}
          <div className="space-y-6 min-w-0">
            <ChallengeDetails
              challenge={duelChallenge}
              isCorrect={isCorrect}
              error={queryError}
              hintVisible={hintVisible}
              setHintVisible={setHintVisible}
              track="sql"
            />

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                Tabelas de Entrada do Duelo
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
                    Execute sua query SQL para validar o resultado e travar seu tempo e contagem de caracteres.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: SQL Editor & Efficiency Breakdown */}
          <div className="flex flex-col gap-4 min-h-[460px]">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
              <div>
                <span className="text-white font-semibold">Regra de Eficiência SQL:</span> Menor tempo (-50 pts/s) e query mais enxuta (-15 pts/caractere).
              </div>
              <span className="font-mono text-sky-400 tabular-nums shrink-0 ml-2">
                {currentLiveChars} caracteres
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
          <span className="text-base font-bold text-white tracking-tight">Modo Duelo SQL</span>
        </div>

        <div className="text-xs text-slate-400 hidden sm:block">
          Jogador: <strong className="text-white">{playerName}</strong>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto p-6 md:p-10 space-y-10">
        {/* Hero Explanation & Rules */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs text-sky-400 font-semibold">
              Competição Síncrona em Tempo Real · Eficiência de Query SQL
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Quem escreve a Query SQL mais rápida e enxuta?
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              No Modo Duelo, dois analistas resolvem o mesmo desafio SQL simultaneamente. O vencedor não é apenas quem termina rápido, mas quem atinge o maior{' '}
              <strong className="text-slate-200">Índice de Eficiência</strong> combinando menor tempo de resolução e menor quantidade de caracteres na query.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 shrink-0">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-500 block">Base Inicial</span>
              <span className="text-lg font-mono font-bold text-white tabular-nums">10.000 pts</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-500 block">Custo Tempo</span>
              <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">-50 pts/s</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <span className="text-xs text-slate-500 block">Custo Código</span>
              <span className="text-lg font-mono font-bold text-sky-400 tabular-nums">-15 pts/char</span>
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

        {/* Create Room & Join by Code Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Duel Room */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Criar Nova Sala de Duelo</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Escolha o nível de complexidade e o desafio SQL para gerar um código de sala compartilhável.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 block">Nível de Dificuldade</label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                  {(['Básico', 'Intermediário', 'Avançado'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => {
                        setSelectedDifficulty(diff);
                        setSelectedChallengeId('random');
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
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
                <label className="text-xs font-medium text-slate-400 block">Desafio SQL da Partida</label>
                <select
                  value={selectedChallengeId}
                  onChange={(e) => setSelectedChallengeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500"
                >
                  <option value="random">Sorteio Aleatório ({difficultyChallenges.length} desafios em {selectedDifficulty})</option>
                  {difficultyChallenges.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      [{ch.category}] {ch.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => handleCreateDuel()}
              disabled={creating}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Criar Sala de Duelo SQL
            </button>
          </div>

          {/* Join By Room Code or Open Rooms */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">Entrar com Código de Sala</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Recebeu um código de duelo de outro usuário? Digite-o abaixo para iniciar a disputa imediatamente.
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

              {/* Open Rooms List */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Salas Abertas Aguardando Oponente ({openDuels.length})
                  </span>
                </div>

                {openDuels.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {openDuels.map((room) => {
                      const ch = sqlChallenges.find(c => c.id === room.challengeId);
                      return (
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
                              {ch?.title || room.challengeId}
                            </p>
                          </div>
                          <button
                            onClick={() => handleJoinDuel(room.duelId)}
                            className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500 hover:text-slate-950 text-sky-400 border border-sky-500/20 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                          >
                            Aceitar Duelo
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-950/50 border border-dashed border-slate-800 rounded-xl text-center">
                    <p className="text-xs text-slate-500">
                      Nenhuma sala aguardando no momento. Crie uma sala ao lado para desafiar outro analista!
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
                      <th className="py-3 px-4 font-medium">Desafio SQL</th>
                      <th className="py-3 px-4 font-medium">Confronto</th>
                      <th className="py-3 px-4 font-medium text-right">Tempo (Host / Guest)</th>
                      <th className="py-3 px-4 font-medium text-right">Chars (Host / Guest)</th>
                      <th className="py-3 px-4 font-medium text-right">Placar Eficiência</th>
                      <th className="py-3 px-4 font-medium text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {myDuels
                      .filter(d => d.winnerUid !== 'cancelled')
                      .slice(0, 10)
                      .map((duel) => {
                        const ch = sqlChallenges.find(c => c.id === duel.challengeId);
                        return (
                          <tr key={duel.duelId} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-mono text-xs text-sky-400 tabular-nums">
                              {duel.duelId}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-white text-xs">{ch?.title || duel.challengeId}</div>
                              <div className="text-[11px] text-slate-500">{duel.difficulty}</div>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-300">
                              {duel.hostName} <span className="text-slate-600">vs</span> {duel.guestName || 'Aguardando...'}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-300 tabular-nums">
                              {duel.hostCompleted ? formatDurationMs(duel.hostTimeMs) : '--'} /{' '}
                              {duel.guestCompleted ? formatDurationMs(duel.guestTimeMs) : '--'}
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs text-slate-300 tabular-nums">
                              {duel.hostCharCount}c / {duel.guestCharCount}c
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-emerald-400 tabular-nums">
                              {duel.hostScore} vs {duel.guestScore} pts
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setPlayerRole(duel.hostUid === user.uid ? 'host' : 'guest');
                                  setActiveDuelId(duel.duelId);
                                }}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                              >
                                {duel.status === 'completed' ? 'Ver Placar' : 'Abrir Arena'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center">
              <p className="text-slate-400 text-sm">Você ainda não participou de nenhum duelo SQL.</p>
              <p className="text-slate-500 text-xs mt-1">
                Crie uma sala acima para comparar a velocidade e concisão das suas queries!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
