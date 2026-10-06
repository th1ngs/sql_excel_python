import { Track } from '../types';

/**
 * Tradutor Poliglota Avançado para o Analyst Master
 * Converte sintaxe de Excel (PT-BR/EN) e Python (Pandas) para SQL compatível com SQLite.
 */
export const translateToSql = (
  code: string,
  track: Track,
  tableName: string,
  columnNames: string[] = []
): string => {
  const cleanCode = code.trim();
  if (!cleanCode) return '';

  // Se o usuário digitou SQL puro diretamente em qualquer trilha, permite execução direta
  if (/^(SELECT|WITH)\b/i.test(cleanCode)) {
    return cleanCode;
  }

  if (track === 'sql') return cleanCode;

  const getColLetter = (n: number) => {
    let letter = '';
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

  const resolveColRef = (ref: string): string => {
    const trimmed = ref.trim();
    const rangeMatch = trimmed.match(/^([A-Z]+)\d*:\1\d*$/i);
    if (rangeMatch) {
      const letter = rangeMatch[1].toUpperCase();
      return colMapping[letter] || trimmed;
    }
    const cellMatch = trimmed.match(/^([A-Z]+)\d+$/i);
    if (cellMatch) {
      const letter = cellMatch[1].toUpperCase();
      return colMapping[letter] || trimmed;
    }
    if (colMapping[trimmed.toUpperCase()]) {
      return colMapping[trimmed.toUpperCase()];
    }
    return trimmed;
  };

  const parseExcelCriterion = (colExpr: string, rawCrit: string): string => {
    const unquoted = rawCrit.trim().replace(/^['"]|['"]$/g, '');
    const opMatch = unquoted.match(/^(>=|<=|<>|!=|>|<|=)(.*)$/);
    if (opMatch) {
      const op = opMatch[1] === '!=' ? '<>' : opMatch[1];
      const val = opMatch[2].trim();
      const isNum = !isNaN(Number(val)) && val !== '';
      return `${colExpr} ${op} ${isNum ? val : `'${val}'`}`;
    }
    const isNum = !isNaN(Number(unquoted)) && unquoted !== '';
    return `${colExpr} = ${isNum ? unquoted : `'${unquoted}'`}`;
  };

  if (track === 'excel') {
    if (!cleanCode.startsWith('=')) {
      if (colMapping[cleanCode.toUpperCase()]) {
        return `SELECT ${colMapping[cleanCode.toUpperCase()]} FROM ${tableName}`;
      }
      return `SELECT ${cleanCode} FROM ${tableName}`;
    }

    let formula = cleanCode.substring(1).trim();

    // SOMASE(range; criterio; [soma_range])
    const somaseMatch = formula.match(/^(?:SOMASE|SUMIF)\(([^;]+);([^;)]+)(?:;([^)]+))?\)$/i);
    if (somaseMatch) {
      const critCol = resolveColRef(somaseMatch[1]);
      const cond = parseExcelCriterion(critCol, somaseMatch[2]);
      const sumCol = somaseMatch[3] ? resolveColRef(somaseMatch[3]) : critCol;
      return `SELECT SUM(${sumCol}) AS total FROM ${tableName} WHERE ${cond}`;
    }

    // SOMASES(soma_range; range1; crit1; range2; crit2...)
    const somasesMatch = formula.match(/^(?:SOMASES|SUMIFS)\((.+)\)$/i);
    if (somasesMatch) {
      const parts = somasesMatch[1].split(';').map(s => s.trim());
      if (parts.length >= 3) {
        const sumCol = resolveColRef(parts[0]);
        const whereClauses: string[] = [];
        for (let i = 1; i + 1 < parts.length; i += 2) {
          whereClauses.push(parseExcelCriterion(resolveColRef(parts[i]), parts[i + 1]));
        }
        return `SELECT SUM(${sumCol}) AS total FROM ${tableName} WHERE ${whereClauses.join(' AND ')}`;
      }
    }

    // CONT.SE(range; criterio)
    const contseMatch = formula.match(/^(?:CONT\.SE|COUNTIF)\(([^;]+);([^)]+)\)$/i);
    if (contseMatch) {
      const critCol = resolveColRef(contseMatch[1]);
      const cond = parseExcelCriterion(critCol, contseMatch[2]);
      return `SELECT COUNT(*) AS total FROM ${tableName} WHERE ${cond}`;
    }

    // CONT.SES(range1; crit1; range2; crit2...)
    const contsesMatch = formula.match(/^(?:CONT\.SES|COUNTIFS)\((.+)\)$/i);
    if (contsesMatch) {
      const parts = contsesMatch[1].split(';').map(s => s.trim());
      const whereClauses: string[] = [];
      for (let i = 0; i + 1 < parts.length; i += 2) {
        whereClauses.push(parseExcelCriterion(resolveColRef(parts[i]), parts[i + 1]));
      }
      return `SELECT COUNT(*) AS total FROM ${tableName} WHERE ${whereClauses.join(' AND ')}`;
    }

    // MÉDIASE(range; criterio; [media_range])
    const mediaseMatch = formula.match(/^(?:MÉDIASE|MEDIASE|AVERAGEIF)\(([^;]+);([^;)]+)(?:;([^)]+))?\)$/i);
    if (mediaseMatch) {
      const critCol = resolveColRef(mediaseMatch[1]);
      const cond = parseExcelCriterion(critCol, mediaseMatch[2]);
      const avgCol = mediaseMatch[3] ? resolveColRef(mediaseMatch[3]) : critCol;
      return `SELECT AVG(${avgCol}) AS media FROM ${tableName} WHERE ${cond}`;
    }

    // MÉDIASES(media_range; range1; crit1; ...)
    const mediasesMatch = formula.match(/^(?:MÉDIASES|MEDIASES|AVERAGEIFS)\((.+)\)$/i);
    if (mediasesMatch) {
      const parts = mediasesMatch[1].split(';').map(s => s.trim());
      if (parts.length >= 3) {
        const avgCol = resolveColRef(parts[0]);
        const whereClauses: string[] = [];
        for (let i = 1; i + 1 < parts.length; i += 2) {
          whereClauses.push(parseExcelCriterion(resolveColRef(parts[i]), parts[i + 1]));
        }
        return `SELECT AVG(${avgCol}) AS media FROM ${tableName} WHERE ${whereClauses.join(' AND ')}`;
      }
    }

    // Substituir intervalos A1:A10 ou A:A
    const sortedLetters = Object.keys(colMapping).sort((a, b) => b.length - a.length);
    formula = formula.replace(/([A-Z]+)\d*:([A-Z]+)\d*/gi, (match, col1) => {
      const c1 = col1.toUpperCase();
      return colMapping[c1] || match;
    });

    // Substituir células B2
    formula = formula.replace(/\b([A-Z]+)\d+\b/gi, (match, letter) => {
      const l = letter.toUpperCase();
      return colMapping[l] || match;
    });

    // Substituir letras isoladas de colunas
    sortedLetters.forEach(letter => {
      const regex = new RegExp(`\\b${letter}\\b`, 'gi');
      formula = formula.replace(regex, colMapping[letter]);
    });

    // E(cond1; cond2) e OU(cond1; cond2)
    formula = formula.replace(/\b(?:E|AND)\(([^()]+)\)/gi, (_, inner) => {
      return `(${inner.split(';').map((s: string) => s.trim()).join(' AND ')})`;
    });
    formula = formula.replace(/\b(?:OU|OR)\(([^()]+)\)/gi, (_, inner) => {
      return `(${inner.split(';').map((s: string) => s.trim()).join(' OR ')})`;
    });

    // ESQUERDA, DIREITA, EXT.TEXTO
    formula = formula.replace(/\b(?:ESQUERDA|LEFT)\(([^;]+);([^)]+)\)/gi, 'SUBSTR($1, 1, $2)');
    formula = formula.replace(/\b(?:DIREITA|RIGHT)\(([^;]+);([^)]+)\)/gi, 'SUBSTR($1, -($2))');
    formula = formula.replace(/\b(?:EXT\.TEXTO|MID)\(([^;]+);([^;]+);([^)]+)\)/gi, 'SUBSTR($1, $2, $3)');

    // Funções diretas
    const mappings: Record<string, string> = {
      'SOMA': 'SUM',
      'MEDIA': 'AVG',
      'MÉDIA': 'AVG',
      'CONTAR': 'COUNT',
      'CONT.VALORES': 'COUNT',
      'CONT.NÚM': 'COUNT',
      'MINIMO': 'MIN',
      'MÍNIMO': 'MIN',
      'MAXIMO': 'MAX',
      'MÁXIMO': 'MAX',
      'ARRUMAR': 'TRIM',
      'MAIUSCULA': 'UPPER',
      'MAIÚSCULA': 'UPPER',
      'MINUSCULA': 'LOWER',
      'MINÚSCULA': 'LOWER',
      'SUBSTITUIR': 'REPLACE',
      'NÚM.CARACT': 'LENGTH',
      'NUM.CARACT': 'LENGTH',
      'ARRED': 'ROUND',
      'SEERRO': 'COALESCE',
      'ABS': 'ABS'
    };

    Object.entries(mappings).forEach(([excel, sqlFunc]) => {
      const regex = new RegExp(`\\b${excel.replace('.', '\\.')}\\(`, 'gi');
      formula = formula.replace(regex, `${sqlFunc}(`);
    });

    // Suporte a SE aninhado ou simples (de dentro para fora)
    let safety = 0;
    while (/\b(?:SE|IF)\(([^()]+)\)/i.test(formula) && safety < 5) {
      formula = formula.replace(/\b(?:SE|IF)\(([^()]+)\)/gi, (_, inner) => {
        const parts = inner.split(';');
        if (parts.length >= 3) {
          return `CASE WHEN ${parts[0].trim()} THEN ${parts[1].trim()} ELSE ${parts.slice(2).join(';').trim()} END`;
        }
        return inner;
      });
      safety++;
    }

    formula = formula.replace(/;/g, ',');

    if (!formula.toUpperCase().trim().startsWith('SELECT')) {
      return `SELECT ${formula} FROM ${tableName}`;
    }
    return formula;
  }

  if (track === 'python') {
    // 1. df.groupby(...)[...].agg/sum/mean/count/max/min
    const groupMatch = cleanCode.match(
      /df\.groupby\(\s*(?:\[([^\]]+)\]|['"]([^'"]+)['"])\s*\)\[\s*['"]([^'"]+)['"]\s*\]\.(sum|mean|count|max|min)\(\)/i
    );
    if (groupMatch) {
      const groupCols = groupMatch[1]
        ? groupMatch[1].replace(/['"]/g, '').trim()
        : groupMatch[2].trim();
      const targetCol = groupMatch[3].trim();
      const fnMap: Record<string, string> = {
        sum: 'SUM',
        mean: 'AVG',
        count: 'COUNT',
        max: 'MAX',
        min: 'MIN'
      };
      const sqlFn = fnMap[groupMatch[4].toLowerCase()] || 'SUM';
      return `SELECT ${groupCols}, ${sqlFn}(${targetCol}) AS ${targetCol} FROM ${tableName} GROUP BY ${groupCols}`;
    }

    // 2. df.query('...')
    const queryMethodMatch = cleanCode.match(/df\.query\(\s*['"](.+)[""']\s*\)/i);
    if (queryMethodMatch) {
      const cond = queryMethodMatch[1]
        .replace(/==/g, '=')
        .replace(/!=/g, '<>')
        .replace(/\band\b/gi, 'AND')
        .replace(/\bor\b/gi, 'OR');
      return `SELECT * FROM ${tableName} WHERE ${cond}`;
    }

    // 3. df.nlargest(n, 'col') / df.nsmallest(n, 'col')
    const nLargeMatch = cleanCode.match(/df\.(nlargest|nsmallest)\(\s*(\d+)\s*,\s*['"]([^'"]+)['"]\s*\)/i);
    if (nLargeMatch) {
      const dir = nLargeMatch[1].toLowerCase() === 'nlargest' ? 'DESC' : 'ASC';
      const limit = nLargeMatch[2];
      const col = nLargeMatch[3];
      return `SELECT * FROM ${tableName} ORDER BY ${col} ${dir} LIMIT ${limit}`;
    }

    // 4. df['col'].value_counts()
    const valCountsMatch = cleanCode.match(/df\[\s*['"]([^'"]+)['"]\s*\]\.value_counts\(\)/i);
    if (valCountsMatch) {
      const col = valCountsMatch[1];
      return `SELECT ${col}, COUNT(*) AS count FROM ${tableName} GROUP BY ${col} ORDER BY count DESC`;
    }

    // 5. df['col'].nunique()
    const nuniqueMatch = cleanCode.match(/df\[\s*['"]([^'"]+)['"]\s*\]\.nunique\(\)/i);
    if (nuniqueMatch) {
      return `SELECT COUNT(DISTINCT ${nuniqueMatch[1]}) AS res FROM ${tableName}`;
    }

    // 6. df[boolean_condition]
    if (cleanCode.startsWith('df[') && !cleanCode.startsWith('df[[')) {
      const inner = cleanCode.slice(3, cleanCode.lastIndexOf(']'));
      // Check simple series selection df['col']
      if (/^['"][a-zA-Z0-9_]+['"]$/.test(inner.trim())) {
        const col = inner.trim().replace(/['"]/g, '');
        return `SELECT ${col} FROM ${tableName}`;
      }

      let sqlWhere = inner
        .replace(/~df\[\s*['"]([^'"]+)['"]\s*\]\.isin\(\[([^\]]+)\]\)/g, '$1 NOT IN ($2)')
        .replace(/df\[\s*['"]([^'"]+)['"]\s*\]\.isin\(\[([^\]]+)\]\)/g, '$1 IN ($2)')
        .replace(/df\[\s*['"]([^'"]+)['"]\s*\]\.between\(([^,]+),\s*([^)]+)\)/g, '$1 BETWEEN $2 AND $3')
        .replace(/df\[\s*['"]([^'"]+)['"]\s*\]\.str\.contains\(\s*['"]([^'"]+)['"]\s*\)/g, "$1 LIKE '%$2%'")
        .replace(/df\[\s*['"]([^'"]+)['"]\s*\]\.isnull\(\)/g, '$1 IS NULL')
        .replace(/df\[\s*['"]([^'"]+)['"]\s*\]\.notnull\(\)/g, '$1 IS NOT NULL')
        .replace(/df\[\s*['"]([^'"]+)['"]\s*\]/g, '$1')
        .replace(/==/g, '=')
        .replace(/&/g, ' AND ')
        .replace(/\|/g, ' OR ');

      return `SELECT * FROM ${tableName} WHERE ${sqlWhere}`;
    }

    // 7. df.sort_values(...)
    const sortMatch = cleanCode.match(
      /df\.sort_values\(\s*(?:by=)?(?:\[([^\]]+)\]|['"]([^'"]+)['"])(?:\s*,\s*ascending=(True|False))?\s*\)/i
    );
    if (sortMatch) {
      const cols = (sortMatch[1] || sortMatch[2]).replace(/['"]/g, '').trim();
      const dir = sortMatch[3]?.toLowerCase() === 'false' ? 'DESC' : 'ASC';
      const headMatch = cleanCode.match(/\.head\((\d+)\)/);
      const limitClause = headMatch ? ` LIMIT ${headMatch[1]}` : '';
      return `SELECT * FROM ${tableName} ORDER BY ${cols} ${dir}${limitClause}`;
    }

    // 8. df['col'].sum() / mean() / max() / min()
    const simpleAggMatch = cleanCode.match(/df\[\s*['"]([^'"]+)['"]\s*\]\.(sum|mean|max|min|count)\(\)/i);
    if (simpleAggMatch) {
      const col = simpleAggMatch[1];
      const fnMap: Record<string, string> = {
        sum: 'SUM',
        mean: 'AVG',
        max: 'MAX',
        min: 'MIN',
        count: 'COUNT'
      };
      return `SELECT ${fnMap[simpleAggMatch[2].toLowerCase()]}(${col}) AS res FROM ${tableName}`;
    }

    // 9. df.head(n) / df.tail(n)
    if (cleanCode.includes('.head(')) {
      const n = cleanCode.match(/\.head\((\d+)\)/)?.[1] || '5';
      return `SELECT * FROM ${tableName} LIMIT ${n}`;
    }
    if (cleanCode.includes('.tail(')) {
      const n = cleanCode.match(/\.tail\((\d+)\)/)?.[1] || '5';
      return `SELECT * FROM ${tableName} ORDER BY ROWID DESC LIMIT ${n}`;
    }

    // 10. df[['col1', 'col2']]
    if (cleanCode.startsWith('df[[')) {
      const colsStr = cleanCode.match(/df\[\[(.*?)\]\]/)?.[1];
      if (colsStr) {
        const cols = colsStr.replace(/['"]/g, '');
        return `SELECT ${cols} FROM ${tableName}`;
      }
    }

    // 11. df.dropna() / df.drop_duplicates()
    if (cleanCode.includes('.dropna(')) {
      const col = columnNames[1] || columnNames[0] || 'rowid';
      return `SELECT * FROM ${tableName} WHERE ${col} IS NOT NULL`;
    }
    if (cleanCode.includes('.drop_duplicates(')) {
      return `SELECT DISTINCT * FROM ${tableName}`;
    }

    // 12. len(df)
    if (cleanCode === 'len(df)') {
      return `SELECT COUNT(*) AS res FROM ${tableName}`;
    }

    return `SELECT * FROM ${tableName}`;
  }

  return cleanCode;
};
