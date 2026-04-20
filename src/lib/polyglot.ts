import { Track } from '../types';

/**
 * Tradutor Poliglota para o Analyst Master
 * Converte sintaxe de Excel e Python (Pandas) para SQL simulando a execução.
 */
export const translateToSql = (code: string, track: Track, tableName: string, columnNames: string[] = []): string => {
  const cleanCode = code.trim();
  if (!cleanCode) return '';

  if (track === 'sql') return cleanCode;

  const getColLetter = (n: number) => {
    let letter = "";
    while (n >= 0) {
      letter = String.fromCharCode((n % 26) + 65) + letter;
      n = Math.floor(n / 26) - 1;
    }
    return letter;
  };

  const colMapping: Record<string, string> = {};
  columnNames.forEach((name, idx) => {
    colMapping[getColLetter(idx)] = name;
  });

  if (track === 'excel') {
    // Caso seja apenas um nome de coluna ou *, assume SELECT * FROM
    if (!cleanCode.startsWith('=')) {
      if (cleanCode.includes(' ') || cleanCode.includes('=')) return cleanCode; // Provável SQL acidental
      
      // Check if it's a column letter
      if (colMapping[cleanCode.toUpperCase()]) {
        return `SELECT ${colMapping[cleanCode.toUpperCase()]} FROM ${tableName}`;
      }
      return `SELECT ${cleanCode} FROM ${tableName}`;
    }

    let formula = cleanCode.substring(1); // Remove '='

    // Substituir colunas (A, B, C...) por nomes reais
    // Precisamos de cuidado para não substituir "B" dentro de "TABLE" ou nomes de funções
    // Usamos regex com bordas de palavra ou garantindo que não é parte de identificador
    // Uma forma simples é ordenar as colunas por tamanho decrescente (AA antes de A)
    const sortedLetters = Object.keys(colMapping).sort((a, b) => b.length - a.length);
    
    // Handle Ranges like B1:B10 (simplificamos para apenas usar a coluna por enquanto no SQL)
    // Se o usuário pedir B1:B3, ele quer o valor da coluna B. 
    // Em SQL puro, sem um row_number explícito na tabela física, é difícil filtrar por número de linha exato
    // Mas para os exercícios do Analyst Master, geralmente o usuário quer a coluna inteira.
    formula = formula.replace(/([A-Z]+)\d*:([A-Z]+)\d*/gi, (match, col1, col2) => {
       // Se col1 == col2, é apenas uma coluna. Se for diferente, no SQL é mais complexo.
       // Para fins de MVP, se for A1:A10, retorna o nome da coluna A.
       const c1 = col1.toUpperCase();
       return colMapping[c1] || match;
    });

    // Handle single cells like B2
    formula = formula.replace(/\b([A-Z]+)\d+\b/gi, (match, letter) => {
       const l = letter.toUpperCase();
       return colMapping[l] || match;
    });

    // Handle just column letters like A
    sortedLetters.forEach(letter => {
      const regex = new RegExp(`\\b${letter}\\b`, 'gi');
      // Apenas substitui se não for parte de uma palavra (ex: case-insensitive match)
      formula = formula.replace(regex, colMapping[letter]);
    });

    // Mapeamento de Funções Simples
    const mappings: Record<string, string> = {
      'SOMA': 'SUM',
      'MEDIA': 'AVG',
      'MÉDIA': 'AVG',
      'CONTAR': 'COUNT',
      'CONT.VALORES': 'COUNT',
      'MINIMO': 'MIN',
      'MÍNIMO': 'MIN',
      'MAXIMO': 'MAX',
      'MÁXIMO': 'MAX',
      'ANO': "STRFTIME('%Y',",
      'ARRUMAR': 'TRIM',
      'MAIUSCULA': 'UPPER',
      'MAIÚSCULA': 'UPPER',
      'SUBSTITUIR': 'REPLACE',
      'CONCAT': '||', // Simplificado
      'CONCATENAR': '||'
    };

    // Aplica mapeamentos
    Object.entries(mappings).forEach(([excel, sqlFunc]) => {
      const regex = new RegExp(`${excel.replace('.', '\\.')}\\(`, 'gi');
      if (excel === 'ANO') {
         formula = formula.replace(regex, `${sqlFunc} `);
      } else if (excel === 'CONCAT' || excel === 'CONCATENAR') {
         // CONCAT(a; b) -> a || b
         // Isso é complexo com regex, vamos tentar uma abordagem simples
      } else {
         formula = formula.replace(regex, `${sqlFunc}(`);
      }
    });

    // Lógica SE(cond; v1; v2) -> CASE WHEN cond THEN v1 ELSE v2 END
    if (formula.toUpperCase().includes('SE(')) {
       // Melhore o suporte a SE: detecta SE(cond; v1; v2)
       // NOTA: Esta regex é limitada para aninhamento profundo, mas resolve o básico
       formula = formula.replace(/SE\((.*?);(.*?);(.*?)\)/gi, (match, cond, v1, v2) => {
         return `CASE WHEN ${cond.trim()} THEN ${v1.trim()} ELSE ${v2.trim()} END`;
       });
       
       // Fallback se a regex falhar (ex: aninhado)
       formula = formula.replace(/SE\(/gi, 'CASE WHEN ');
    }

    // Replace Excel separators ; with SQL commas (if not already handled in SE)
    formula = formula.replace(/;/g, ',');

    // Se a query não começa com SELECT, adiciona o SELECT
    if (!formula.toUpperCase().trim().startsWith('SELECT')) {
      return `SELECT ${formula} FROM ${tableName}`;
    }
    return formula;
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
