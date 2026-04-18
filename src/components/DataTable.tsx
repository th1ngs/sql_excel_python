import React from 'react';
import { SqlResult } from '../types';

interface DataTableProps {
  result: SqlResult;
  variant?: 'sql' | 'excel' | 'python';
}

export function DataTable({ result, variant = 'sql' }: DataTableProps) {
  if (!result || !result.columns || result.columns.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 italic border border-dashed border-slate-700 rounded-lg">
        Sem dados para exibir.
      </div>
    );
  }

  const getColLetter = (n: number) => {
    let letter = "";
    while (n >= 0) {
      letter = String.fromCharCode((n % 26) + 65) + letter;
      n = Math.floor(n / 26) - 1;
    }
    return letter;
  };

  const isExcel = variant === 'excel';

  return (
    <div className="overflow-x-auto border border-slate-700 rounded-lg bg-slate-900/50">
      <table className="w-full text-sm text-left font-mono border-collapse">
        <thead className="bg-slate-800 text-slate-400">
          {isExcel && (
            <tr className="bg-slate-900/80">
              <th className="px-2 py-1 border border-slate-700 text-[10px] text-center bg-slate-800 w-10"></th>
              {result.columns.map((_, idx) => (
                <th key={`letter-${idx}`} className="px-4 py-1 border border-slate-700 text-[10px] text-center font-bold">
                  {getColLetter(idx)}
                </th>
              ))}
            </tr>
          )}
          <tr>
            {isExcel && <th className="px-2 py-2 border border-slate-700 bg-slate-800"></th>}
            {result.columns.map((col, idx) => (
              <th key={idx} className={`px-4 py-2 border border-slate-700 font-bold uppercase tracking-wider whitespace-nowrap ${isExcel ? 'bg-slate-800/50' : ''}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.values.map((row, rowIdx) => (
            <tr key={rowIdx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              {isExcel && (
                <td className="px-2 py-2 border border-slate-700 bg-slate-800/30 text-[10px] text-center font-bold text-slate-500 w-10">
                  {rowIdx + 1}
                </td>
              )}
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-2 text-slate-300 border border-slate-800/50">
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
