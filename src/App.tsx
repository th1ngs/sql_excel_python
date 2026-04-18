import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Database, Terminal, DatabaseZap, Award, ChevronLeft, ChevronRight, Menu, X, ShieldCheck, ArrowLeft, Play, LayoutGrid, FileSpreadsheet, Code2, Rocket, BrainCircuit, Star, Download, Printer, Share2, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { challenges } from './data/challenges';
import { useSqlEngine } from './hooks/useSqlEngine';
import { Challenge, SqlResult, Track, UserCertificate, Rank } from './types';
import { SqlEditor } from './components/SqlEditor';
import { DataTable } from './components/DataTable';
import { ChallengeDetails } from './components/ChallengeDetails';
import { AuthUI } from './components/Auth.tsx';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, serverTimestamp, query as fsQuery, where } from 'firebase/firestore';

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
  const [certificates, setCertificates] = useState<UserCertificate[]>([]);
  const [userName, setUserName] = useState('Recruta');
  const [showCert, setShowCert] = useState<UserCertificate | null>(null);
  const [schema, setSchema] = useState<{name: string, data: SqlResult}[]>([]);
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

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

  // Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      
      if (u) {
        setUserName(u.displayName || 'Recruta');
        // Fetch data from Firestore
        try {
          const challengesSnap = await getDocs(collection(db, 'users', u.uid, 'challenges'));
          setCompletedIds(challengesSnap.docs.map(doc => doc.id));
          
          const certsSnap = await getDocs(collection(db, 'users', u.uid, 'certificates'));
          setCertificates(certsSnap.docs.map(doc => doc.data() as UserCertificate));
        } catch (e) {
          console.error("Error fetching user data:", e);
        }
      } else {
        setCompletedIds([]);
        setCertificates([]);
      }
    });
    return unsubscribe;
  }, []);

  const saveProgress = async (id: string) => {
    if (!user) return;

    let newIds = completedIds;
    if (!completedIds.includes(id)) {
      newIds = [...completedIds, id];
      setCompletedIds(newIds);
      
      const challenge = challenges.find(c => c.id === id);
      if (challenge) {
        // Persist to Firestore
        await setDoc(doc(db, 'users', user.uid, 'challenges', id), {
          challengeId: id,
          track: challenge.track,
          completedAt: serverTimestamp()
        });
      }
    }

    // Check for certificate
    const challenge = challenges.find(c => c.id === id);
    if (challenge?.isFinalTest && selectedTrack) {
      const existing = certificates.find(cert => cert.rank === challenge.rank && cert.track === selectedTrack);
      if (!existing) {
        const newCert: UserCertificate = {
          rank: challenge.rank,
          track: selectedTrack,
          issuedAt: new Date().toLocaleDateString('pt-BR'),
          userName: userName
        };
        const newCerts = [...certificates, newCert];
        setCertificates(newCerts);
        
        // Persist to Firestore
        await setDoc(doc(db, 'users', user.uid, 'certificates', `${selectedTrack}-${challenge.rank}`), {
          ...newCert,
          issuedAtServer: serverTimestamp() // Better for rules, but issuedAt is for UI
        });
        
        setShowCert(newCert);
      }
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
      } else if (currentChallenge.expectedOutput.length === 0) {
        setIsCorrect(true);
        saveProgress(currentChallenge.id);
      } else {
        setIsCorrect(false);
      }
    } else {
      setError(res.error);
    }
  };

  const validateResult = (result: SqlResult) => {
    // Normalize numeric values for comparison
    const normalize = (val: any) => {
      if (typeof val === 'number') return Number(val.toFixed(4));
      if (typeof val === 'string') return val.trim();
      return val;
    };

    // User values without column names (just the data)
    const userValues = result.values.map(row => row.map(normalize));
    
    // Expected values without column names
    const expectedValues = currentChallenge.expectedOutput.map(obj => {
      // Sort keys to ensure consistent order if we extract values
      return Object.keys(obj).sort().map(key => normalize(obj[key]));
    });

    // Check dimensionality first
    if (userValues.length !== expectedValues.length) {
      setIsCorrect(false);
      return;
    }

    if (userValues.length > 0 && userValues[0].length !== expectedValues[0].length) {
      setIsCorrect(false);
      return;
    }

    // Sort both if order doesn't matter
    let userToCompare = [...userValues];
    let expectedToCompare = [...expectedValues];

    if (!currentChallenge.orderSensitive) {
      const sortFn = (a: any[], b: any[]) => JSON.stringify(a).localeCompare(JSON.stringify(b));
      userToCompare.sort(sortFn);
      expectedToCompare.sort(sortFn);
    }

    const valuesMatch = JSON.stringify(userToCompare) === JSON.stringify(expectedToCompare);

    if (valuesMatch) {
      // Check if column names also match (strict check for aliases)
      const userOutput = result.values.map(row => {
        const obj: any = {};
        result.columns.forEach((col, i) => { obj[col] = normalize(row[i]); });
        return obj;
      });

      const expectedProcessed = currentChallenge.expectedOutput.map(item => {
        const ordered: any = {};
        Object.keys(item).sort().forEach(key => ordered[key] = normalize(item[key]));
        return ordered;
      });

      const userProcessed = userOutput.map(item => {
        const ordered: any = {};
        Object.keys(item).sort().forEach(key => ordered[key] = normalize(item[key]));
        return ordered;
      });

      if (!currentChallenge.orderSensitive) {
        const sortFn = (a: any, b: any) => JSON.stringify(a).localeCompare(JSON.stringify(b));
        expectedProcessed.sort(sortFn);
        userProcessed.sort(sortFn);
      }

      const keysMatch = JSON.stringify(expectedProcessed) === JSON.stringify(userProcessed);

      if (keysMatch) {
        setIsCorrect(true);
        saveProgress(currentChallenge.id);
      } else {
        // Values are correct, but column names are wrong
        setIsCorrect(true); // Still consider correct for UX
        saveProgress(currentChallenge.id);
        setError("Dica: Os valores estão perfeitos! No exercício real, tente usar o nome da coluna exato (ex: 'AS total') para ser mais preciso.");
      }
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

  // Certificate Component
  const CertificateModal = ({ cert, onClose }: { cert: UserCertificate, onClose: () => void }) => {
    const isMaster = cert.userName.includes('(MASTER GRADUATE)');
    
    const rankColors = {
      'Junior': {
        gradient: 'from-slate-400 to-slate-600',
        text: 'text-slate-600',
        bg: 'bg-slate-50',
        glow: 'bg-slate-200'
      },
      'Analyst': {
        gradient: 'from-sky-500 to-sky-700',
        text: 'text-sky-600',
        bg: 'bg-sky-50',
        glow: 'bg-sky-100'
      },
      'Expert': {
        gradient: 'from-amber-400 to-amber-600',
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        glow: 'bg-amber-100'
      }
    };

    const currentTheme = isMaster 
      ? { gradient: 'from-purple-500 via-pink-500 to-orange-500', text: 'text-purple-600', bg: 'bg-indigo-50', glow: 'bg-purple-100' }
      : rankColors[cert.rank as keyof typeof rankColors] || rankColors['Junior'];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-4xl w-full bg-white text-slate-900 rounded-[2rem] overflow-hidden shadow-2xl relative border-8 border-slate-50"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-20"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>

          <div className="p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className={`absolute top-0 left-0 w-full h-4 bg-gradient-to-r ${currentTheme.gradient}`} />
            <div className={`absolute -top-24 -left-24 w-64 h-64 ${currentTheme.glow} rounded-full blur-3xl opacity-50`} />
            <div className={`absolute -bottom-24 -right-24 w-64 h-64 ${currentTheme.glow} rounded-full blur-3xl opacity-50`} />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-20 h-20 ${currentTheme.bg} rounded-full flex items-center justify-center mb-8 shadow-inner`}>
                <Award className={`w-10 h-10 ${currentTheme.text}`} />
              </div>
              
              <h4 className={`text-xs font-black uppercase tracking-[0.4em] ${currentTheme.text} mb-2`}>
                {isMaster ? 'Certificado de Graduação Master' : `Certificado de Mestria ${cert.rank}`}
              </h4>
              <h2 className="text-4xl font-serif text-slate-900 mb-8 italic tracking-tight">Analyst Master Academy</h2>
              
              <div className="mb-8">
                <p className="text-slate-500 uppercase tracking-widest text-[10px] mb-2 font-bold">Certificamos que</p>
                <h3 className="text-4xl font-black border-b-2 border-slate-100 pb-2 px-12 inline-block tracking-tighter capitalize">{cert.userName.toLowerCase()}</h3>
              </div>
              
              <p className="text-slate-600 max-w-lg mx-auto leading-relaxed mb-8 text-lg">
                Concluiu com êxito {isMaster ? 'a Trilha Completa' : `o módulo ${cert.rank}`} em <span className="font-black text-slate-900 uppercase">{cert.track}</span>, demonstrando domínio nas competências avançadas de coleta, tratamento e análise de dados.
              </p>
              
              <div className="grid grid-cols-3 gap-12 w-full max-w-2xl border-t border-slate-100 pt-8 mt-4">
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Data de Emissão</p>
                  <p className="font-mono text-sm font-bold">{cert.issuedAt}</p>
                </div>
                <div className="flex justify-center flex-col items-center border-x border-slate-50 px-8">
                  <div className={`w-16 h-16 border-2 ${currentTheme.text} border-dashed opacity-20 rounded-lg flex items-center justify-center transform rotate-12 mb-2`}>
                     <ShieldCheck className="w-8 h-8" />
                  </div>
                  <p className="text-[8px] uppercase font-black text-slate-400 tracking-tighter">ID: AM-{cert.track.toUpperCase()}-{cert.rank.toUpperCase()}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-12 border-b border-slate-900 mb-2 opacity-10" />
                  <p className="text-[10px] uppercase font-black text-slate-900">Coordenação Geral</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Analyst Master</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-6 flex items-center justify-center gap-4 border-t border-slate-100">
            <button className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-sky-600 transition-all shadow-lg hover:shadow-sky-500/20">
               <Download className="w-4 h-4" /> Exportar Diploma
            </button>
            <button className="flex items-center gap-3 px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
               <Share2 className="w-4 h-4" /> Compartilhar Performance
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-sky-400">
        <div className="flex flex-col items-center gap-4">
          <DatabaseZap className="w-12 h-12 animate-bounce" />
          <h1 className="text-xl font-mono terminal-anim">Conectando ao Analyst Master...</h1>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-sky-500/10">
        <AuthUI onAuthSuccess={() => {}} />
      </div>
    );
  }

  // Landing View (Track Selection)
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col justify-center items-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-sky-500/10">
        {/* Certificate Modal */}
        <AnimatePresence>
          {showCert && (
            <CertificateModal cert={showCert} onClose={() => setShowCert(null)} />
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Rocket className="w-10 h-10 text-sky-400" />
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase">
              Analyst <span className="text-sky-400">Master</span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">Sua jornada para o domínio analítico começa aqui. Escolha uma trilha e torne-se um especialista.</p>
          
          <div className="mt-8 flex flex-col items-center gap-1">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Seja bem-vindo,</p>
             <h4 className="text-xl font-bold text-white tracking-tight">{user?.displayName}</h4>
          </div>
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
             <button 
               onClick={() => signOut(auth)}
               className="flex items-center gap-2 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-full border border-red-500/30 text-red-500 transition-colors mr-2"
               title="Sair"
             >
               <LogOut className="w-4 h-4" />
               <span className="text-[10px] font-bold uppercase hidden sm:inline">Sair</span>
             </button>
             {certificates.length > 0 && (
               <button 
                 onClick={() => setShowCert(certificates[certificates.length - 1])}
                 className="flex items-center gap-2 px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 rounded-full border border-sky-500/30 text-sky-400 transition-colors"
                >
                 <Award className="w-4 h-4" />
                 <span className="text-[10px] font-bold uppercase">Meus Certificados</span>
               </button>
             )}
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold text-slate-300">
                {completedIds.filter(id => challenges.find(c => c.id === id)?.track === selectedTrack).length} / {filteredChallenges.length} Concluídos
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
              <span className="text-xs font-bold text-sky-400">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6 md:p-10">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider mb-4">
              Trilha: {selectedTrack?.toUpperCase()}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo, Comandante {selectedTrack === 'sql' ? 'SQL' : selectedTrack === 'excel' ? 'Excel' : 'Python'}</h2>
            <p className="text-slate-400 max-w-2xl mb-8">Sua jornada do Junior ao Expert começa aqui. Complete os módulos para subir de nível.</p>
            
            {/* Career Path Visualization */}
            <div className="grid grid-cols-3 gap-4 mb-12 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
              {[
                { rank: 'Junior', label: 'Iniciante', color: 'bg-green-500' },
                { rank: 'Analyst', label: 'Especialista', color: 'bg-yellow-500' },
                { rank: 'Expert', label: 'Mestre', color: 'bg-red-500' }
              ].map((step, i) => {
                const isReached = filteredChallenges.some(c => c.rank === step.rank && completedIds.includes(c.id));
                const allDone = filteredChallenges.filter(c => c.rank === step.rank).every(c => completedIds.includes(c.id));
                
                return (
                  <div key={step.rank} className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0f172a] transition-all duration-500 ${
                      allDone ? step.color : isReached ? 'bg-slate-700' : 'bg-slate-900 border-slate-800'
                    }`}>
                      <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-tighter mt-2 ${allDone ? 'text-white' : 'text-slate-500'}`}>
                      {step.rank}
                    </span>
                    <span className="text-[8px] text-slate-600 uppercase tracking-[0.2em]">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </header>

          <div className="space-y-16">
            {/* Master Graduation Banner */}
            {certificates.filter(c => c.track === selectedTrack).length === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden p-12 rounded-[3rem] bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 text-center shadow-2xl shadow-yellow-500/20 mb-16"
              >
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                   <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
                   <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <Star className="w-12 h-12 text-white fill-white animate-pulse" />
                   </div>
                   <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Graduação Master Completa!</h2>
                   <p className="text-white/80 max-w-lg mx-auto text-lg font-medium mb-8">
                      Parabéns, {userName}! Você dominou todas as etapas da trilha {selectedTrack?.toUpperCase()} e agora é oficialmente um Especialista Master.
                   </p>
                   <button 
                    onClick={() => {
                      const masterCert: UserCertificate = {
                        rank: 'Expert',
                        track: selectedTrack!,
                        issuedAt: new Date().toLocaleDateString('pt-BR'),
                        userName: `${userName} (MASTER GRADUATE)`
                      };
                      setShowCert(masterCert);
                    }}
                    className="px-10 py-4 bg-slate-900 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all flex items-center gap-3"
                   >
                     Solicitar Diploma Master <Award className="w-5 h-5" />
                   </button>
                </div>
              </motion.div>
            )}

            {/* Certificated Awards if any */}
            {certificates.filter(c => c.track === selectedTrack).length > 0 && (
              <div className="bg-sky-500/5 border border-sky-500/10 rounded-3xl p-6 flex flex-wrap items-center gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-sky-400" />
                 </div>
                 <div>
                    <h4 className="font-bold text-white">Certificados Conquistados</h4>
                    <p className="text-xs text-slate-500 tracking-tight">Você já provou seu valor nestes níveis da trilha.</p>
                 </div>
                 <div className="flex gap-2">
                    {certificates.filter(c => c.track === selectedTrack).map(cert => (
                      <button 
                        key={cert.rank}
                        onClick={() => setShowCert(cert)}
                        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-sky-400 hover:border-sky-500/50 transition-all flex items-center gap-2"
                      >
                         {cert.rank} <Star className="w-3 h-3 fill-sky-400" />
                      </button>
                    ))}
                 </div>
              </div>
            )}

            {['Básico', 'Intermediário', 'Avançado'].map(difficulty => {
              const diffChallenges = filteredChallenges.filter(c => c.difficulty === difficulty);
              if (diffChallenges.length === 0) return null;

              const completedCount = diffChallenges.filter(c => completedIds.includes(c.id)).length;
              const progressPct = (completedCount / diffChallenges.length) * 100;
              
              // Group by category
              const categories = Array.from(new Set(diffChallenges.map(c => c.category)));

              return (
                <section key={difficulty} className="space-y-8">
                  <div className="flex items-end justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-8 rounded-full ${
                         difficulty === 'Básico' ? 'bg-green-500' :
                         difficulty === 'Intermediário' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <h3 className="text-xl font-bold text-white">{difficulty}</h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">
                          Módulo {difficulty === 'Básico' ? '01 · Junior' : difficulty === 'Intermediário' ? '02 · Analyst' : '03 · Expert'}
                        </p>
                      </div>
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

                  <div className="space-y-12">
                    {Array.from(new Set(diffChallenges.filter(c => !c.isFinalTest).map(c => c.category))).map(category => {
                      const catChallenges = diffChallenges.filter(c => c.category === category && !c.isFinalTest);
                      return (
                        <div key={category} className="space-y-4 p-6 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-sky-400 uppercase tracking-[0.2em] flex items-center gap-2">
                              {selectedTrack === 'sql' ? <Database className="w-4 h-4" /> : selectedTrack === 'excel' ? <FileSpreadsheet className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                              {category}
                            </h4>
                            <span className="text-[10px] text-slate-600 font-mono">{catChallenges.length} Desafios</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {catChallenges.map((c) => {
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
                                    relative p-5 rounded-xl border text-left transition-all group overflow-hidden h-full flex flex-col
                                    ${isCompleted 
                                      ? 'bg-slate-900 border-green-500/30 shadow-lg shadow-green-500/5' 
                                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}
                                  `}
                                >
                                  <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest leading-none pt-1">#{c.id.split('-').pop()}</span>
                                    {isCompleted && (
                                      <div className="bg-green-500/20 p-1 rounded">
                                        <ShieldCheck className="w-3 h-3 text-green-500" />
                                      </div>
                                    )}
                                  </div>
                                  <h4 className={`font-bold mb-2 group-hover:text-sky-400 transition-colors text-sm leading-tight ${isCompleted ? 'text-slate-300' : 'text-white'}`}>
                                    {c.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed flex-1">
                                    {c.description}
                                  </p>
                                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Iniciar</span>
                                    <Play className="w-2 h-2 text-sky-400" />
                                  </div>
                                  
                                  <div className={`absolute -right-4 -bottom-4 w-12 h-12 rounded-full blur-[30px] opacity-10 transition-colors ${
                                    difficulty === 'Básico' ? 'bg-green-500' :
                                    difficulty === 'Intermediário' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`} />
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Final Test for this difficulty */}
                    {diffChallenges.some(c => c.isFinalTest) && (
                      <div className="p-1 px-1 bg-gradient-to-r from-sky-500 via-purple-500 to-sky-500 rounded-[2rem]">
                        <div className="w-full bg-[#0f172a] rounded-[1.9rem] p-8 md:p-12 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full" />
                          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
                               <Award className="w-12 h-12 text-yellow-500" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <h4 className="text-xs font-black text-sky-400 uppercase tracking-[0.4em] mb-2">Exame de Qualificação Final</h4>
                              <h3 className="text-3xl font-black text-white mb-4">Teste de Mestria {difficulty}</h3>
                              <p className="text-slate-400 text-sm max-w-xl">Este teste final integra todos os conceitos aprendidos no módulo. Ao completar este desafio com sucesso, você receberá seu Certificado de Especialização.</p>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                              <div className="text-center">
                                 <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Status do Exame</p>
                                 <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                                   diffChallenges.filter(c => c.isFinalTest).every(c => completedIds.includes(c.id)) 
                                    ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                                 }`}>
                                    {diffChallenges.filter(c => c.isFinalTest).every(c => completedIds.includes(c.id)) ? 'Concluído' : 'Disponível'}
                                 </div>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  const finalC = diffChallenges.find(c => c.isFinalTest);
                                  if (finalC) {
                                    const actualIdx = filteredChallenges.findIndex(ch => ch.id === finalC.id);
                                    setCurrentChallengeIndex(actualIdx);
                                    setView('exercise');
                                  }
                                }}
                                className="px-8 py-3 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:bg-sky-400 transition-colors shadow-xl shadow-white/5"
                              >
                                {diffChallenges.filter(c => c.isFinalTest).every(c => completedIds.includes(c.id)) ? 'Refazer Teste' : 'Iniciar Prova Final'}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
