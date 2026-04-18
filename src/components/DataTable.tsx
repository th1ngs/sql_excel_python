import React from 'react';
import { SqlResult } from '../types';

interface DataTableProps {
  result: SqlResult;
}

export function DataTable({ result }: DataTableProps) {
  if (!result || !result.columns || result.columns.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 italic border border-dashed border-slate-700 rounded-lg">
        Sem dados para exibir.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-700 rounded-lg bg-slate-900/50">
      <table className="w-full text-sm text-left font-mono">
        <thead className="bg-slate-800 text-slate-400">
          <tr>
            {result.columns.map((col, idx) => (
              <th key={idx} className="px-4 py-2 border-b border-slate-700 font-bold uppercase tracking-wider whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.values.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-2 text-slate-300">
                  {cell === null ? <span className="text-slate-600 italic">NULL</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
