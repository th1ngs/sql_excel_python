import React, { useState, useMemo, useEffect } from 'react';
import { Database, Terminal, DatabaseZap, Award, ChevronLeft, ChevronRight, Menu, X, ShieldCheck, ArrowLeft, Play, LayoutGrid, FileSpreadsheet, Code2, Rocket, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { challenges } from './data/challenges';
import { useSqlEngine } from './hooks/useSqlEngine';
import { Challenge, SqlResult, Track } from './types';
import { SqlEditor } from './components/SqlEditor';
import { DataTable } from './components/DataTable';
import { ChallengeDetails } from './components/ChallengeDetails';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'exercise'>('landing');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [query, setQuery] = useState(challenges[0].initialQuery || '');
  const [results, setResults] = useState<SqlResult[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [schema, setSchema] = useState<{name: string, data: SqlResult}[]>([]);

  const { loading, runQuery, getSchema } = useSqlEngine();

  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => c.track === selectedTrack);
  }, [selectedTrack]);

  const currentChallenge = filteredChallenges[currentChallengeIndex] || filteredChallenges[0];

  useEffect(() => {
    if (!currentChallenge) return;
    setQuery(currentChallenge.initialQuery || '');
    setResults([]);
    setError(undefined);
    setIsCorrect(null);
    setHintVisible(false);
    
    // Update schema preview
    if (!loading) {
      setSchema(getSchema(currentChallenge.tableSetup));
    }
  }, [currentChallenge, loading, getSchema]);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sql-master-progress');
    if (saved) {
      setCompletedIds(JSON.parse(saved));
    }
  }, []);

  const saveProgress = (id: string) => {
    if (!completedIds.includes(id)) {
      const newIds = [...completedIds, id];
      setCompletedIds(newIds);
      localStorage.setItem('sql-master-progress', JSON.stringify(newIds));
    }
  };

  const handleRun = () => {
    setError(undefined);
    setIsCorrect(null);
    
    const res = runQuery(currentChallenge.tableSetup, query);
    
    if (res.success && res.data) {
      setResults(res.data);
      if (res.data.length > 0) {
        validateResult(res.data[0]);
      } else {
        setIsCorrect(false);
      }
    } else {
      setError(res.error);
    }
  };

  const validateResult = (result: SqlResult) => {
    // Convert SQL result to array of objects
    const userOutput = result.values.map(row => {
      const obj: any = {};
      result.columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });

    const expectedProcessed = currentChallenge.expectedOutput.map(item => {
      const ordered: any = {};
      Object.keys(item).sort().forEach(key => ordered[key] = item[key]);
      return ordered;
    });

    const userProcessed = userOutput.map(item => {
      const ordered: any = {};
      Object.keys(item).sort().forEach(key => ordered[key] = item[key]);
      return ordered;
    });

    if (!currentChallenge.orderSensitive) {
      expectedProcessed.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
      userProcessed.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    }

    const expectedStr = JSON.stringify(expectedProcessed);
    const userStr = JSON.stringify(userProcessed);

    if (expectedStr === userStr) {
      setIsCorrect(true);
      saveProgress(currentChallenge.id);
    } else {
      setIsCorrect(false);
    }
  };

  const nextChallenge = () => {
    if (currentChallengeIndex < filteredChallenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
    }
  };

  const prevChallenge = () => {
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(currentChallengeIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-sky-400">
        <div className="flex flex-col items-center gap-4">
          <DatabaseZap className="w-12 h-12 animate-bounce" />
          <h1 className="text-xl font-mono terminal-anim">Inicializando Kernel SQL...</h1>
        </div>
      </div>
    );
  }

  // Landing View (Track Selection)
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col justify-center items-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-sky-500/10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Rocket className="w-10 h-10 text-sky-400" />
            <h1 className="text-5xl font-black tracking-tighter text-white">
              DATA <span className="text-sky-400">LAB</span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">Sua jornada para o domínio de dados começa aqui. Escolha uma trilha e torne-se um especialista.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {[
            { id: 'sql', title: 'SQL Master', icon: Database, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', desc: 'Aprenda a consultar e manipular bancos de dados relacionais.' },
            { id: 'excel', title: 'Excel Avançado', icon: FileSpreadsheet, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', desc: 'Domine fórmulas, lógica e estruturação de planilhas.' },
            { id: 'python', title: 'Python Data', icon: Code2, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', desc: 'Introdução à programação para análise de dados.' }
          ].map(track => (
            <motion.button
              key={track.id}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedTrack(track.id as Track);
                setView('dashboard');
                setCurrentChallengeIndex(0);
              }}
              className={`p-8 rounded-3xl border ${track.border} bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900 transition-all text-left flex flex-col h-full group`}
            >
              <div className={`p-4 rounded-2xl ${track.bg} w-fit mb-6 group-hover:scale-110 transition-transform`}>
                <track.icon className={`w-8 h-8 ${track.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{track.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{track.desc}</p>
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                Acessar Trilha <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-20 flex items-center gap-8 opacity-40">
           <BrainCircuit className="w-6 h-6" />
           <span className="h-px w-20 bg-slate-700" />
           <p className="text-xs font-mono uppercase tracking-[0.2em]">Data Engineering Training System v2.0</p>
           <span className="h-px w-20 bg-slate-700" />
        </div>
      </div>
    );
  }

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200">
        <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
          <button 
            onClick={() => setView('landing')}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="flex items-center gap-2 leading-none">
              <Database className="w-6 h-6 text-sky-400" />
              <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
                SQL <span className="text-sky-400">Master Lab</span>
              </h1>
            </div>
          </button>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold text-slate-300">
                {completedIds.filter(id => challenges.find(c => c.id === id)?.track === selectedTrack).length} / {filteredChallenges.length} Concluídos
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
              <span className="text-xs font-bold text-sky-400">WM</span>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6 md:p-10">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider mb-4">
              Trilha: {selectedTrack?.toUpperCase()}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo, Comandante {selectedTrack === 'sql' ? 'SQL' : selectedTrack === 'excel' ? 'Excel' : 'Python'}</h2>
            <p className="text-slate-400 max-w-2xl">Escolha um módulo para começar seu treinamento. Do básico ao avançado, domine a arte de consultar dados.</p>
          </header>

          <div className="space-y-12">
            {['Básico', 'Intermediário', 'Avançado'].map(difficulty => {
              const diffChallenges = filteredChallenges.filter(c => c.difficulty === difficulty);
              if (diffChallenges.length === 0) return null;

              const completedCount = diffChallenges.filter(c => completedIds.includes(c.id)).length;
              const progressPct = (completedCount / diffChallenges.length) * 100;

              return (
                <section key={difficulty} className="space-y-6">
                  <div className="flex items-end justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{difficulty}</h3>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Módulo {difficulty === 'Básico' ? '01' : difficulty === 'Intermediário' ? '02' : '03'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400">{completedCount}/{diffChallenges.length}</span>
                      <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          className={`h-full ${
                            difficulty === 'Básico' ? 'bg-green-500' :
                            difficulty === 'Intermediário' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {diffChallenges.map((c, idx) => {
                      const isCompleted = completedIds.includes(c.id);
                      return (
                        <motion.button
                          key={c.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            const actualIdx = filteredChallenges.findIndex(ch => ch.id === c.id);
                            setCurrentChallengeIndex(actualIdx);
                            setView('exercise');
                          }}
                          className={`
                            relative p-5 rounded-xl border text-left transition-all group overflow-hidden
                            ${isCompleted 
                              ? 'bg-slate-900 border-green-500/30' 
                              : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}
                          `}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{selectedTrack}-{idx + 1}</span>
                            {isCompleted && (
                              <div className="bg-green-500/20 p-1 rounded">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                              </div>
                            )}
                          </div>
                          <h4 className={`font-bold mb-2 group-hover:text-sky-400 transition-colors ${isCompleted ? 'text-slate-300' : 'text-white'}`}>
                            {c.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {c.description}
                          </p>
                          <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Iniciar Desafio</span>
                            <Play className="w-3 h-3 text-sky-400" />
                          </div>
                          
                          {/* Card background glow */}
                          <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-[40px] opacity-20 transition-colors ${
                            difficulty === 'Básico' ? 'bg-green-500' :
                            difficulty === 'Intermediário' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </motion.button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </main>
        
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 blur-[120px] rounded-full" />
        </div>
      </div>
    );
  }

  // Exercise View
  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      {/* Navbar for Exercise View */}
      <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 p-2 px-3 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Voltar</span>
          </button>
          <div className="w-px h-6 bg-slate-800 mx-2" />
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-400" />
            <h1 className="text-lg font-bold tracking-tight text-white hidden md:block">
              SQL Master
            </h1>
          </div>
        </div>

        <div className="flex-1 flex justify-center px-4">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50 max-w-xs md:max-w-md w-full">
             <LayoutGrid className="w-4 h-4 text-slate-500 flex-shrink-0" />
             <span className="text-xs font-bold text-slate-300 truncate">
               {currentChallenge.title}
             </span>
             <span className={`ml-auto px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
               currentChallenge.difficulty === 'Básico' ? 'bg-green-500/20 text-green-500' :
               currentChallenge.difficulty === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-500' :
               'bg-red-500/20 text-red-500'
             }`}>
               {currentChallenge.difficulty}
             </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-slate-300">
              {completedIds.filter(id => challenges.find(c => c.id === id)?.track === selectedTrack).length} / {filteredChallenges.length}
            </span>
          </div>
          <button 
             onClick={() => setSidebarOpen(true)}
             className="p-2 hover:bg-slate-800 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col h-[calc(100vh-68px)] relative overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4 md:p-8 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
            
            {/* Left: Challenge info & Results */}
            <div className="space-y-8 min-w-0">
              <ChallengeDetails 
                challenge={currentChallenge}
                isCorrect={isCorrect}
                error={error}
                hintVisible={hintVisible}
                setHintVisible={setHintVisible}
              />

              {isCorrect && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-6 bg-slate-900 border border-slate-700 rounded-xl space-y-4 shadow-xl shadow-black/20"
                >
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-sky-400" />
                    O que vem a seguir?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredChallenges
                      .filter(c => c.id !== currentChallenge.id && !completedIds.includes(c.id))
                      .slice(0, 2)
                      .map(nextC => (
                        <button
                          key={nextC.id}
                          onClick={() => {
                            const idx = filteredChallenges.findIndex(ch => ch.id === nextC.id);
                            setCurrentChallengeIndex(idx);
                          }}
                          className="flex items-center justify-between p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors border border-slate-700/50 group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{nextC.title}</p>
                            <p className="text-[10px] text-slate-500">{nextC.difficulty}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                        </button>
                      ))}
                    {/* Fallback if all are completed or no more are found */}
                    {filteredChallenges.filter(c => !completedIds.includes(c.id)).length <= 1 && (
                       <button
                        onClick={() => setView('dashboard')}
                        className="col-span-2 flex items-center justify-center gap-2 p-3 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20 hover:bg-sky-500/20 transition-colors font-bold text-xs"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar para o Painel Geral
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <DatabaseZap className="w-4 h-4" />
                    Tabelas Disponíveis
                  </h3>
                </div>
                <div className="space-y-6">
                  {schema.map((table) => (
                    <div key={table.name} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 text-[11px] font-mono font-bold rounded border border-sky-500/20">
                          {table.name}
                        </span>
                      </div>
                      <DataTable result={table.data} />
                    </div>
                  ))}
                  {schema.length === 0 && (
                    <div className="p-4 border border-dashed border-slate-700 rounded-lg text-center text-slate-500 text-sm">
                      Nenhuma tabela definida para este exercício.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    Resultado da sua Query
                  </h3>
                </div>
                <div className="min-h-[200px]">
                  {results.length > 0 ? (
                    <DataTable result={results[0]} />
                  ) : (
                    <div className="h-48 border border-dashed border-slate-700 rounded-lg flex items-center justify-center bg-slate-900/10">
                      <p className="text-slate-500 text-sm italic">Execute sua query para ver os resultados.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Editor */}
            <div className="flex flex-col min-h-[400px]">
              <div className="flex-1">
                <SqlEditor 
                  query={query}
                  setQuery={setQuery}
                  onRun={handleRun}
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <footer className="p-4 md:px-8 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between mt-auto">
            <button
              onClick={prevChallenge}
              disabled={currentChallengeIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="hidden sm:inline">Desafio</span> {currentChallengeIndex + 1} de {challenges.length}
            </div>

            <button
              onClick={nextChallenge}
              disabled={currentChallengeIndex === challenges.length - 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              Próximo
              <ChevronRight className="w-5 h-5" />
            </button>
          </footer>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
