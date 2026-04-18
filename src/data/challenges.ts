import { Challenge } from '../types';

export const challenges: Challenge[] = [
  // ==========================================
  // TRILHA: SQL MASTER (25 Desafios)
  // ==========================================
  
  // BÁSICO - SQL
  {
    id: 'sql-b-1',
    track: 'sql',
    title: 'Exploração Inicial',
    difficulty: 'Básico',
    category: 'SELECT',
    description: 'Selecione todos os campos da tabela `funcionarios` para conhecer a equipe.',
    hint: 'SELECT * FROM funcionários',
    tableSetup: [
      "CREATE TABLE funcionarios (id INTEGER, nome TEXT, cargo TEXT, salario REAL);",
      "INSERT INTO funcionarios VALUES (1, 'Carlos', 'Analista', 4500), (2, 'Beatriz', 'Gerente', 8200), (3, 'Higor', 'Estagiário', 1500);"
    ],
    expectedOutput: [
      { id: 1, nome: 'Carlos', cargo: 'Analista', salario: 4500 },
      { id: 2, nome: 'Beatriz', cargo: 'Gerente', salario: 8200 },
      { id: 3, nome: 'Higor', cargo: 'Estagiário', salario: 1500 }
    ],
    initialQuery: 'SELECT * FROM funcionarios'
  },
  {
    id: 'sql-b-2',
    track: 'sql',
    title: 'Filtro de Salário',
    difficulty: 'Básico',
    category: 'WHERE',
    description: 'Selecione o `nome` e o `cargo` dos funcionários que ganham mais que 4000.',
    hint: 'WHERE salario > 4000',
    tableSetup: [
      "CREATE TABLE funcionarios (nome TEXT, cargo TEXT, salario REAL);",
      "INSERT INTO funcionarios VALUES ('Carlos', 'Analista', 4500), ('Beatriz', 'Gerente', 8200), ('Higor', 'Estagiário', 1500);"
    ],
    expectedOutput: [
      { nome: 'Carlos', cargo: 'Analista' },
      { nome: 'Beatriz', cargo: 'Gerente' }
    ],
    initialQuery: 'SELECT nome, cargo FROM funcionarios'
  },
  {
    id: 'sql-b-3',
    track: 'sql',
    title: 'Busca por Padrão',
    difficulty: 'Básico',
    category: 'LIKE',
    description: "Selecione todos os clientes da tabela `clientes` cujo nome começa com 'A'.",
    hint: "WHERE nome LIKE 'A%'",
    tableSetup: [
      "CREATE TABLE clientes (nome TEXT);",
      "INSERT INTO clientes VALUES ('Alice'), ('Arthur'), ('Bernardo'), ('Amanda');"
    ],
    expectedOutput: [{ nome: 'Alice' }, { nome: 'Arthur' }, { nome: 'Amanda' }],
    initialQuery: 'SELECT * FROM clientes'
  },
  {
    id: 'sql-b-4',
    track: 'sql',
    title: 'Valores Únicos',
    difficulty: 'Básico',
    category: 'DISTINCT',
    description: "Recupere todos os departamentos únicos da tabela `setores` sem duplicatas.",
    hint: "SELECT DISTINCT departamento FROM setores",
    tableSetup: [
      "CREATE TABLE setores (nome TEXT, departamento TEXT);",
      "INSERT INTO setores VALUES ('A', 'TI'), ('B', 'RH'), ('C', 'TI'), ('D', 'Vendas');"
    ],
    expectedOutput: [{ departamento: 'RH' }, { departamento: 'TI' }, { departamento: 'Vendas' }],
    initialQuery: 'SELECT departamento FROM setores'
  },
  {
    id: 'sql-b-5',
    track: 'sql',
    title: 'Ordenação Crucial',
    difficulty: 'Básico',
    category: 'ORDER BY',
    description: "Selecione todos os produtos e ordene-os pelo preço do menor para o maior.",
    hint: "ORDER BY preco ASC",
    tableSetup: [
      "CREATE TABLE produtos (nome TEXT, preco REAL);",
      "INSERT INTO produtos VALUES ('Mouse', 50), ('Teclado', 150), ('Cabo', 20);"
    ],
    expectedOutput: [
      { nome: 'Cabo', preco: 20 },
      { nome: 'Mouse', preco: 50 },
      { nome: 'Teclado', preco: 150 }
    ],
    initialQuery: 'SELECT * FROM produtos',
    orderSensitive: true
  },

  // INTERMEDIÁRIO - SQL
  {
    id: 'sql-i-1',
    track: 'sql',
    title: 'Agrupamento de Vendas',
    difficulty: 'Intermediário',
    category: 'GROUP BY',
    description: 'Calcule o total de vendas (`valor`) por `vendedor`. Nomeie a coluna de soma como `total_vendas`.',
    hint: 'SUM(valor) ... GROUP BY vendedor',
    tableSetup: [
      "CREATE TABLE vendas (vendedor TEXT, valor REAL);",
      "INSERT INTO vendas VALUES ('Ana', 100), ('Joao', 150), ('Ana', 200), ('Joao', 50);"
    ],
    expectedOutput: [
      { vendedor: 'Ana', total_vendas: 300 },
      { vendedor: 'Joao', total_vendas: 200 }
    ],
    initialQuery: 'SELECT vendedor, SUM(valor) as total_vendas FROM vendas'
  },
  {
    id: 'sql-i-2',
    track: 'sql',
    title: 'Filtro Grupal',
    difficulty: 'Intermediário',
    category: 'HAVING',
    description: "Mostre apenas os vendedores que tiveram um total de vendas superior a 250.",
    hint: "GROUP BY vendedor HAVING total_vendas > 250",
    tableSetup: [
      "CREATE TABLE vendas (vendedor TEXT, valor REAL);",
      "INSERT INTO vendas VALUES ('Ana', 100), ('Joao', 150), ('Ana', 200), ('Joao', 50);"
    ],
    expectedOutput: [{ vendedor: 'Ana', total_vendas: 300 }],
    initialQuery: 'SELECT vendedor, SUM(valor) as total_vendas FROM vendas GROUP BY vendedor'
  },
  {
    id: 'sql-i-3',
    track: 'sql',
    title: 'Cruzamento de Dados',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Selecione o nome do cliente e o nome do produto que ele comprou. Tabelas: `clientes` e `pedidos`.",
    hint: "JOIN pedidos ON clientes.id = pedidos.cliente_id",
    tableSetup: [
      "CREATE TABLE clientes (id INTEGER, nome TEXT);",
      "CREATE TABLE pedidos (cliente_id INTEGER, produto TEXT);",
      "INSERT INTO clientes VALUES (1, 'Alice'), (2, 'Bob');",
      "INSERT INTO pedidos VALUES (1, 'iPhone'), (2, 'MacBook'), (1, 'iPad');"
    ],
    expectedOutput: [
      { nome: 'Alice', produto: 'iPhone' },
      { nome: 'Alice', produto: 'iPad' },
      { nome: 'Bob', produto: 'MacBook' }
    ],
    initialQuery: 'SELECT c.nome, p.produto FROM clientes c JOIN pedidos p ON c.id = p.cliente_id'
  },

  // AVANÇADO - SQL
  {
    id: 'sql-a-1',
    track: 'sql',
    title: 'Subquery de Elite',
    difficulty: 'Avançado',
    category: 'SUBQUERY',
    description: "Encontre os funcionários que ganham mais que a média salarial de toda a empresa.",
    hint: "WHERE salario > (SELECT AVG(salario) FROM funcionarios)",
    tableSetup: [
      "CREATE TABLE funcionarios (nome TEXT, salario REAL);",
      "INSERT INTO funcionarios VALUES ('Ana', 3000), ('Beto', 5000), ('Caio', 8000), ('Duda', 4000);"
    ],
    expectedOutput: [
      { nome: 'Caio', salario: 8000 }
    ],
    initialQuery: 'SELECT * FROM funcionarios'
  },
  {
    id: 'sql-a-2',
    track: 'sql',
    title: 'Relatório Condicional',
    difficulty: 'Avançado',
    category: 'CASE',
    description: "Crie uma coluna chamada `status` que diga: 'Alto' se o estoque for maior que 100, e 'Baixo' caso contrário.",
    hint: "CASE WHEN quantidade > 100 THEN 'Alto' ELSE 'Baixo' END",
    tableSetup: [
      "CREATE TABLE estoque (item TEXT, quantidade INTEGER);",
      "INSERT INTO estoque VALUES ('Parafuso', 500), ('Prego', 30), ('Martelo', 150), ('Chave', 10);"
    ],
    expectedOutput: [
      { item: 'Parafuso', status: 'Alto' },
      { item: 'Prego', status: 'Baixo' },
      { item: 'Martelo', status: 'Alto' },
      { item: 'Chave', status: 'Baixo' }
    ],
    initialQuery: 'SELECT item FROM estoque'
  },

  // ==========================================
  // TRILHA: EXCEL AVANÇADO (Simulado)
  // ==========================================
  
  // BÁSICO - EXCEL
  {
    id: 'excel-b-1',
    track: 'excel',
    title: 'AutoSoma e Funções Base',
    difficulty: 'Básico',
    category: 'SOMA',
    description: "Simule a função =SOMA() do Excel. Calcule a soma total da coluna `faturamento` na tabela `planilha_vendas`.",
    hint: "No SQL usamos SUM(coluna)",
    tableSetup: [
      "CREATE TABLE planilha_vendas (id INTEGER, faturamento REAL);",
      "INSERT INTO planilha_vendas VALUES (1, 1200.50), (2, 450.00), (3, 890.30);"
    ],
    expectedOutput: [{ total: 2540.8 }],
    initialQuery: 'SELECT SUM(faturamento) as total FROM planilha_vendas'
  },
  {
    id: 'excel-b-2',
    track: 'excel',
    title: 'Média de Notas',
    difficulty: 'Básico',
    category: 'AVERAGE',
    description: "Simule a função =MÉDIA() do Excel. Calcule a média das notas dos alunos.",
    hint: "No SQL usamos AVG(nota)",
    tableSetup: [
      "CREATE TABLE notas (aluno TEXT, nota REAL);",
      "INSERT INTO notas VALUES ('Igor', 8), ('Julia', 10), ('Kiko', 6);"
    ],
    expectedOutput: [{ media: 8 }],
    initialQuery: 'SELECT AVG(nota) as media FROM notas'
  },

  // INTERMEDIÁRIO - EXCEL
  {
    id: 'excel-i-1',
    track: 'excel',
    title: 'Procura Vertical (VLOOKUP)',
    difficulty: 'Intermediário',
    category: 'VLOOKUP',
    description: "Simule um =PROCV(). Você tem a tabela `ID_CLIENTES` e a tabela `ENDERECOS`. Traga o nome do cliente e sua respectiva cidade.",
    hint: "O PROCV no SQL é feito através de um INNER JOIN usando a chave comum.",
    tableSetup: [
      "CREATE TABLE ID_CLIENTES (id INTEGER, nome TEXT);",
      "CREATE TABLE ENDERECOS (id_ref INTEGER, cidade TEXT);",
      "INSERT INTO ID_CLIENTES VALUES (1, 'Marcos'), (2, 'Sofia');",
      "INSERT INTO ENDERECOS VALUES (1, 'São Paulo'), (2, 'Curitiba');"
    ],
    expectedOutput: [
      { nome: 'Marcos', cidade: 'São Paulo' },
      { nome: 'Sofia', cidade: 'Curitiba' }
    ],
    initialQuery: 'SELECT c.nome, e.cidade FROM ID_CLIENTES c'
  },
  {
    id: 'excel-i-2',
    track: 'excel',
    title: 'Tabela Dinâmica (Pivot)',
    difficulty: 'Intermediário',
    category: 'PIVOT',
    description: "Simule uma Tabela Dinâmica básica. Conte quantos itens existem em cada categoria (`setor`).",
    hint: "Use GROUP BY para consolidar os dados como em uma Tabela Dinâmica.",
    tableSetup: [
      "CREATE TABLE inventario (item TEXT, setor TEXT);",
      "INSERT INTO inventario VALUES ('Mesa', 'Escritório'), ('Cadeira', 'Escritório'), ('Sofá', 'Sala'), ('TV', 'Sala'), ('Fone', 'Escritório');"
    ],
    expectedOutput: [
      { setor: 'Escritório', contagem: 3 },
      { setor: 'Sala', contagem: 2 }
    ],
    initialQuery: 'SELECT setor, COUNT(*) as contagem FROM inventario GROUP BY setor'
  },

  // ==========================================
  // TRILHA: PYTHON DATA (Simulado)
  // ==========================================

  // BÁSICO - PYTHON
  {
    id: 'python-b-1',
    track: 'python',
    title: 'Filtro de DataFrame',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "No Pandas, usamos df[df['idade'] > 18]. Simule esse filtro trazendo os usuários maiores de idade.",
    hint: "No SQL, o filtro [df['col'] > x] é o WHERE col > x.",
    tableSetup: [
      "CREATE TABLE df_users (nome TEXT, idade INTEGER);",
      "INSERT INTO df_users VALUES ('Alice', 15), ('Bob', 22), ('Charlie', 19);"
    ],
    expectedOutput: [{ nome: 'Bob', idade: 22 }, { nome: 'Charlie', idade: 19 }],
    initialQuery: 'SELECT * FROM df_users'
  },
  {
    id: 'python-b-2',
    track: 'python',
    title: 'Pandas Head()',
    difficulty: 'Básico',
    category: 'HEAD',
    description: "Simule o comando `df.head(2)` do Pandas em uma tabela de mil registros (fictícia).",
    hint: "Use LIMIT 2.",
    tableSetup: [
      "CREATE TABLE dataset (id INTEGER, val TEXT);",
      "INSERT INTO dataset VALUES (1, 'A'), (2, 'B'), (3, 'C'), (4, 'D');"
    ],
    expectedOutput: [{ id: 1, val: 'A' }, { id: 2, val: 'B' }],
    initialQuery: 'SELECT * FROM dataset',
    orderSensitive: true
  },

  // INTERMEDIÁRIO - PYTHON
  {
    id: 'python-i-1',
    track: 'python',
    title: 'Tratamento de Strings (Strip/Upper)',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Limpe os dados: remova espaços em branco à direita e converta a coluna `tags` para maiúsculas.",
    hint: "No SQL usamos UPPER(RTRIM(coluna)).",
    tableSetup: [
      "CREATE TABLE raw_data (id INTEGER, tags TEXT);",
      "INSERT INTO raw_data VALUES (1, 'python   '), (2, 'sql   '), (3, 'excel   ');"
    ],
    expectedOutput: [
      { id: 1, tags_cleaned: 'PYTHON' },
      { id: 2, tags_cleaned: 'SQL' },
      { id: 3, tags_cleaned: 'EXCEL' }
    ],
    initialQuery: 'SELECT id, UPPER(RTRIM(tags)) as tags_cleaned FROM raw_data'
  },
  {
    id: 'python-i-2',
    track: 'python',
    title: 'Merge de DataFrames',
    difficulty: 'Intermediário',
    category: 'MERGE',
    description: "Simule `pd.merge(df1, df2, on='id')`. Traga as informações de alunos e seus respectivos cursos.",
    hint: "Merge do Pandas 'on' chave é o nosso INNER JOIN.",
    tableSetup: [
      "CREATE TABLE df1 (id INTEGER, nome TEXT);",
      "CREATE TABLE df2 (id_ref INTEGER, curso TEXT);",
      "INSERT INTO df1 VALUES (1, 'Ana'), (2, 'Bruno');",
      "INSERT INTO df2 VALUES (1, 'Data Science'), (2, 'Big Data');"
    ],
    expectedOutput: [
      { nome: 'Ana', curso: 'Data Science' },
      { nome: 'Bruno', curso: 'Big Data' }
    ],
    initialQuery: 'SELECT df1.nome, df2.curso FROM df1 JOIN df2 ON df1.id = df2.id_ref'
  },

  // AVANÇADO - EXCEL
  {
    id: 'excel-a-1',
    track: 'excel',
    title: 'Ranking Dinâmico',
    difficulty: 'Avançado',
    category: 'RANK',
    description: "Simule a criação de um Ranking de Vendas. Atribua uma posição (1, 2, 3...) para cada vendedor baseada no faturamento (maior para menor).",
    hint: "Use a função de janela ROW_NUMBER() OVER(ORDER BY faturamento DESC).",
    tableSetup: [
      "CREATE TABLE vendas (vendedor TEXT, faturamento REAL);",
      "INSERT INTO vendas VALUES ('Ana', 5000), ('Beto', 7000), ('Caio', 3000);"
    ],
    expectedOutput: [
      { vendedor: 'Beto', rank: 1 },
      { vendedor: 'Ana', rank: 2 },
      { vendedor: 'Caio', rank: 3 }
    ],
    initialQuery: 'SELECT vendedor, ROW_NUMBER() OVER(ORDER BY faturamento DESC) as rank FROM vendas',
    orderSensitive: true
  },
  {
    id: 'excel-a-2',
    track: 'excel',
    title: 'IF aninhado (Procv condicional)',
    difficulty: 'Avançado',
    category: 'CASE',
    description: "Crie uma lógica de comissão: Se venda > 10000 -> 10%, se > 5000 -> 5%, senão 0%. Nomeie como `comissao_pct`.",
    hint: "O CASE WHEN é perfeito para substituir múltiplos IFs do Excel.",
    tableSetup: [
      "CREATE TABLE mensal (vendedor TEXT, vendas REAL);",
      "INSERT INTO mensal VALUES ('A', 12000), ('B', 7000), ('C', 2000);"
    ],
    expectedOutput: [
      { vendedor: 'A', comissao_pct: 0.1 },
      { vendedor: 'B', comissao_pct: 0.05 },
      { vendedor: 'C', comissao_pct: 0 }
    ],
    initialQuery: 'SELECT vendedor, CASE WHEN vendas > 10000 THEN 0.1 WHEN vendas > 5000 THEN 0.05 ELSE 0 END as comissao_pct FROM mensal'
  },

  // AVANÇADO - PYTHON
  {
    id: 'python-a-1',
    track: 'python',
    title: 'Filtro por Groupby Transform',
    difficulty: 'Avançado',
    category: 'TRANSFORM',
    description: "No Pandas, filtramos linhas cujo valor é maior que a média do seu grupo. Selecione produtos cujo preço é maior que a média da sua categoria.",
    hint: "Subquery correlacionada: WHERE preco > (SELECT AVG(p2.preco) FROM df p2 WHERE p2.cat = p1.cat).",
    tableSetup: [
      "CREATE TABLE df_prod (nome TEXT, cat TEXT, preco REAL);",
      "INSERT INTO df_prod VALUES ('A', 'TI', 100), ('B', 'TI', 300), ('C', 'RH', 50), ('D', 'RH', 150);"
    ],
    expectedOutput: [
      { nome: 'B', cat: 'TI', preco: 300 },
      { nome: 'D', cat: 'RH', preco: 150 }
    ],
    initialQuery: 'SELECT * FROM df_prod p1'
  }
];
