import { Track } from '../types';

/**
 * Tradutor Poliglota para o Analyst Master
 * Converte sintaxe de Excel e Python (Pandas) para SQL simulando a execução.
 */
export const translateToSql = (code: string, track: Track, tableName: string): string => {
  const cleanCode = code.trim();
  if (!cleanCode) return '';

  if (track === 'sql') return cleanCode;

  if (track === 'excel') {
    // Caso seja apenas um nome de coluna ou *, assume SELECT * FROM
    if (!cleanCode.startsWith('=')) {
      if (cleanCode.includes(' ') || cleanCode.includes('=')) return cleanCode; // Provável SQL acidental
      return `SELECT ${cleanCode} FROM ${tableName}`;
    }

    let sql = cleanCode.substring(1); // Remove '='

    // Mapeamento de Funções Simples
    const mappings: Record<string, string> = {
      'SOMA': 'SUM',
      'MEDIA': 'AVG',
      'MÉDIA': 'AVG',
      'CONTAR': 'COUNT',
      'MINIMO': 'MIN',
      'MÍNIMO': 'MIN',
      'MAXIMO': 'MAX',
      'MÁXIMO': 'MAX',
      'ANO': "STRFTIME('%Y',",
      'ARRUMAR': 'TRIM',
      'MAIUSCULA': 'UPPER',
      'MAIÚSCULA': 'UPPER',
      'SUBSTITUIR': 'REPLACE'
    };

    // Aplica mapeamentos (regex simples)
    Object.entries(mappings).forEach(([excel, sqlFunc]) => {
      const regex = new RegExp(`${excel}\\(`, 'gi');
      if (excel === 'ANO') {
         sql = sql.replace(regex, `${sqlFunc} `);
         // Nota: ANO precisa fechar o parêntese do strftime, mas aqui estamos simplificando
      } else {
         sql = sql.replace(regex, `${sqlFunc}(`);
      }
    });

    // Lógica SE(cond; v1; v2) -> CASE WHEN cond THEN v1 ELSE v2 END
    // Suporte básico a SE aninhado (substituição recursiva simples ou manual)
    if (sql.toUpperCase().includes('SE(')) {
       // Simplificação extrema para o MVP: converte os delimitadores de excel para SQL
       sql = sql.replace(/SE\(/gi, 'CASE WHEN ');
       sql = sql.replace(/;/g, ' THEN '); 
       // Isso precisaria de um parser real para múltiplos SE, mas para exercícios simples funciona
    }

    // Se a query não começa com SELECT, adiciona o SELECT
    if (!sql.toUpperCase().startsWith('SELECT')) {
      return `SELECT ${sql} FROM ${tableName}`;
    }
    return sql;
  }

  if (track === 'python') {
    // df['col'].sum() -> SELECT SUM(col) FROM table
    if (cleanCode.includes('.sum()')) {
      const colMatch = cleanCode.match(/df\['(.*?)'\]/);
      const col = colMatch ? colMatch[1] : '*';
      return `SELECT SUM(${col}) FROM ${tableName}`;
    }
    
    // df.head()
    if (cleanCode.includes('.head(')) {
      return `SELECT * FROM ${tableName} LIMIT 5`;
    }

    // df['total'] = df['qtd'] * df['preco'] -> SELECT (qtd * preco) as total FROM table
    if (cleanCode.includes('=') && cleanCode.includes('*')) {
       const targetMatch = cleanCode.match(/df\['(.*?)'\]\s*=/);
       const target = targetMatch ? targetMatch[1] : 'total';
       const cols = cleanCode.split('=')[1].match(/df\['(.*?)'\]/g);
       if (cols && cols.length >= 2) {
          const c1 = cols[0].match(/df\['(.*?)'\]/)?.[1];
          const c2 = cols[1].match(/df\['(.*?)'\]/)?.[1];
          return `SELECT *, (${c1} * ${c2}) as ${target} FROM ${tableName}`;
       }
    }

    // df[['col1', 'col2']] -> SELECT col1, col2 FROM table
    if (cleanCode.startsWith("df[['")) {
       const colsStr = cleanCode.match(/df\[\[(.*?)\]\]/)?.[1];
       if (colsStr) {
          const cols = colsStr.replace(/'/g, "").replace(/"/g, "");
          return `SELECT ${cols} FROM ${tableName}`;
       }
    }

    // df['score'].fillna(0) -> SELECT id, IFNULL(score, 0) as score FROM table
    if (cleanCode.includes('.fillna(')) {
       const colMatch = cleanCode.match(/df\['(.*?)'\]/);
       const col = colMatch ? colMatch[1] : 'score';
       const valMatch = cleanCode.match(/\((.*?)\)/);
       const val = valMatch ? valMatch[1] : '0';
       return `SELECT id, IFNULL(${col}, ${val}) as ${col} FROM ${tableName}`;
    }

    // df['id'].astype(str) -> SELECT CAST(id AS TEXT) as id_str FROM table
    if (cleanCode.includes('.astype(')) {
       const colMatch = cleanCode.match(/df\['(.*?)'\]/);
       const col = colMatch ? colMatch[1] : 'id';
       return `SELECT CAST(${col} AS TEXT) as id_str FROM ${tableName}`;
    }

    return `SELECT * FROM ${tableName}`;
  }

  return cleanCode;
};
