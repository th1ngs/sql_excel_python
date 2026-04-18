import React from 'react';
import { Play } from 'lucide-react';

interface SqlEditorProps {
  query: string;
  setQuery: (q: string) => void;
  onRun: () => void;
  loading?: boolean;
}

export function SqlEditor({ query, setQuery, onRun, loading }: SqlEditorProps) {
  return (
    <div className="flex flex-col h-full bg-[#020617] rounded-lg border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs font-mono text-slate-400">query.sql</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setQuery('')}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={onRun}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-600 text-white text-sm font-medium rounded transition-colors group"
          >
            <Play className={`w-4 h-4 ${loading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
            {loading ? 'Executando...' : 'Executar'}
          </button>
        </div>
      </div>
      <div className="flex-1 relative font-mono text-sm">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 bg-transparent text-sky-400 outline-none resize-none placeholder:text-slate-700"
          placeholder="SELECT * FROM..."
        />
        <div className="absolute right-4 bottom-4 pointer-events-none opacity-20 hidden md:block">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor" className="text-sky-500">
            <path d="M5 5h30v30H5V5zm2 2v26h26V7H7zm4 4h18v2H11v-2zm0 4h18v2H11v-2zm0 4h12v2H11v-2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
