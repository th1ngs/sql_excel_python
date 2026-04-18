import React, { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { LogIn, UserPlus, LogOut, Loader2, Sparkles, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthProps {
  onAuthSuccess: () => void;
}

export const AuthUI = ({ onAuthSuccess }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName });
        
        // Create user doc
        await setDoc(doc(db, 'users', user.uid), {
          displayName,
          email,
          createdAt: serverTimestamp()
        });
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full p-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-sky-500/20 rounded-full blur-[80px]" />
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px]" />
      
      <div className="relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-6 border border-sky-500/20">
             <Database className="w-8 h-8 text-sky-400" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h2>
          <p className="text-slate-400 text-sm text-center">
            {isLogin 
              ? 'Acesse seu laboratório e continue sua jornada como Analyst Master.' 
              : 'Comece hoje mesmo sua trilha para se tornar um Analyst Master.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
              <input 
                type="text" 
                required 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-white outline-none focus:border-sky-500 transition-all"
                placeholder="Ex: Seu Nome"
              />
            </div>
          )}
          
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">E-mail</label>
             <input 
               type="email" 
               required 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-white outline-none focus:border-sky-500 transition-all"
               placeholder="email@exemplo.com"
             />
          </div>

          <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Senha</label>
             <input 
               type="password" 
               required 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-3 text-white outline-none focus:border-sky-500 transition-all"
               placeholder="••••••••"
             />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-xl shadow-sky-500/10 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isLogin ? 'Entrar no Analyst Master' : 'Criar minha conta'}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-400 text-xs text-center mt-4 font-bold"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center">
           <p className="text-slate-500 text-xs">
             {isLogin ? 'Ainda não tem conta?' : 'Já possui uma conta?'}
             <button 
               onClick={() => setIsLogin(!isLogin)}
               className="text-sky-400 font-bold ml-2 hover:underline"
             >
               {isLogin ? 'Criar conta agora' : 'Fazer login'}
             </button>
           </p>
        </div>
      </div>
    </div>
  );
};
