import { useState, useCallback, useEffect } from 'react';
import initSqlJs, { SqlJsStatic } from 'sql.js';
import { ExecutionResult } from '../types';

export function useSqlEngine() {
  const [sqlJs, setSqlJs] = useState<SqlJsStatic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initSqlJs({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.14.1/dist/${file}`,
    })
      .then((SQL) => {
        setSqlJs(SQL);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Falha ao inicializar o banco de dados:', err);
        setLoading(false);
      });
  }, []);

  const runQuery = useCallback((setup: string[], query: string): ExecutionResult => {
    if (!sqlJs) return { success: false, error: 'Motor SQL não inicializado.' };

    let tempDb;
    try {
      tempDb = new sqlJs.Database();
      
      // Setup tables
      setup.forEach(cmd => tempDb.run(cmd));

      // Execute user query
      const res = tempDb.exec(query);
      
      return {
        success: true,
        data: res
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message
      };
    } finally {
      if (tempDb) tempDb.close();
    }
  }, [sqlJs]);

  const getSchema = useCallback((setup: string[]) => {
    if (!sqlJs) return [];

    let tempDb;
    try {
      tempDb = new sqlJs.Database();
      setup.forEach(cmd => tempDb.run(cmd));

      // Get table names
      const tablesRes = tempDb.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
      if (tablesRes.length === 0) return [];

      const tables = tablesRes[0].values.map(v => String(v[0]));
      
      // For each table, get its data
      const schema = tables.map(tableName => {
        const dataRes = tempDb.exec(`SELECT * FROM ${tableName} LIMIT 10`);
        return {
          name: tableName,
          data: dataRes[0] || { columns: [], values: [] }
        };
      });

      return schema;
    } catch (err) {
      console.error('Error getting schema:', err);
      return [];
    } finally {
      if (tempDb) tempDb.close();
    }
  }, [sqlJs]);

  return { loading, runQuery, getSchema };
}
