import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { LogIn, Loader2, Database, User } from 'lucide-react';
import { SimpleUser } from '../types';

interface AuthProps {
  onAuthSuccess: (user: SimpleUser) => void;
}

export function normalizeUsernameToUid(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 60);
  return `usr_${slug || 'analista'}`;
}

export const AuthUI = ({ onAuthSuccess }: AuthProps) => {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const loginWithUsername = async (rawName: string) => {
    const cleanName = rawName.trim().slice(0, 100);
    if (!cleanName) return;

    setLoading(true);
    const uid = normalizeUsernameToUid(cleanName);
    const simpleUser: SimpleUser = {
      uid,
      displayName: cleanName,
      email: `${uid}@analystmaster.local`
    };

    try {
      sessionStorage.setItem('analyst_master_user', JSON.stringify(simpleUser));
      localStorage.setItem('analyst_master_last_user', JSON.stringify(simpleUser));

      await setDoc(
        doc(db, 'users', uid),
        {
          displayName: cleanName,
          email: `${uid}@analystmaster.local`,
          createdAt: serverTimestamp()
        }
      ).catch(() => {
        // Ignore if user doc already exists
      });
    } finally {
      setLoading(false);
      onAuthSuccess(simpleUser);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithUsername(displayName);
  };

  return (
    <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center mb-5 border border-sky-500/20">
            <Database className="w-7 h-7 text-sky-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Acesso Rápido · Analyst Master
          </h2>
          <p className="text-slate-400 text-sm text-center">
            Digite apenas seu nome de usuário para acessar as trilhas de SQL, Excel, Python e o Modo Duelo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 ml-1 block">
              Seu Nome ou Apelido
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoFocus
                maxLength={60}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm outline-none focus:border-sky-500 transition-colors"
                placeholder="Ex: Wesley, Analista_1, Maria..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !displayName.trim()}
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            Entrar Sem Senha
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
          <p className="text-xs text-slate-500 text-center">
            Ou escolha um perfil rápido para testar (inclusive em duas abas no Modo Duelo):
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => loginWithUsername('Jogador 1')}
              className="py-2 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors"
            >
              Entrar como Jogador 1
            </button>
            <button
              type="button"
              onClick={() => loginWithUsername('Jogador 2')}
              className="py-2 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors"
            >
              Entrar como Jogador 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
