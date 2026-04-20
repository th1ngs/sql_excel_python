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
import { translateToSql } from './lib/polyglot';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, serverTimestamp, query as fsQuery, where } from 'firebase/firestore';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'exercise'>('landing');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [query, setQuery] = useState('');
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
  const [landingTab, setLandingTab] = useState<'explore' | 'me'>('explore');
  
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { loading, runQuery, getSchema } = useSqlEngine();

  const filteredChallenges = useMemo(() => {
    return challenges.filter(c => c.track === selectedTrack);
  }, [selectedTrack]);

  const currentChallenge = filteredChallenges[currentChallengeIndex] || filteredChallenges[0];

  useEffect(() => {
    if (!currentChallenge) return;
    setQuery('');
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
      const existing = certificates.find(cert => cert.rank === challenge.rank && cert.track === selectedTrack && !cert.userName.includes('(MASTER GRADUATE)'));
      
      let finalNewCerts = [...certificates];
      let triggeredCert: UserCertificate | null = null;

      if (!existing) {
        const levelCert: UserCertificate = {
          rank: challenge.rank,
          track: selectedTrack,
          issuedAt: new Date().toLocaleDateString('pt-BR'),
          userName: userName
        };
        triggeredCert = levelCert;
        finalNewCerts = [...finalNewCerts, levelCert];
        
        // Persist level certificate to Firestore
        await setDoc(doc(db, 'users', user.uid, 'certificates', `${selectedTrack}-${challenge.rank}`), {
          ...levelCert,
          issuedAtServer: serverTimestamp()
        });
      }

      // Check for Master Graduate status (All 3 levels completed)
      // Level certificates are: Junior, Analyst, Expert
      const hasJunior = finalNewCerts.some(c => c.track === selectedTrack && c.rank === 'Junior' && !c.userName.includes('(MASTER GRADUATE)'));
      const hasAnalyst = finalNewCerts.some(c => c.track === selectedTrack && c.rank === 'Analyst' && !c.userName.includes('(MASTER GRADUATE)'));
      const hasExpert = finalNewCerts.some(c => c.track === selectedTrack && c.rank === 'Expert' && !c.userName.includes('(MASTER GRADUATE)'));
      const hasMaster = finalNewCerts.some(c => c.track === selectedTrack && c.userName.includes('(MASTER GRADUATE)'));

      if (hasJunior && hasAnalyst && hasExpert && !hasMaster) {
        const masterCert: UserCertificate = {
          rank: 'Expert', // Master UI uses this as base
          track: selectedTrack,
          issuedAt: new Date().toLocaleDateString('pt-BR'),
          userName: `${userName} (MASTER GRADUATE)`
        };
        finalNewCerts = [...finalNewCerts, masterCert];
        triggeredCert = masterCert; // Prioritize showing the Master one if both triggered

        // Persist Master certificate to Firestore
        await setDoc(doc(db, 'users', user.uid, 'certificates', `${selectedTrack}-MASTER`), {
          ...masterCert,
          issuedAtServer: serverTimestamp()
        });
      }

      if (triggeredCert) {
        setCertificates(finalNewCerts);
        setShowCert(triggeredCert);
      }
    }
  };

  const handleRun = () => {
    setError(undefined);
    setIsCorrect(null);
    
    // Polyglot transformation
    let effectiveQuery = query;
    if (selectedTrack && currentChallenge) {
      // Get primary table name from setup (crudely for simple exercises)
      const tableNameMatch = currentChallenge.tableSetup[0].match(/CREATE TABLE (\w+)/);
      const tableName = tableNameMatch ? tableNameMatch[1] : 'tabela';
      
      // Get column names for this specific table from schema
      const currentTableSchema = schema.find(s => s.name === tableName);
      const columnNames = currentTableSchema ? currentTableSchema.data.columns : [];

      effectiveQuery = translateToSql(query, selectedTrack, tableName, columnNames);
    }

    const res = runQuery(currentChallenge.tableSetup, effectiveQuery);
    
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
    const normalize = (val: any) => {
      if (val === null || val === undefined) return null;
      if (typeof val === 'number') return Number(val.toFixed(4));
      if (typeof val === 'string') return val.trim();
      return val;
    };

    const userValues = result.values.map(row => row.map(normalize));
    const expectedOutput = currentChallenge.expectedOutput;

    if (userValues.length !== expectedOutput.length) {
      setIsCorrect(false);
      return;
    }

    if (expectedOutput.length === 0) {
      setIsCorrect(true);
      saveProgress(currentChallenge.id);
      return;
    }

    const expectedKeys = Object.keys(expectedOutput[0]);
    if (userValues[0].length !== expectedKeys.length) {
      setIsCorrect(false);
      return;
    }

    // Convert expected objects to rows using a consistent key order
    const expectedRows = expectedOutput.map(obj => expectedKeys.map(k => normalize(obj[k])));

    // Helper to check if two sets of rows match under a specific column mapping
    const checkMatch = (userRows: any[][], expRows: any[][]) => {
      const sortFn = (a: any[], b: any[]) => JSON.stringify(a).localeCompare(JSON.stringify(b));
      
      const uToCompare = currentChallenge.orderSensitive ? userRows : [...userRows].sort(sortFn);
      const eToCompare = currentChallenge.orderSensitive ? expRows : [...expRows].sort(sortFn);

      return JSON.stringify(uToCompare) === JSON.stringify(eToCompare);
    };

    // Try all column permutations to find a match
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
    
    // Only generate permutations if column count is reasonable (e.g., <= 6)
    if (numCols <= 6) {
      generate(colIndices);
    } else {
      // Fallback for huge tables: direct column match (strict order)
      permutations.push(colIndices);
    }

    let bestMatch = false;
    for (const p of permutations) {
      const permutedUserRows = userValues.map(row => p.map(idx => row[idx]));
      if (checkMatch(permutedUserRows, expectedRows)) {
        bestMatch = true;
        break;
      }
    }

    if (bestMatch) {
      setIsCorrect(true);
      saveProgress(currentChallenge.id);
      
      // If the column names are exactly what we expected (ignoring order), don't show info
      const userColsSet = new Set(result.columns.map(c => c.toLowerCase()));
      const expectedColsSet = new Set(expectedKeys.map(k => k.toLowerCase()));
      const setsMatch = [...expectedColsSet].every(k => userColsSet.has(k));
      
      if (!setsMatch) {
        setError("Dica: Seus resultados estão corretos! Note que você usou nomes de colunas (aliases) diferentes dos sugeridos, mas o Analyst Master aceitou sua lógica.");
      }
    } else {
      setIsCorrect(false);
      setError(undefined);
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

  // Landing View (Track Selection & Member Area)
  if (view === 'landing') {
    const activeTrackIds = Array.from(new Set(challenges.filter(c => completedIds.includes(c.id)).map(c => c.track)));
    
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col p-6 overflow-x-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-sky-500/10 pointer-events-none" />

        {/* Certificate Modal */}
        <AnimatePresence>
          {showCert && (
            <CertificateModal cert={showCert} onClose={() => setShowCert(null)} />
          )}
        </AnimatePresence>

        <div className="max-w-7xl w-full mx-auto relative z-10 py-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                  Analyst <span className="text-sky-400">Master</span>
                </h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Sua jornada analítica profissional</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
              <button 
                onClick={() => setLandingTab('explore')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${landingTab === 'explore' ? 'bg-sky-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" /> Explorar Trilhas
              </button>
              <button 
                onClick={() => setLandingTab('me')}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${landingTab === 'me' ? 'bg-sky-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <User className="w-4 h-4" /> Minha Área
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {landingTab === 'explore' ? (
              <motion.div 
                key="explore"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-12"
              >
                <div className="max-w-2xl">
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Escolha sua <span className="text-sky-400 tracking-normal">Trilha de Sucesso</span></h2>
                  <p className="text-slate-400 text-lg">Domine as ferramentas mais requisitadas pelo mercado com nossa metodologia prática e baseada em desafios reais.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { id: 'sql', title: 'SQL Master', icon: Database, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20', desc: 'Aprenda a consultar e manipular bancos de dados relacionais com eficiência.' },
                    { id: 'excel', title: 'Excel Avançado', icon: FileSpreadsheet, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', desc: 'Domine fórmulas, lógica preditiva e estruturação de planilhas dinâmicas.' },
                    { id: 'python', title: 'Python Data', icon: Code2, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', desc: 'Introdução à programação para análise e automação de processamento de dados.' }
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
                      className={`p-8 rounded-[2.5rem] border ${track.border} bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900 transition-all text-left flex flex-col h-full group`}
                    >
                      <div className={`p-5 rounded-2xl ${track.bg} w-fit mb-8 group-hover:scale-110 transition-transform`}>
                        <track.icon className={`w-10 h-10 ${track.color}`} />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{track.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-10 flex-1">{track.desc}</p>
                      <div className="flex items-center gap-3 text-sky-400 font-black text-xs uppercase tracking-widest mt-auto">
                        Começar Agora <ChevronRight className="w-4 h-4" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="me"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-16"
              >
                {/* Profile Header Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                  <div className="w-32 h-32 bg-sky-500 p-1 rounded-full relative">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                       <User className="w-16 h-16 text-sky-400" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-900 shadow-lg" />
                  </div>
                  <div className="space-y-4 relative z-10 flex-1">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-sky-400 uppercase tracking-[0.4em]">Membro Verificado</p>
                      <h2 className="text-5xl font-black text-white tracking-tighter capitalize">{user?.displayName?.toLowerCase()}</h2>
                    </div>
                    <p className="text-slate-400 text-lg font-medium max-w-xl">
                      Progredindo na jornada Analyst Master com {completedIds.length} desafios completados e {certificates.length} certificados obtidos.
                    </p>
                    <div className="pt-4">
                      <button 
                        onClick={() => signOut(auth)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all mx-auto md:mx-0"
                      >
                         <LogOut className="w-4 h-4" /> Sair da Conta
                      </button>
                    </div>
                  </div>
                </div>

                {/* My Tracks Section */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-sky-400/10 rounded-xl border border-sky-400/20">
                      <DatabaseZap className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white tracking-tighter">Minhas Trilhas</h3>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Trilhas que você já iniciou</p>
                    </div>
                  </div>
                  
                  {activeTrackIds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {activeTrackIds.map(trackId => {
                         const trackMap: Record<string, any> = {
                           'sql': { title: 'SQL Master', icon: Database, color: 'text-sky-400', bg: 'bg-sky-400/5', border: 'border-sky-400/10' },
                           'excel': { title: 'Excel Avançado', icon: FileSpreadsheet, color: 'text-green-400', bg: 'bg-green-400/5', border: 'border-green-400/10' },
                           'python': { title: 'Python Data', icon: Code2, color: 'text-yellow-400', bg: 'bg-yellow-400/5', border: 'border-yellow-400/10' }
                         };
                         const track = trackMap[trackId];
                         if (!track) return null;
                         
                         const progress = Math.round((challenges.filter(c => c.track === trackId && completedIds.includes(c.id)).length / challenges.filter(c => c.track === trackId).length) * 100);

                         return (
                           <button
                             key={trackId}
                             onClick={() => {
                               setSelectedTrack(trackId as Track);
                               setView('dashboard');
                               setCurrentChallengeIndex(0);
                             }}
                             className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] hover:bg-slate-900/70 hover:border-slate-700 transition-all text-left flex flex-col group h-64"
                           >
                             <div className="flex justify-between items-start mb-6">
                               <div className={`p-4 rounded-xl ${track.bg} border ${track.border}`}>
                                 <track.icon className={`w-6 h-6 ${track.color}`} />
                               </div>
                               <div className="text-right">
                                  <span className={`text-2xl font-black ${track.color}`}>{progress}%</span>
                                  <p className="text-[10px] text-slate-500 uppercase font-bold">Concluído</p>
                               </div>
                             </div>
                             <h4 className="text-xl font-bold text-white mb-2">{track.title}</h4>
                             <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-6">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  className={`h-full bg-gradient-to-r ${trackId === 'sql' ? 'from-sky-500 to-blue-500' : trackId === 'excel' ? 'from-green-500 to-emerald-500' : 'from-yellow-500 to-orange-500'}`}
                                />
                             </div>
                             <p className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors flex items-center gap-2">
                                Continuar Aprendizado <ChevronRight className="w-4 h-4" />
                             </p>
                           </button>
                         );
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-[2rem] p-12 text-center">
                       <p className="text-slate-500 font-medium">Você ainda não iniciou nenhuma trilha.</p>
                       <button 
                         onClick={() => setLandingTab('explore')}
                         className="mt-4 text-sky-400 font-black text-sm uppercase tracking-widest hover:underline"
                       >
                         Explorar Catálogo
                       </button>
                    </div>
                  )}
                </section>

                {/* Certificates Section (Moved Here) */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-amber-400/10 rounded-xl border border-amber-400/20">
                      <Award className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white tracking-tighter">Meus Certificados</h3>
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Conquistas oficiais emitidas</p>
                    </div>
                  </div>

                  {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {certificates.map((cert, idx) => {
                        const isMaster = cert.userName.includes('(MASTER GRADUATE)');
                        return (
                          <motion.button
                            key={`${cert.track}-${cert.rank}-${idx}`}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCert(cert)}
                            className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] hover:bg-slate-900 transition-all text-left flex flex-col gap-6 relative overflow-hidden group h-full"
                          >
                             {/* Glossy overlay */}
                             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                             
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                               isMaster ? 'bg-purple-500/20' : 
                               cert.rank === 'Expert' ? 'bg-amber-500/20' : 
                               cert.rank === 'Analyst' ? 'bg-sky-500/20' : 'bg-slate-500/20'
                             }`}>
                               <Award className={`w-8 h-8 ${
                                 isMaster ? 'text-purple-400' : 
                                 cert.rank === 'Expert' ? 'text-amber-400' : 
                                 cert.rank === 'Analyst' ? 'text-sky-400' : 'text-slate-400'
                               }`} />
                             </div>
                             
                             <div className="flex-1">
                               <h4 className="text-white font-black text-lg tracking-tight mb-1">
                                 {isMaster ? 'Master Graduate' : `${cert.track.toUpperCase()}: ${cert.rank}`}
                               </h4>
                               <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Emissão: {cert.issuedAt}</p>
                             </div>
                             
                             <div className="flex items-center gap-2 text-xs font-black text-sky-400 uppercase tracking-widest group-hover:gap-3 transition-all pt-4 border-t border-white/5">
                               Ver Diploma <ChevronRight className="w-4 h-4" />
                             </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-[2rem] p-12 text-center">
                       <p className="text-slate-500 font-medium">Nenhum certificado obtido ainda.</p>
                       <p className="text-slate-700 text-xs mt-2 uppercase font-black tracking-widest">Conclua uma trilha final para se certificar</p>
                    </div>
                  )}
                </section>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Branding */}
          <footer className="mt-32 flex flex-col items-center gap-8 opacity-40">
             <div className="flex items-center gap-6">
                <BrainCircuit className="w-6 h-6" />
                <span className="h-px w-20 bg-slate-700" />
                <p className="text-xs font-mono uppercase tracking-[0.3em]">Analyst Master System v2.0</p>
                <span className="h-px w-20 bg-slate-700" />
             </div>
          </footer>
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
                Analyst <span className="text-sky-400">Master</span>
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
                    onClick={async () => {
                      const masterCert: UserCertificate = {
                        rank: 'Expert',
                        track: selectedTrack!,
                        issuedAt: new Date().toLocaleDateString('pt-BR'),
                        userName: `${userName} (MASTER GRADUATE)`
                      };
                      
                      const hasMaster = certificates.some(c => c.track === selectedTrack && c.userName.includes('(MASTER GRADUATE)'));
                      if (!hasMaster) {
                        setCertificates(prev => [...prev, masterCert]);
                        if (user) {
                          await setDoc(doc(db, 'users', user.uid, 'certificates', `${selectedTrack}-MASTER`), {
                            ...masterCert,
                            issuedAtServer: serverTimestamp()
                          });
                        }
                      }
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

              const nonFinalChallenges = diffChallenges.filter(c => !c.isFinalTest);
              const allNonFinalCompleted = nonFinalChallenges.every(c => completedIds.includes(c.id));
              
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
                              const actualIdx = filteredChallenges.findIndex(ch => ch.id === c.id);
                              // Challenges are no longer locked by sequence
                              const isLocked = false; 

                              return (
                                <motion.button
                                  key={c.id}
                                  whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
                                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                                  disabled={isLocked}
                                  onClick={() => {
                                    if (isLocked) return;
                                    setCurrentChallengeIndex(actualIdx);
                                    setView('exercise');
                                  }}
                                  className={`
                                    relative p-5 rounded-xl border text-left transition-all group overflow-hidden h-full flex flex-col
                                    ${isCompleted 
                                      ? 'bg-slate-900 border-green-500/30 shadow-lg shadow-green-500/5' 
                                      : isLocked 
                                        ? 'bg-slate-950/50 border-slate-900 opacity-50 cursor-not-allowed'
                                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}
                                  `}
                                >
                                  <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest leading-none pt-1">#{c.id.split('-').pop()}</span>
                                    {isCompleted ? (
                                      <div className="bg-green-500/20 p-1 rounded">
                                        <ShieldCheck className="w-3 h-3 text-green-500" />
                                      </div>
                                    ) : isLocked && (
                                      <div className="bg-slate-800 p-1 rounded">
                                        <X className="w-3 h-3 text-slate-600" />
                                      </div>
                                    )}
                                  </div>
                                  <h4 className={`font-bold mb-2 transition-colors text-sm leading-tight ${isCompleted ? 'text-slate-300' : isLocked ? 'text-slate-600' : 'text-white group-hover:text-sky-400'}`}>
                                    {c.title}
                                  </h4>
                                  <p className={`text-[11px] line-clamp-2 leading-relaxed flex-1 ${isLocked ? 'text-slate-700' : 'text-slate-500'}`}>
                                    {c.description}
                                  </p>
                                  
                                  <div className={`mt-4 flex items-center gap-2 transition-opacity ${isLocked ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Iniciar</span>
                                    <Play className="w-2 h-2 text-sky-400" />
                                  </div>
                                  
                                  {!isLocked && (
                                    <div className={`absolute -right-4 -bottom-4 w-12 h-12 rounded-full blur-[30px] opacity-10 transition-colors ${
                                      difficulty === 'Básico' ? 'bg-green-500' :
                                      difficulty === 'Intermediário' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {/* Final Test for this difficulty */}
                    {diffChallenges.some(c => c.isFinalTest) && (
                      <div className={`p-1 px-1 rounded-[2rem] transition-all ${allNonFinalCompleted ? 'bg-gradient-to-r from-sky-500 via-purple-500 to-sky-500 shadow-xl shadow-sky-500/20' : 'bg-slate-800'}`}>
                        <div className="w-full bg-[#0f172a] rounded-[1.9rem] p-8 md:p-12 relative overflow-hidden">
                          {!allNonFinalCompleted && (
                            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
                              <div className="flex flex-col items-center gap-4 text-center p-6">
                                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                                   <ShieldCheck className="w-10 h-10 text-slate-600" />
                                </div>
                                <h4 className="text-xl font-bold text-white">Exame de Mestria Bloqueado</h4>
                                <p className="text-slate-400 text-sm max-w-[280px]">Complete todos os {nonFinalChallenges.length} desafios acima para liberar sua prova de certificação.</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full" />
                          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
                               <Award className={`w-12 h-12 ${allNonFinalCompleted ? 'text-yellow-500' : 'text-slate-700'}`} />
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
                                    : allNonFinalCompleted ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-slate-800 border-slate-700 text-slate-500'
                                 }`}>
                                    {diffChallenges.filter(c => c.isFinalTest).every(c => completedIds.includes(c.id)) ? 'Concluído' : allNonFinalCompleted ? 'Disponível' : 'Bloqueado'}
                                 </div>
                              </div>
                              <motion.button
                                whileHover={allNonFinalCompleted ? { scale: 1.05 } : {}}
                                whileTap={allNonFinalCompleted ? { scale: 0.95 } : {}}
                                disabled={!allNonFinalCompleted}
                                onClick={() => {
                                  if (!allNonFinalCompleted) return;
                                  const finalC = diffChallenges.find(c => c.isFinalTest);
                                  if (finalC) {
                                    const actualIdx = filteredChallenges.findIndex(ch => ch.id === finalC.id);
                                    setCurrentChallengeIndex(actualIdx);
                                    setView('exercise');
                                  }
                                }}
                                className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
                                  allNonFinalCompleted 
                                    ? 'bg-white text-slate-900 hover:bg-sky-400 shadow-white/5' 
                                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                }`}
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
                track={selectedTrack || 'sql'}
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
                      .filter(c => {
                        const isNotCurrent = c.id !== currentChallenge.id;
                        const notCompleted = !completedIds.includes(c.id);
                        
                        // If it's a final test, check if it's unlocked
                        if (c.isFinalTest) {
                          const diffChallenges = filteredChallenges.filter(ch => ch.difficulty === c.difficulty);
                          const nonFinalChallenges = diffChallenges.filter(ch => !ch.isFinalTest);
                          const allNonFinalCompleted = nonFinalChallenges.every(ch => completedIds.includes(ch.id));
                          return isNotCurrent && notCompleted && allNonFinalCompleted;
                        }
                        
                        return isNotCurrent && notCompleted;
                      })
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
                    {selectedTrack === 'sql' ? (
                      <DatabaseZap className="w-4 h-4" />
                    ) : selectedTrack === 'excel' ? (
                      <FileSpreadsheet className="w-4 h-4" />
                    ) : (
                      <Terminal className="w-4 h-4" />
                    )}
                    {selectedTrack === 'sql' ? 'Tabelas Disponíveis' : selectedTrack === 'excel' ? 'Dados da Planilha' : 'DataFrames de Entrada'}
                  </h3>
                </div>
                <div className="space-y-6">
                  {selectedTrack === 'excel' ? (
                    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                      <div className="p-4 bg-slate-800/50 border-b border-slate-700">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-green-500" />
                          Workbook: Desafio_{currentChallenge.id}.xlsx
                        </span>
                      </div>
                      <div className="p-2 flex gap-1 bg-slate-900 overflow-x-auto no-scrollbar border-b border-slate-800">
                        {schema.map((table, idx) => (
                          <button
                            key={table.name}
                            onClick={() => {
                              // We can store a local state for active sheet if we want, 
                              // but for simplicity let's show all or just the first for now.
                              // Actually, let's just render them as clear sections.
                            }}
                            className={`px-3 py-1.5 text-[11px] font-bold rounded flex items-center gap-2 whitespace-nowrap transition-all ${
                              idx === 0 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'text-slate-500 hover:text-slate-400'
                            }`}
                          >
                            Sheet: {table.name}
                          </button>
                        ))}
                      </div>
                      <div className="p-4 space-y-8">
                        {schema.map((table) => (
                          <div key={table.name} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="h-px bg-slate-800 flex-1"></div>
                              <span className="text-[10px] uppercase tracking-tighter text-slate-600 font-bold whitespace-nowrap">
                                Dados da Planilha: {table.name}
                              </span>
                              <div className="h-px bg-slate-800 flex-1"></div>
                            </div>
                            <DataTable result={table.data} variant="excel" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    schema.map((table) => (
                      <div key={table.name} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 text-[11px] font-mono font-bold rounded border border-sky-500/20 uppercase tracking-tight">
                            {selectedTrack === 'python' ? `DataFrame: ${table.name}` : `Tabela: ${table.name}`}
                          </span>
                        </div>
                        <DataTable result={table.data} variant={selectedTrack || 'sql'} />
                      </div>
                    ))
                  )}
                  {schema.length === 0 && (
                    <div className="p-4 border border-dashed border-slate-700 rounded-lg text-center text-slate-500 text-sm">
                      Nenhuma fonte de dados definida para este exercício.
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    {selectedTrack === 'sql' ? 'Resultado da sua Query' : selectedTrack === 'excel' ? 'Resultado da sua Fórmula' : 'Resultado do seu Script'}
                  </h3>
                </div>
                <div className="min-h-[200px]">
                  {results.length > 0 ? (
                    <DataTable result={results[0]} variant={selectedTrack || 'sql'} />
                  ) : (
                    <div className="h-48 border border-dashed border-slate-700 rounded-lg flex items-center justify-center bg-slate-900/10">
                      <p className="text-slate-500 text-sm italic">
                        {selectedTrack === 'sql' ? 'Execute sua query para ver os resultados.' : selectedTrack === 'excel' ? 'Execute sua fórmula para ver os resultados.' : 'Execute seu script para ver os resultados.'}
                      </p>
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
                  track={selectedTrack || 'sql'}
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
