import { Challenge } from '../types';

export const challenges: Challenge[] = [
  // ==========================================
  // TRILHA: SQL MASTER (25 Desafios)
  // ==========================================
  
  // BÁSICO - SQL
  {
    id: 'sql-b-1',
    track: 'sql',
    rank: 'Junior',
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
    rank: 'Junior',
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
    rank: 'Junior',
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
    rank: 'Junior',
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
    rank: 'Junior',
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
    rank: 'Analyst',
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
    rank: 'Analyst',
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
    rank: 'Analyst',
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
    rank: 'Expert',
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
    rank: 'Expert',
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
    rank: 'Junior',
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
    rank: 'Junior',
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
    rank: 'Analyst',
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
    rank: 'Analyst',
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
    rank: 'Junior',
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
    rank: 'Junior',
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
    rank: 'Analyst',
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
    rank: 'Analyst',
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
    rank: 'Expert',
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
    rank: 'Expert',
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
    rank: 'Expert',
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
  },
  
  // NOVOS DESAFIOS - SQL
  {
    id: 'sql-b-6',
    track: 'sql',
    rank: 'Junior',
    title: 'Intervalo de Datas',
    difficulty: 'Básico',
    category: 'BETWEEN',
    description: 'Selecione todos os pedidos realizados entre 2023-01-01 e 2023-01-31.',
    hint: "WHERE data_pedido BETWEEN '2023-01-01' AND '2023-01-31'",
    tableSetup: [
      "CREATE TABLE pedidos (id INTEGER, data_pedido TEXT, valor REAL);",
      "INSERT INTO pedidos VALUES (1, '2023-01-15', 100), (2, '2023-02-01', 200), (3, '2023-01-20', 150);"
    ],
    expectedOutput: [
      { id: 1, data_pedido: '2023-01-15', valor: 100 },
      { id: 3, data_pedido: '2023-01-20', valor: 150 }
    ],
    initialQuery: 'SELECT * FROM pedidos'
  },
  {
    id: 'sql-i-4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Registros Órfãos',
    difficulty: 'Intermediário',
    category: 'LEFT JOIN',
    description: 'Encontre todos os clientes que NUNCA fizeram um pedido. Liste apenas os nomes.',
    hint: "LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id WHERE pedidos.id IS NULL",
    tableSetup: [
      "CREATE TABLE clientes (id INTEGER, nome TEXT);",
      "CREATE TABLE pedidos (id INTEGER, cliente_id INTEGER);",
      "INSERT INTO clientes VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Carlos');",
      "INSERT INTO pedidos VALUES (101, 1);"
    ],
    expectedOutput: [
      { nome: 'Bob' },
      { nome: 'Carlos' }
    ],
    initialQuery: 'SELECT c.nome FROM clientes c'
  },
  {
    id: 'sql-i-5',
    track: 'sql',
    rank: 'Analyst',
    title: 'Múltiplos Filtros',
    difficulty: 'Intermediário',
    category: 'IN',
    description: "Selecione funcionários dos departamentos 'TI', 'RH' ou 'Financeiro'.",
    hint: "WHERE departamento IN ('TI', 'RH', 'Financeiro')",
    tableSetup: [
      "CREATE TABLE funcionarios (nome TEXT, departamento TEXT);",
      "INSERT INTO funcionarios VALUES ('Ana', 'TI'), ('Beto', 'Vendas'), ('Caio', 'RH'), ('Duda', 'Logística');"
    ],
    expectedOutput: [
      { nome: 'Ana', departamento: 'TI' },
      { nome: 'Caio', departamento: 'RH' }
    ],
    initialQuery: 'SELECT * FROM funcionarios'
  },
  {
    id: 'sql-a-3',
    track: 'sql',
    rank: 'Expert',
    title: 'Common Table Expressions',
    difficulty: 'Avançado',
    category: 'CTE',
    description: 'Use uma CTE para calcular o faturamento total por categoria e então selecione apenas aquelas com faturamento > 1000.',
    hint: "WITH TotalCat AS (SELECT categoria, SUM(valor) as total FROM vendas GROUP BY categoria) SELECT * FROM TotalCat WHERE total > 1000",
    tableSetup: [
      "CREATE TABLE vendas (categoria TEXT, valor REAL);",
      "INSERT INTO vendas VALUES ('Eletrônicos', 1500), ('Livros', 200), ('Casa', 1200), ('Livros', 300);"
    ],
    expectedOutput: [
      { categoria: 'Eletrônicos', total: 1500 },
      { categoria: 'Casa', total: 1200 }
    ],
    initialQuery: 'SELECT * FROM vendas'
  },
  {
    id: 'sql-a-4',
    track: 'sql',
    rank: 'Expert',
    title: 'Limpando Valores Nulos',
    difficulty: 'Avançado',
    category: 'COALESCE',
    description: "Mostre o nome do cliente e seu telefone. Se o telefone for nulo, mostre 'Não Informado'. Nomeie a coluna como `contato`.",
    hint: "COALESCE(telefone, 'Não Informado') as contato",
    tableSetup: [
      "CREATE TABLE contatos (nome TEXT, telefone TEXT);",
      "INSERT INTO contatos VALUES ('Alice', '9999-9999'), ('Bob', NULL), ('Carlos', '8888-8888');"
    ],
    expectedOutput: [
      { nome: 'Alice', contato: '9999-9999' },
      { nome: 'Bob', contato: 'Não Informado' },
      { nome: 'Carlos', contato: '8888-8888' }
    ],
    initialQuery: 'SELECT nome, telefone FROM contatos'
  },

  // NOVOS DESAFIOS - EXCEL
  {
    id: 'excel-b-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Contagem Condicional',
    difficulty: 'Básico',
    category: 'COUNTIF',
    description: "Simule =CONT.SE(). Conte quantos produtos na tabela `estoque` têm preço acima de 100.",
    hint: "No SQL, use COUNT(*) com um filtro WHERE.",
    tableSetup: [
      "CREATE TABLE estoque (produto TEXT, preco REAL);",
      "INSERT INTO estoque VALUES ('Monitor', 500), ('Mouse', 45), ('Teclado', 120), ('Cabo', 15);"
    ],
    expectedOutput: [{ contagem: 2 }],
    initialQuery: 'SELECT COUNT(*) as contagem FROM estoque WHERE preco > 100'
  },
  {
    id: 'excel-i-3',
    track: 'excel',
    rank: 'Analyst',
    title: 'Soma com Critérios',
    difficulty: 'Intermediário',
    category: 'SUMIFS',
    description: "Simule =SOMASES(). Some o faturamento da categoria 'Alimentos' no mês de 'Jan'.",
    hint: "WHERE categoria = 'Alimentos' AND mes = 'Jan'",
    tableSetup: [
      "CREATE TABLE planilha (categoria TEXT, mes TEXT, faturamento REAL);",
      "INSERT INTO planilha VALUES ('Alimentos', 'Jan', 1000), ('Limpeza', 'Jan', 500), ('Alimentos', 'Fev', 800), ('Alimentos', 'Jan', 200);"
    ],
    expectedOutput: [{ total: 1200 }],
    initialQuery: 'SELECT SUM(faturamento) as total FROM planilha'
  },
  {
    id: 'excel-i-4',
    track: 'excel',
    rank: 'Analyst',
    title: 'Concatenar Textos',
    difficulty: 'Intermediário',
    category: 'CONCAT',
    description: "Simule =CONCATENAR() ou & no Excel. Crie uma coluna `nome_completo` unindo `nome` e `sobrenome` com um espaço.",
    hint: "No SQLite usamos o operador || para concatenar: nome || ' ' || sobrenome",
    tableSetup: [
      "CREATE TABLE usuarios (nome TEXT, sobrenome TEXT);",
      "INSERT INTO usuarios VALUES ('Ana', 'Silva'), ('João', 'Pires');"
    ],
    expectedOutput: [
      { nome_completo: 'Ana Silva' },
      { nome_completo: 'João Pires' }
    ],
    initialQuery: 'SELECT nome || sobrenome FROM usuarios'
  },
  {
    id: 'excel-a-3',
    track: 'excel',
    rank: 'Expert',
    title: 'Índice e Corresp',
    difficulty: 'Avançado',
    category: 'INDEX/MATCH',
    description: "Simule =ÍNDICE(CORRESP()). Você tem códigos de produtos e uma tabela de preços. Traga o nome e o preço do código 'P2'.",
    hint: "Novamente, uma busca relacionada é um JOIN ou WHERE.",
    tableSetup: [
      "CREATE TABLE produtos (cod TEXT, nome TEXT);",
      "CREATE TABLE precos (cod_ref TEXT, valor REAL);",
      "INSERT INTO produtos VALUES ('P1', 'Lápis'), ('P2', 'Caneta'), ('P3', 'Borracha');",
      "INSERT INTO precos VALUES ('P1', 2.5), ('P2', 4.0), ('P3', 1.0);"
    ],
    expectedOutput: [{ nome: 'Caneta', valor: 4.0 }],
    initialQuery: "SELECT p.nome, pr.valor FROM produtos p JOIN precos pr ON p.cod = pr.cod_ref WHERE p.cod = 'P2'"
  },
  {
    id: 'excel-a-4',
    track: 'excel',
    rank: 'Expert',
    title: 'Tratamento de Erros',
    difficulty: 'Avançado',
    category: 'IFERROR',
    description: "Simule =SEERRO(). Tente dividir `faturamento` por `vendas`. Se o divisor for zero, mostre 0 como resultado em uma coluna `ticket_medio`.",
    hint: "Use CASE WHEN vendas = 0 THEN 0 ELSE faturamento/vendas END",
    tableSetup: [
      "CREATE TABLE performance (vendedor TEXT, faturamento REAL, vendas INTEGER);",
      "INSERT INTO performance VALUES ('A', 5000, 10), ('B', 0, 0), ('C', 2000, 5);"
    ],
    expectedOutput: [
      { vendedor: 'A', ticket_medio: 500 },
      { vendedor: 'B', ticket_medio: 0 },
      { vendedor: 'C', ticket_medio: 400 }
    ],
    initialQuery: 'SELECT vendedor, faturamento/vendas as ticket_medio FROM performance'
  },

  // NOVOS DESAFIOS - PYTHON
  {
    id: 'python-b-3',
    track: 'python',
    rank: 'Junior',
    title: 'Renomear Colunas',
    difficulty: 'Básico',
    category: 'RENAME',
    description: "Simule `df.rename(columns={'old': 'new'})`. Selecione o ID como `identificador` e Nome como `cliente_nome`.",
    hint: "Use ALIASES (AS) no seu SELECT.",
    tableSetup: [
      "CREATE TABLE raw_users (id INTEGER, nome TEXT);",
      "INSERT INTO raw_users VALUES (1, 'Alice'), (2, 'Bob');"
    ],
    expectedOutput: [
      { identificador: 1, cliente_nome: 'Alice' },
      { identificador: 2, cliente_nome: 'Bob' }
    ],
    initialQuery: 'SELECT id, nome FROM raw_users'
  },
  {
    id: 'python-i-3',
    track: 'python',
    rank: 'Analyst',
    title: 'Agregação Multinível',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df.groupby('cat').agg(['min', 'max'])`. Traga o menor e maior preço por categoria.",
    hint: "SELECT cat, MIN(preco) as min_p, MAX(preco) as max_p ... GROUP BY cat",
    tableSetup: [
      "CREATE TABLE produtos (cat TEXT, preco REAL);",
      "INSERT INTO produtos VALUES ('A', 10), ('A', 50), ('B', 100), ('B', 200);"
    ],
    expectedOutput: [
      { cat: 'A', min_p: 10, max_p: 50 },
      { cat: 'B', min_p: 100, max_p: 200 }
    ],
    initialQuery: 'SELECT cat FROM produtos'
  },
  {
    id: 'python-i-4',
    track: 'python',
    rank: 'Analyst',
    title: 'Remover Duplicatas',
    difficulty: 'Intermediário',
    category: 'DROP_DUPLICATES',
    description: "Simule `df.drop_duplicates()`. Selecione registros únicos de ID e Valor.",
    hint: "Use SELECT DISTINCT.",
    tableSetup: [
      "CREATE TABLE log (user_id INTEGER, action TEXT);",
      "INSERT INTO log VALUES (1, 'Login'), (1, 'Login'), (2, 'Logout');"
    ],
    expectedOutput: [
      { user_id: 1, action: 'Login' },
      { user_id: 2, action: 'Logout' }
    ],
    initialQuery: 'SELECT * FROM log'
  },
  {
    id: 'python-a-2',
    track: 'python',
    rank: 'Expert',
    title: 'Lógica Lambda Complexa',
    difficulty: 'Avançado',
    category: 'LAMBDA',
    description: "Simule `df.apply(lambda x: ...if...else...)`. Classifique a idade em: 'Criança' (<12), 'Jovem' (12-21), 'Adulto' (>21). Coluna `faixa`.",
    hint: "Use um CASE WHEN robusto.",
    tableSetup: [
      "CREATE TABLE idades (nome TEXT, idade INTEGER);",
      "INSERT INTO idades VALUES ('Leo', 10), ('Gui', 19), ('Ana', 35);"
    ],
    expectedOutput: [
      { nome: 'Leo', faixa: 'Criança' },
      { nome: 'Gui', faixa: 'Jovem' },
      { nome: 'Ana', faixa: 'Adulto' }
    ],
    initialQuery: 'SELECT nome FROM idades'
  },
  {
    id: 'python-a-3',
    track: 'python',
    rank: 'Expert',
    title: 'Tabela Pivot (Reshape)',
    difficulty: 'Avançado',
    category: 'PIVOT_TABLE',
    description: "Simule `pd.pivot_table(df, values='v', index='i', columns='c')`. Transforme as vendas em colunas por Ano (2022, 2023).",
    hint: "Pivot no SQL manual usa SUM(CASE WHEN ano=2022 THEN valor ELSE 0 END) as v_2022.",
    tableSetup: [
      "CREATE TABLE faturamento (vendedor TEXT, ano INTEGER, valor REAL);",
      "INSERT INTO faturamento VALUES ('A', 2022, 1000), ('A', 2023, 1500), ('B', 2022, 500), ('B', 2023, 700);"
    ],
    expectedOutput: [
      { vendedor: 'A', v2022: 1000, v2023: 1500 },
      { vendedor: 'B', v2022: 500, v2023: 700 }
    ],
    initialQuery: 'SELECT vendedor FROM faturamento'
  },
  
  // EXPANSÃO SELECT
  {
    id: 'sql-b-s2',
    track: 'sql',
    rank: 'Junior',
    title: 'Cálculo Simples',
    difficulty: 'Básico',
    category: 'SELECT',
    description: 'Selecione o `nome` e o `salario` aumentado em 10% para todos os funcionários. Nomeie como `salario_aumentado`.',
    hint: 'SELECT nome, salario * 1.1 AS salario_aumentado FROM funcionarios',
    tableSetup: [
      "CREATE TABLE funcionarios (nome TEXT, salario REAL);",
      "INSERT INTO funcionarios VALUES ('Carlos', 4500), ('Beatriz', 8200);"
    ],
    expectedOutput: [
      { nome: 'Carlos', salario_aumentado: 4950 },
      { nome: 'Beatriz', salario_aumentado: 9020 }
    ],
    initialQuery: 'SELECT * FROM funcionarios'
  },
  {
    id: 'sql-b-s3',
    track: 'sql',
    rank: 'Junior',
    title: 'Colunas Fixas',
    difficulty: 'Básico',
    category: 'SELECT',
    description: "Selecione o `nome` e uma coluna fixa com o valor 'Ativo' para todos da tabela `leads`. Nomeie como `status`.",
    hint: "SELECT nome, 'Ativo' as status FROM leads",
    tableSetup: [
      "CREATE TABLE leads (nome TEXT);",
      "INSERT INTO leads VALUES ('Jose'), ('Maria');"
    ],
    expectedOutput: [
      { nome: 'Jose', status: 'Ativo' },
      { nome: 'Maria', status: 'Ativo' }
    ],
    initialQuery: 'SELECT * FROM leads'
  },
  {
    id: 'sql-b-s4',
    track: 'sql',
    rank: 'Junior',
    title: 'Visualização de ID',
    difficulty: 'Básico',
    category: 'SELECT',
    description: "Selecione apenas o `id` da tabela `produtos` duplicado em uma nova coluna chamada `backup_id`.",
    hint: "SELECT id, id as backup_id FROM produtos",
    tableSetup: [
      "CREATE TABLE produtos (id INTEGER);",
      "INSERT INTO produtos VALUES (101), (202);"
    ],
    expectedOutput: [{ id: 101, backup_id: 101 }, { id: 202, backup_id: 202 }],
    initialQuery: 'SELECT id FROM produtos'
  },
  {
    id: 'sql-b-s5',
    track: 'sql',
    rank: 'Junior',
    title: 'Resumo de Texto',
    difficulty: 'Básico',
    category: 'SELECT',
    description: "Selecione o `modelo` de carro em letras minúsculas. Use a função LOWER(). Nomeie como `modelo_minusculo`.",
    hint: "SELECT LOWER(modelo) as modelo_minusculo FROM carros",
    tableSetup: [
      "CREATE TABLE carros (modelo TEXT);",
      "INSERT INTO carros VALUES ('FUSCA'), ('GOL');"
    ],
    expectedOutput: [{ modelo_minusculo: 'fusca' }, { modelo_minusculo: 'gol' }],
    initialQuery: 'SELECT modelo FROM carros'
  },

  // EXPANSÃO WHERE
  {
    id: 'sql-b-w2',
    track: 'sql',
    rank: 'Junior',
    title: 'Filtro Alternativo (OR)',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "Selecione os funcionários que são 'Analistas' OU 'Gerentes'.",
    hint: "WHERE cargo = 'Analista' OR cargo = 'Gerente'",
    tableSetup: [
      "CREATE TABLE funcionarios (nome TEXT, cargo TEXT);",
      "INSERT INTO funcionarios VALUES ('Ana', 'Analista'), ('Beto', 'Dev'), ('Caio', 'Gerente');"
    ],
    expectedOutput: [{ nome: 'Ana', cargo: 'Analista' }, { nome: 'Caio', cargo: 'Gerente' }],
    initialQuery: 'SELECT * FROM funcionarios'
  },
  {
    id: 'sql-b-w3',
    track: 'sql',
    rank: 'Junior',
    title: 'Exclusão de Dados',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "Selecione todos os produtos EXCETO os que custam 50.",
    hint: "WHERE preco != 50",
    tableSetup: [
      "CREATE TABLE produtos (nome TEXT, preco REAL);",
      "INSERT INTO produtos VALUES ('Mouse', 50), ('Teclado', 150), ('Cabo', 20);"
    ],
    expectedOutput: [{ nome: 'Teclado', preco: 150 }, { nome: 'Cabo', preco: 20 }],
    initialQuery: 'SELECT * FROM produtos'
  },
  {
    id: 'sql-b-w4',
    track: 'sql',
    rank: 'Junior',
    title: 'Filtro por ID Específico',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "Selecione o funcionário cujo `id` é exatamente 7.",
    hint: "WHERE id = 7",
    tableSetup: [
      "CREATE TABLE emp (id INTEGER, nome TEXT);",
      "INSERT INTO emp VALUES (1, 'A'), (7, 'Alvo'), (10, 'B');"
    ],
    expectedOutput: [{ id: 7, nome: 'Alvo' }],
    initialQuery: 'SELECT * FROM emp'
  },
  {
    id: 'sql-b-w5',
    track: 'sql',
    rank: 'Junior',
    title: 'Lógica Combinada',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "Selecione produtos que custam menos de 100 E têm mais de 10 unidades no estoque.",
    hint: "WHERE preco < 100 AND estoque > 10",
    tableSetup: [
      "CREATE TABLE prod (nome TEXT, preco REAL, estoque INTEGER);",
      "INSERT INTO prod VALUES ('A', 50, 20), ('B', 150, 30), ('C', 20, 5);"
    ],
    expectedOutput: [{ nome: 'A', preco: 50, estoque: 20 }],
    initialQuery: 'SELECT * FROM prod'
  },

  // EXPANSÃO JOIN
  {
    id: 'sql-i-j1',
    track: 'sql',
    rank: 'Analyst',
    title: 'Vendas e Produtos',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Traga o `id_venda` e o `nome_produto`. Una `vendas` e `produtos` pela chave `prod_id`.",
    hint: "JOIN produtos ON vendas.prod_id = produtos.id",
    tableSetup: [
      "CREATE TABLE vendas (id_venda INTEGER, prod_id INTEGER);",
      "CREATE TABLE produtos (id INTEGER, nome_produto TEXT);",
      "INSERT INTO vendas VALUES (1, 10), (2, 20);",
      "INSERT INTO produtos VALUES (10, 'Celular'), (20, 'Tablet');"
    ],
    expectedOutput: [{ id_venda: 1, nome_produto: 'Celular' }, { id_venda: 2, nome_produto: 'Tablet' }],
    initialQuery: 'SELECT v.id_venda, p.nome_produto FROM vendas v'
  },
  {
    id: 'sql-i-j2',
    track: 'sql',
    rank: 'Analyst',
    title: 'Departamentos da Equipe',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Relacione o `nome` do funcionário com o `nome_depto` da tabela `deptos`.",
    hint: "INNER JOIN deptos ON emp.depto_id = deptos.id",
    tableSetup: [
      "CREATE TABLE emp (nome TEXT, depto_id INTEGER);",
      "CREATE TABLE deptos (id INTEGER, nome_depto TEXT);",
      "INSERT INTO emp VALUES ('Ana', 1), ('Bob', 2);",
      "INSERT INTO deptos VALUES (1, 'TI'), (2, 'RH');"
    ],
    expectedOutput: [{ nome: 'Ana', nome_depto: 'TI' }, { nome: 'Bob', nome_depto: 'RH' }],
    initialQuery: 'SELECT * FROM emp'
  },
  {
    id: 'sql-i-j3',
    track: 'sql',
    rank: 'Analyst',
    title: 'Pedidos Detalhados',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Selecione o `id_pedido` e o `valor` total, unindo `pedidos` com `precos_itens`.",
    hint: "JOIN precos_itens ON pedidos.item_id = precos_itens.id",
    tableSetup: [
      "CREATE TABLE pedidos (id_pedido INTEGER, item_id INTEGER);",
      "CREATE TABLE precos_itens (id INTEGER, valor REAL);",
      "INSERT INTO pedidos VALUES (50, 1), (51, 2);",
      "INSERT INTO precos_itens VALUES (1, 100.50), (2, 250.00);"
    ],
    expectedOutput: [{ id_pedido: 50, valor: 100.50 }, { id_pedido: 51, valor: 250.00 }],
    initialQuery: 'SELECT * FROM pedidos'
  },
  {
    id: 'sql-i-j4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Cruzamento Triplo',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Traga o `nome` do aluno, o `nome_curso` e a `nota`. Una `alunos`, `matriculas` e `cursos`.",
    hint: "JOIN matriculas ON alunos.id = matriculas.aluno_id JOIN cursos ON matriculas.curso_id = cursos.id",
    tableSetup: [
      "CREATE TABLE alunos (id INTEGER, nome TEXT);",
      "CREATE TABLE matriculas (aluno_id INTEGER, curso_id INTEGER, nota REAL);",
      "CREATE TABLE cursos (id INTEGER, nome_curso TEXT);",
      "INSERT INTO alunos VALUES (1, 'Luiz');",
      "INSERT INTO matriculas VALUES (1, 10, 9.5);",
      "INSERT INTO cursos VALUES (10, 'SQL Avançado');"
    ],
    expectedOutput: [{ nome: 'Luiz', nome_curso: 'SQL Avançado', nota: 9.5 }],
    initialQuery: 'SELECT a.nome, c.nome_curso, m.nota FROM alunos a'
  },

  // EXPANSÃO GROUP BY
  {
    id: 'sql-i-g3',
    track: 'sql',
    rank: 'Analyst',
    title: 'Média por Setor',
    difficulty: 'Intermediário',
    category: 'GROUP BY',
    description: "Agrupe pela coluna `setor` e calcule a média de `produtividade`. Nomeie como `media_prod`.",
    hint: "GROUP BY setor",
    tableSetup: [
      "CREATE TABLE industria (vendedor TEXT, setor TEXT, produtividade REAL);",
      "INSERT INTO industria VALUES ('A', 'Oeste', 80), ('B', 'Leste', 90), ('C', 'Oeste', 70);"
    ],
    expectedOutput: [
      { setor: 'Leste', media_prod: 90 },
      { setor: 'Oeste', media_prod: 75 }
    ],
    initialQuery: 'SELECT setor, AVG(produtividade) as media_prod FROM industria'
  },
  {
    id: 'sql-i-g4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Contagem de Clientes',
    difficulty: 'Intermediário',
    category: 'GROUP BY',
    description: "Conte quantos clientes existem em cada `cidade`.",
    hint: "SELECT cidade, COUNT(*) as total FROM clientes GROUP BY cidade",
    tableSetup: [
      "CREATE TABLE clientes (id INTEGER, cidade TEXT);",
      "INSERT INTO clientes VALUES (1, 'SP'), (2, 'RJ'), (3, 'SP');"
    ],
    expectedOutput: [{ cidade: 'RJ', total: 1 }, { cidade: 'SP', total: 2 }],
    initialQuery: 'SELECT cidade, COUNT(*) as total FROM clientes GROUP BY cidade'
  },
  {
    id: 'sql-i-g5',
    track: 'sql',
    rank: 'Analyst',
    title: 'Estoque por Categoria',
    difficulty: 'Intermediário',
    category: 'GROUP BY',
    description: "Some a `quantidade` em estoque agrupando por `categoria`.",
    hint: "GROUP BY categoria",
    tableSetup: [
      "CREATE TABLE stock (item TEXT, categoria TEXT, quantidade INTEGER);",
      "INSERT INTO stock VALUES ('Pá', 'Obra', 10), ('Cimento', 'Obra', 50), ('Tinta', 'Pintura', 5);"
    ],
    expectedOutput: [{ categoria: 'Obra', total: 60 }, { categoria: 'Pintura', total: 5 }],
    initialQuery: 'SELECT categoria, SUM(quantidade) as total FROM stock'
  },

  // EXPANSÃO ORDER BY
  {
    id: 'sql-b-o2',
    track: 'sql',
    rank: 'Junior',
    title: 'Z para A',
    difficulty: 'Básico',
    category: 'ORDER BY',
    description: "Selecione todos os nomes de funcionários em ordem decrescente (Z para A).",
    hint: "ORDER BY nome DESC",
    tableSetup: [
      "CREATE TABLE emp (nome TEXT);",
      "INSERT INTO emp VALUES ('Ana'), ('Zara'), ('Bob');"
    ],
    expectedOutput: [{ nome: 'Zara' }, { nome: 'Bob' }, { nome: 'Ana' }],
    initialQuery: 'SELECT * FROM emp',
    orderSensitive: true
  },
  {
    id: 'sql-b-o3',
    track: 'sql',
    rank: 'Junior',
    title: 'Mais Caros Primeiro',
    difficulty: 'Básico',
    category: 'ORDER BY',
    description: "Traga os produtos ordenados pelo preço do maior para o menor.",
    hint: "ORDER BY preco DESC",
    tableSetup: [
      "CREATE TABLE prod (nome TEXT, preco REAL);",
      "INSERT INTO prod VALUES ('A', 10), ('B', 500), ('C', 50);"
    ],
    expectedOutput: [{ nome: 'B', preco: 500 }, { nome: 'C', preco: 50 }, { nome: 'A', preco: 10 }],
    initialQuery: 'SELECT * FROM prod',
    orderSensitive: true
  },
  {
    id: 'sql-b-o4',
    track: 'sql',
    rank: 'Junior',
    title: 'Ordenação Alfabética',
    difficulty: 'Básico',
    category: 'ORDER BY',
    description: "Liste as cidades da tabela `clientes` em ordem alfabética.",
    hint: "ORDER BY cidade ASC",
    tableSetup: [
      "CREATE TABLE clientes (cidade TEXT);",
      "INSERT INTO clientes VALUES ('Rio'), ('Sampa'), ('Belo');"
    ],
    expectedOutput: [{ cidade: 'Belo' }, { cidade: 'Rio' }, { cidade: 'Sampa' }],
    initialQuery: 'SELECT * FROM clientes',
    orderSensitive: true
  },
  {
    id: 'sql-b-o5',
    track: 'sql',
    rank: 'Junior',
    title: 'Data mais Recente',
    difficulty: 'Básico',
    category: 'ORDER BY',
    description: "Selecione os logs e ordene-os pela `data` da mais recente para a mais antiga.",
    hint: "ORDER BY data DESC",
    tableSetup: [
      "CREATE TABLE logs (msg TEXT, data TEXT);",
      "INSERT INTO logs VALUES ('Err', '2023-01-01'), ('Ok', '2023-01-05');"
    ],
    expectedOutput: [{ msg: 'Ok', data: '2023-01-05' }, { msg: 'Err', data: '2023-01-01' }],
    initialQuery: 'SELECT * FROM logs',
    orderSensitive: true
  },

  // EXPANSÃO EXCEL SOMA
  {
    id: 'excel-b-s1',
    track: 'excel',
    rank: 'Junior',
    title: 'Soma de Pontos',
    difficulty: 'Básico',
    category: 'SOMA',
    description: "Calcule a soma de todos os `pontos` registrados na tabela de `jogadores`.",
    hint: "SUM(pontos)",
    tableSetup: [
      "CREATE TABLE jogadores (nome TEXT, pontos INTEGER);",
      "INSERT INTO jogadores VALUES ('A', 100), ('B', 200), ('C', 150);"
    ],
    expectedOutput: [{ total: 450 }],
    initialQuery: 'SELECT SUM(pontos) as total FROM jogadores'
  },
  {
    id: 'excel-b-s2',
    track: 'excel',
    rank: 'Junior',
    title: 'Gasto Mensal',
    difficulty: 'Básico',
    category: 'SOMA',
    description: "Some todos os `valores` da tabela `despesas`.",
    hint: "SUM(valores)",
    tableSetup: [
      "CREATE TABLE despesas (id INTEGER, valores REAL);",
      "INSERT INTO despesas VALUES (1, 50.25), (2, 30.00), (3, 20.75);"
    ],
    expectedOutput: [{ total: 101.0 }],
    initialQuery: 'SELECT SUM(valores) as total FROM despesas'
  },
  {
    id: 'excel-b-s3',
    track: 'excel',
    rank: 'Junior',
    title: 'Total de Inscritos',
    difficulty: 'Básico',
    category: 'SOMA',
    description: "Calcule o total de inscrições somando a coluna `quantidade`.",
    hint: "SUM(quantidade)",
    tableSetup: [
      "CREATE TABLE inscritos (curso TEXT, quantidade INTEGER);",
      "INSERT INTO inscritos VALUES ('Excel', 150), ('Python', 80);"
    ],
    expectedOutput: [{ total: 230 }],
    initialQuery: 'SELECT SUM(quantidade) as total FROM inscritos'
  },
  {
    id: 'excel-b-s4',
    track: 'excel',
    rank: 'Junior',
    title: 'Soma de IDs (Fictício)',
    difficulty: 'Básico',
    category: 'SOMA',
    description: "Calcule a soma numérica de todos os IDs na tabela para fins de validação de checksum.",
    hint: "SUM(id)",
    tableSetup: [
      "CREATE TABLE check (id INTEGER);",
      "INSERT INTO check VALUES (1), (2), (3), (4), (5);"
    ],
    expectedOutput: [{ total: 15 }],
    initialQuery: 'SELECT SUM(id) as total FROM check'
  },

  // EXPANSÃO EXCEL VLOOKUP (JOIN)
  {
    id: 'excel-i-v2',
    track: 'excel',
    rank: 'Analyst',
    title: 'Buscar Preço Unitário',
    difficulty: 'Intermediário',
    category: 'VLOOKUP',
    description: "Simule =PROCV(). Una a tabela `VENDAS` com a `PRODUTOS` para trazer o faturamento (quantidade * preco).",
    hint: "JOIN produtos ON vendas.item_id = produtos.id",
    tableSetup: [
      "CREATE TABLE vendas (item_id INTEGER, qtd INTEGER);",
      "CREATE TABLE produtos (id INTEGER, preco REAL);",
      "INSERT INTO vendas VALUES (1, 5);",
      "INSERT INTO produtos VALUES (1, 10.0);"
    ],
    expectedOutput: [{ total: 50.0 }],
    initialQuery: 'SELECT v.qtd * p.preco as total FROM vendas v'
  },
  {
    id: 'excel-i-v3',
    track: 'excel',
    rank: 'Analyst',
    title: 'VLOOKUP Alunos',
    difficulty: 'Intermediário',
    category: 'VLOOKUP',
    description: "Relacione o `id_aluno` da tabela `presenca` com a tabela `cadastro` para trazer o `nome` do aluno.",
    hint: "JOIN cadastro ON presenca.id_aluno = cadastro.id",
    tableSetup: [
      "CREATE TABLE presenca (id_aluno INTEGER);",
      "CREATE TABLE cadastro (id INTEGER, nome TEXT);",
      "INSERT INTO presenca VALUES (101);",
      "INSERT INTO cadastro VALUES (101, 'Marcos');"
    ],
    expectedOutput: [{ nome: 'Marcos' }],
    initialQuery: 'SELECT * FROM presenca p'
  },
  {
    id: 'excel-i-v4',
    track: 'excel',
    rank: 'Analyst',
    title: 'VLOOKUP Descrição',
    difficulty: 'Intermediário',
    category: 'VLOOKUP',
    description: "Traga o `nome` e a `descricao` do produto usando um JOIN (como se fosse PROCV em outra aba).",
    hint: "JOIN descricoes ON produtos.cod = descricoes.cod_ref",
    tableSetup: [
      "CREATE TABLE produtos (cod TEXT, nome TEXT);",
      "CREATE TABLE descricoes (cod_ref TEXT, descricao TEXT);",
      "INSERT INTO produtos VALUES ('P1', 'Monitor');",
      "INSERT INTO descricoes VALUES ('P1', '24 polegadas 4K');"
    ],
    expectedOutput: [{ nome: 'Monitor', descricao: '24 polegadas 4K' }],
    initialQuery: 'SELECT * FROM produtos p'
  },
  {
    id: 'excel-i-v5',
    track: 'excel',
    rank: 'Analyst',
    title: 'PROCV no RH',
    difficulty: 'Intermediário',
    category: 'VLOOKUP',
    description: "Você tem a lista de CPFs e uma tabela de Dados. Traga o `salario` do funcionário do CPF 123.",
    hint: "WHERE cpf = 123",
    tableSetup: [
      "CREATE TABLE rh (cpf INTEGER, salario REAL);",
      "INSERT INTO rh VALUES (123, 5000), (456, 3000);"
    ],
    expectedOutput: [{ salario: 5000 }],
    initialQuery: 'SELECT salario FROM rh'
  },

  // EXPANSÃO PYTHON FILTER
  {
    id: 'python-b-f2',
    track: 'python',
    rank: 'Junior',
    title: 'Filtro por Categoria',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[df['cat'] == 'A']`. Filtre todos os itens da categoria 'A'.",
    hint: "WHERE cat = 'A'",
    tableSetup: [
      "CREATE TABLE df (item TEXT, cat TEXT);",
      "INSERT INTO df VALUES ('Caneta', 'A'), ('Borracha', 'B'), ('Lápis', 'A');"
    ],
    expectedOutput: [{ item: 'Caneta', cat: 'A' }, { item: 'Lápis', cat: 'A' }],
    initialQuery: 'SELECT * FROM df'
  },
  {
    id: 'python-b-f3',
    track: 'python',
    rank: 'Junior',
    title: 'Filtro String Contém',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[df['nome'].str.contains('Silva')]`. Use LIKE '%Silva%'.",
    hint: "WHERE nome LIKE '%Silva%'",
    tableSetup: [
      "CREATE TABLE usuarios (nome TEXT);",
      "INSERT INTO usuarios VALUES ('Ana Silva'), ('João Pires'), ('Maria Silva');"
    ],
    expectedOutput: [{ nome: 'Ana Silva' }, { nome: 'Maria Silva' }],
    initialQuery: 'SELECT * FROM usuarios'
  },
  {
    id: 'python-b-f4',
    track: 'python',
    rank: 'Junior',
    title: 'Filtro Múltiplos AND',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[(df['val'] > 10) & (df['val'] < 20)]`. Traga os valores entre 10 e 20.",
    hint: "WHERE val > 10 AND val < 20",
    tableSetup: [
      "CREATE TABLE numeros (val INTEGER);",
      "INSERT INTO numeros VALUES (5), (15), (25);"
    ],
    expectedOutput: [{ val: 15 }],
    initialQuery: 'SELECT * FROM numeros'
  },
  {
    id: 'python-b-f5',
    track: 'python',
    rank: 'Junior',
    title: 'Filtro ISIN',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[df['sigla'].isin(['SP', 'RJ'])]`. Filtre as siglas SP e RJ.",
    hint: "WHERE sigla IN ('SP', 'RJ')",
    tableSetup: [
      "CREATE TABLE estados (sigla TEXT);",
      "INSERT INTO estados VALUES ('SP'), ('MG'), ('RJ'), ('BA');"
    ],
    expectedOutput: [{ sigla: 'SP' }, { sigla: 'RJ' }],
    initialQuery: 'SELECT * FROM estados'
  },
  
  // EXPANSÃO LIKE
  {
    id: 'sql-b-l2',
    track: 'sql',
    rank: 'Junior',
    title: 'Termina com',
    difficulty: 'Básico',
    category: 'LIKE',
    description: "Selecione os clientes cujo nome termina com a letra 'o'.",
    hint: "WHERE nome LIKE '%o'",
    tableSetup: [
      "CREATE TABLE clientes (nome TEXT);",
      "INSERT INTO clientes VALUES ('Carlos'), ('Beto'), ('Ana'), ('Marina');"
    ],
    expectedOutput: [{ nome: 'Carlos' }, { nome: 'Beto' }],
    initialQuery: 'SELECT * FROM clientes'
  },
  {
    id: 'sql-b-l3',
    track: 'sql',
    rank: 'Junior',
    title: 'Contém Texto',
    difficulty: 'Básico',
    category: 'LIKE',
    description: "Busque produtos que tenham a palavra 'Pro' em qualquer parte do nome.",
    hint: "WHERE nome LIKE '%Pro%'",
    tableSetup: [
      "CREATE TABLE prod (nome TEXT);",
      "INSERT INTO prod VALUES ('iPhone 15 Pro'), ('MacBook Air'), ('iPad Pro'), ('Mouse');"
    ],
    expectedOutput: [{ nome: 'iPhone 15 Pro' }, { nome: 'iPad Pro' }],
    initialQuery: 'SELECT * FROM prod'
  },
  {
    id: 'sql-b-l4',
    track: 'sql',
    rank: 'Junior',
    title: 'Tamanho Fixo',
    difficulty: 'Básico',
    category: 'LIKE',
    description: "Busque códigos de 4 letras que começam com 'A'.",
    hint: "WHERE cod LIKE 'A___' (três underscores)",
    tableSetup: [
      "CREATE TABLE codes (cod TEXT);",
      "INSERT INTO codes VALUES ('A123'), ('A1'), ('B123'), ('A999');"
    ],
    expectedOutput: [{ cod: 'A123' }, { cod: 'A999' }],
    initialQuery: 'SELECT * FROM codes'
  },
  {
    id: 'sql-b-l5',
    track: 'sql',
    rank: 'Junior',
    title: 'Busca Negativa',
    difficulty: 'Básico',
    category: 'LIKE',
    description: "Selecione nomes que NÃO contêm a letra 'e'.",
    hint: "WHERE nome NOT LIKE '%e%'",
    tableSetup: [
      "CREATE TABLE names (nome TEXT);",
      "INSERT INTO names VALUES ('Ana'), ('Beto'), ('Caio'), ('Luís');"
    ],
    expectedOutput: [{ nome: 'Ana' }, { nome: 'Caio' }, { nome: 'Luís' }],
    initialQuery: 'SELECT * FROM names'
  },

  // EXPANSÃO DISTINCT
  {
    id: 'sql-b-d2',
    track: 'sql',
    rank: 'Junior',
    title: 'Categorias Únicas',
    difficulty: 'Básico',
    category: 'DISTINCT',
    description: "Liste todas as categorias únicas de produtos.",
    hint: "SELECT DISTINCT categoria FROM produtos",
    tableSetup: [
      "CREATE TABLE produtos (nome TEXT, categoria TEXT);",
      "INSERT INTO produtos VALUES ('A', 'TI'), ('B', 'Home'), ('C', 'TI');"
    ],
    expectedOutput: [{ categoria: 'Home' }, { categoria: 'TI' }],
    initialQuery: 'SELECT categoria FROM produtos'
  },
  {
    id: 'sql-b-d3',
    track: 'sql',
    rank: 'Junior',
    title: 'Anos de Venda',
    difficulty: 'Básico',
    category: 'DISTINCT',
    description: "Quais foram os anos únicos em que ocorreram vendas?",
    hint: "SELECT DISTINCT ano FROM vendas",
    tableSetup: [
      "CREATE TABLE vendas (id INTEGER, ano INTEGER);",
      "INSERT INTO vendas VALUES (1, 2022), (2, 2022), (3, 2023);"
    ],
    expectedOutput: [{ ano: 2022 }, { ano: 2023 }],
    initialQuery: 'SELECT ano FROM vendas'
  },
  {
    id: 'sql-b-d4',
    track: 'sql',
    rank: 'Junior',
    title: 'Cidades Atendidas',
    difficulty: 'Básico',
    category: 'DISTINCT',
    description: "Liste as cidades onde temos filiais, sem repetir.",
    hint: "SELECT DISTINCT cidade FROM filiais",
    tableSetup: [
      "CREATE TABLE filiais (id INTEGER, cidade TEXT);",
      "INSERT INTO filiais VALUES (1, 'SP'), (2, 'SP'), (3, 'RJ');"
    ],
    expectedOutput: [{ cidade: 'RJ' }, { cidade: 'SP' }],
    initialQuery: 'SELECT cidade FROM filiais'
  },
  {
    id: 'sql-b-d5',
    track: 'sql',
    rank: 'Junior',
    title: 'Citações de Fornecedores',
    difficulty: 'Básico',
    category: 'DISTINCT',
    description: "Quais são os IDs de fornecedores únicos na tabela de estoque?",
    hint: "SELECT DISTINCT fornecedor_id FROM estoque",
    tableSetup: [
      "CREATE TABLE estoque (item TEXT, fornecedor_id INTEGER);",
      "INSERT INTO estoque VALUES ('A', 10), ('B', 20), ('C', 10);"
    ],
    expectedOutput: [{ fornecedor_id: 10 }, { fornecedor_id: 20 }],
    initialQuery: 'SELECT fornecedor_id FROM estoque'
  },

  // EXPANSÃO CASE (SQL)
  {
    id: 'sql-a-c2',
    track: 'sql',
    rank: 'Expert',
    title: 'Faixa Etária',
    difficulty: 'Avançado',
    category: 'CASE',
    description: "Crie uma coluna `faixa` que diga 'Sênior' se idade >= 60, senão 'Comum'.",
    hint: "CASE WHEN idade >= 60 THEN 'Sênior' ELSE 'Comum' END",
    tableSetup: [
      "CREATE TABLE pessoas (nome TEXT, idade INTEGER);",
      "INSERT INTO pessoas VALUES ('Hugo', 65), ('Leo', 20);"
    ],
    expectedOutput: [{ nome: 'Hugo', faixa: 'Sênior' }, { nome: 'Leo', faixa: 'Comum' }],
    initialQuery: 'SELECT nome FROM pessoas'
  },
  {
    id: 'sql-a-c3',
    track: 'sql',
    rank: 'Expert',
    title: 'Farol de Performance',
    difficulty: 'Avançado',
    category: 'CASE',
    description: "Farol de Vendas: > 1000 'Verde', > 500 'Amarelo', senão 'Vermelho'. Coluna `farol`.",
    hint: "CASE WHEN ... THEN ... WHEN ... THEN ... ELSE ... END",
    tableSetup: [
      "CREATE TABLE metas (vendedor TEXT, vendas REAL);",
      "INSERT INTO metas VALUES ('A', 1200), ('B', 700), ('C', 200);"
    ],
    expectedOutput: [
      { vendedor: 'A', farol: 'Verde' },
      { vendedor: 'B', farol: 'Amarelo' },
      { vendedor: 'C', farol: 'Vermelho' }
    ],
    initialQuery: 'SELECT vendedor FROM metas'
  },
  {
    id: 'sql-a-c4',
    track: 'sql',
    rank: 'Expert',
    title: 'Tradução de Status',
    difficulty: 'Avançado',
    category: 'CASE',
    description: "Traduza o código de status: 1 -> 'Aberto', 2 -> 'Pendente', 3 -> 'Fechado'. Coluna `texto_status`.",
    hint: "CASE status WHEN 1 THEN 'Aberto' ...",
    tableSetup: [
      "CREATE TABLE chamados (id INTEGER, status INTEGER);",
      "INSERT INTO chamados VALUES (10, 1), (11, 2), (12, 3);"
    ],
    expectedOutput: [
      { id: 10, texto_status: 'Aberto' },
      { id: 11, texto_status: 'Pendente' },
      { id: 12, texto_status: 'Fechado' }
    ],
    initialQuery: 'SELECT id FROM chamados'
  },

  // EXPANSÃO EXCEL AVERAGE
  {
    id: 'excel-b-av2',
    track: 'excel',
    rank: 'Junior',
    title: 'Média de Vendas',
    difficulty: 'Básico',
    category: 'AVERAGE',
    description: "Simule =MÉDIA(). Calcule a média de vendas diárias.",
    hint: "AVG(vendas)",
    tableSetup: [
      "CREATE TABLE diario (data TEXT, vendas REAL);",
      "INSERT INTO diario VALUES ('Seg', 1000), ('Ter', 1500), ('Qua', 1100);"
    ],
    expectedOutput: [{ media: 1200.0 }],
    initialQuery: 'SELECT AVG(vendas) as media FROM diario'
  },
  {
    id: 'excel-b-av3',
    track: 'excel',
    rank: 'Junior',
    title: 'Média de Idade',
    difficulty: 'Básico',
    category: 'AVERAGE',
    description: "Calcule a média de idade dos alunos matriculados.",
    hint: "AVG(idade)",
    tableSetup: [
      "CREATE TABLE alunos (nome TEXT, idade INTEGER);",
      "INSERT INTO alunos VALUES ('A', 20), ('B', 30), ('C', 25);"
    ],
    expectedOutput: [{ media: 25.0 }],
    initialQuery: 'SELECT AVG(idade) as media FROM alunos'
  },
  {
    id: 'excel-b-av4',
    track: 'excel',
    rank: 'Junior',
    title: 'Preço Médio Unitário',
    difficulty: 'Básico',
    category: 'AVERAGE',
    description: "Qual o preço médio dos itens no catálogo?",
    hint: "AVG(preco)",
    tableSetup: [
      "CREATE TABLE catalogo (item TEXT, preco REAL);",
      "INSERT INTO catalogo VALUES ('A', 10.50), ('B', 19.50);"
    ],
    expectedOutput: [{ preco_medio: 15.0 }],
    initialQuery: 'SELECT AVG(preco) as preco_medio FROM catalogo'
  },
  {
    id: 'excel-b-av5',
    track: 'excel',
    rank: 'Junior',
    title: 'Média de Acessos',
    difficulty: 'Básico',
    category: 'AVERAGE',
    description: "Determine a média de acessos ao site por usuário.",
    hint: "AVG(acessos)",
    tableSetup: [
      "CREATE TABLE logs (user TEXT, acessos INTEGER);",
      "INSERT INTO logs VALUES ('X', 5), ('Y', 15);"
    ],
    expectedOutput: [{ media: 10.0 }],
    initialQuery: 'SELECT AVG(acessos) as media FROM logs'
  },

  // EXPANSÃO EXCEL COUNTIF (WHERE COUNT)
  {
    id: 'excel-b-cf2',
    track: 'excel',
    rank: 'Junior',
    title: 'Contagem de Aprovados',
    difficulty: 'Básico',
    category: 'COUNTIF',
    description: "Simule =CONT.SE(). Conte quantos alunos tiraram nota >= 7.",
    hint: "WHERE nota >= 7",
    tableSetup: [
      "CREATE TABLE boletim (aluno TEXT, nota REAL);",
      "INSERT INTO boletim VALUES ('A', 8.5), ('B', 6.0), ('C', 9.0);"
    ],
    expectedOutput: [{ total: 2 }],
    initialQuery: 'SELECT COUNT(*) as total FROM boletim WHERE nota >= 7'
  },
  {
    id: 'excel-b-cf3',
    track: 'excel',
    rank: 'Junior',
    title: 'Contar Devs',
    difficulty: 'Básico',
    category: 'COUNTIF',
    description: "Conte quantos funcionários têm o cargo 'Dev'.",
    hint: "WHERE cargo = 'Dev'",
    tableSetup: [
      "CREATE TABLE equipe (nome TEXT, cargo TEXT);",
      "INSERT INTO equipe VALUES ('A', 'Dev'), ('B', 'Dev'), ('C', 'Design');"
    ],
    expectedOutput: [{ total: 2 }],
    initialQuery: "SELECT COUNT(*) as total FROM equipe WHERE cargo = 'Dev'"
  },
  {
    id: 'excel-b-cf4',
    track: 'excel',
    rank: 'Junior',
    title: 'Itens em Falta',
    difficulty: 'Básico',
    category: 'COUNTIF',
    description: "Conte quantos itens no estoque têm quantidade igual a 0.",
    hint: "WHERE qtd = 0",
    tableSetup: [
      "CREATE TABLE stock (item TEXT, qtd INTEGER);",
      "INSERT INTO stock VALUES ('Pá', 5), ('Cimento', 0), ('Pincel', 0);"
    ],
    expectedOutput: [{ total: 2 }],
    initialQuery: 'SELECT COUNT(*) as total FROM stock WHERE qtd = 0'
  },
  {
    id: 'excel-b-cf5',
    track: 'excel',
    rank: 'Junior',
    title: 'Check de Presença',
    difficulty: 'Básico',
    category: 'COUNTIF',
    description: "Conte quantos registros têm o status 'Presente'.",
    hint: "WHERE status = 'Presente'",
    tableSetup: [
      "CREATE TABLE chamada (nome TEXT, status TEXT);",
      "INSERT INTO chamada VALUES ('Ana', 'Presente'), ('Beto', 'Falta'), ('Caio', 'Presente');"
    ],
    expectedOutput: [{ total: 2 }],
    initialQuery: "SELECT COUNT(*) as total FROM chamada WHERE status = 'Presente'"
  },

  // EXPANSÃO PYTHON CLEANING
  {
    id: 'python-i-c2',
    track: 'python',
    rank: 'Analyst',
    title: 'Remover Espaços',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df['col'].str.strip()`. Remova espaços no início e fim.",
    hint: "TRIM(coluna)",
    tableSetup: [
      "CREATE TABLE df (txt TEXT);",
      "INSERT INTO df VALUES ('  sql  '), ('  python  ');"
    ],
    expectedOutput: [{ limpo: 'sql' }, { limpo: 'python' }],
    initialQuery: 'SELECT TRIM(txt) as limpo FROM df'
  },
  {
    id: 'python-i-c3',
    track: 'python',
    rank: 'Analyst',
    title: 'Substituição de Texto',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df['col'].str.replace('old', 'new')`. Troque '_' por ' ' na coluna `label`.",
    hint: "REPLACE(label, '_', ' ')",
    tableSetup: [
      "CREATE TABLE labels (id INTEGER, label TEXT);",
      "INSERT INTO labels VALUES (1, 'Data_Science'), (2, 'Big_Data');"
    ],
    expectedOutput: [{ label_new: 'Data Science' }, { label_new: 'Big Data' }],
    initialQuery: "SELECT REPLACE(label, '_', ' ') as label_new FROM labels"
  },
  {
    id: 'python-i-c4',
    track: 'python',
    rank: 'Analyst',
    title: 'Formatação de Moeda',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Adicione o prefixo 'R$ ' ao preço numérico. Simule formatação de string.",
    hint: "'R$ ' || CAST(preco AS TEXT)",
    tableSetup: [
      "CREATE TABLE precos (item TEXT, preco REAL);",
      "INSERT INTO precos VALUES ('A', 10.5);"
    ],
    expectedOutput: [{ preco_format: 'R$ 10.5' }],
    initialQuery: "SELECT 'R$ ' || preco as preco_format FROM precos"
  },
  {
    id: 'python-i-c5',
    track: 'python',
    rank: 'Analyst',
    title: 'Iniciais Maiúsculas',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df['nome'].str.title()`. (No SQL usaremos UPPER na primeira letra - simplificado: apenas UPPER em tudo).",
    hint: "UPPER(nome)",
    tableSetup: [
      "CREATE TABLE nomes (nome TEXT);",
      "INSERT INTO nomes VALUES ('ana'), ('bob');"
    ],
    expectedOutput: [{ nome: 'ANA' }, { nome: 'BOB' }],
    initialQuery: 'SELECT UPPER(nome) as nome FROM nomes'
  },

  // EXPANSÃO SUMIFS
  {
    id: 'excel-i-s2',
    track: 'excel',
    rank: 'Analyst',
    title: 'Soma por Região',
    difficulty: 'Intermediário',
    category: 'SUMIFS',
    description: "Simule =SOMASES(). Some as vendas onde regiao = 'Sul' e status = 'Pago'.",
    hint: "WHERE regiao = 'Sul' AND status = 'Pago'",
    tableSetup: [
      "CREATE TABLE vendas (id INTEGER, regiao TEXT, status TEXT, valor REAL);",
      "INSERT INTO vendas VALUES (1, 'Sul', 'Pago', 100), (2, 'Norte', 'Pago', 200), (3, 'Sul', 'Pendente', 50), (4, 'Sul', 'Pago', 150);"
    ],
    expectedOutput: [{ total: 250.0 }],
    initialQuery: 'SELECT SUM(valor) as total FROM vendas'
  },
  {
    id: 'excel-i-s3',
    track: 'excel',
    rank: 'Analyst',
    title: 'Gasto por Categoria',
    difficulty: 'Intermediário',
    category: 'SUMIFS',
    description: "Some o gasto onde categoria = 'Viagem' e ano = 2023.",
    hint: "WHERE categoria = 'Viagem' AND ano = 2023",
    tableSetup: [
      "CREATE TABLE gastos (valor REAL, categoria TEXT, ano INTEGER);",
      "INSERT INTO gastos VALUES (500, 'Viagem', 2023), (200, 'Aluguel', 2023), (300, 'Viagem', 2023), (100, 'Viagem', 2022);"
    ],
    expectedOutput: [{ total: 800.0 }],
    initialQuery: 'SELECT SUM(valor) as total FROM gastos'
  },
  {
    id: 'excel-i-s4',
    track: 'excel',
    rank: 'Analyst',
    title: 'Vendas de Vendedor',
    difficulty: 'Intermediário',
    category: 'SUMIFS',
    description: "Some o valor total onde vendedor = 'Ana' e produto = 'PC'.",
    hint: "WHERE vendedor = 'Ana' AND produto = 'PC'",
    tableSetup: [
      "CREATE TABLE vendas_p (vendedor TEXT, produto TEXT, valor REAL);",
      "INSERT INTO vendas_p VALUES ('Ana', 'PC', 5000), ('Ana', 'Mouse', 50), ('Beto', 'PC', 4000), ('Ana', 'PC', 4500);"
    ],
    expectedOutput: [{ total: 9500.0 }],
    initialQuery: 'SELECT SUM(valor) as total FROM vendas_p'
  },
  {
    id: 'excel-i-s5',
    track: 'excel',
    rank: 'Analyst',
    title: 'Metas Alcançadas',
    difficulty: 'Intermediário',
    category: 'SUMIFS',
    description: "Some os bônus onde atingiu_meta = 'Sim' e depto = 'TI'.",
    hint: "WHERE atingiu_meta = 'Sim' AND depto = 'TI'",
    tableSetup: [
      "CREATE TABLE bonus (depto TEXT, atingiu_meta TEXT, valor REAL);",
      "INSERT INTO bonus VALUES ('TI', 'Sim', 1000), ('RH', 'Sim', 500), ('TI', 'Não', 200), ('TI', 'Sim', 1200);"
    ],
    expectedOutput: [{ total: 2200.0 }],
    initialQuery: 'SELECT SUM(valor) as total FROM bonus'
  },

  // EXPANSÃO BETWEEN
  {
    id: 'sql-b-b2',
    track: 'sql',
    rank: 'Junior',
    title: 'Faixa de Preço',
    difficulty: 'Básico',
    category: 'BETWEEN',
    description: "Selecione produtos com preço entre 50 e 150.",
    hint: "WHERE preco BETWEEN 50 AND 150",
    tableSetup: [
      "CREATE TABLE prod (nome TEXT, preco REAL);",
      "INSERT INTO prod VALUES ('A', 20), ('B', 70), ('C', 120), ('D', 200);"
    ],
    expectedOutput: [{ nome: 'B', preco: 70 }, { nome: 'C', preco: 120 }],
    initialQuery: 'SELECT * FROM prod'
  },
  {
    id: 'sql-b-b3',
    track: 'sql',
    rank: 'Junior',
    title: 'Intervalo de IDs',
    difficulty: 'Básico',
    category: 'BETWEEN',
    description: "Busque os registros onde o ID está entre 10 e 20.",
    hint: "WHERE id BETWEEN 10 AND 20",
    tableSetup: [
      "CREATE TABLE log (id INTEGER);",
      "INSERT INTO log VALUES (5), (10), (15), (20), (25);"
    ],
    expectedOutput: [{ id: 10 }, { id: 15 }, { id: 20 }],
    initialQuery: 'SELECT * FROM log'
  },
  {
    id: 'sql-b-b4',
    track: 'sql',
    rank: 'Junior',
    title: 'Datas de Nascimento',
    difficulty: 'Básico',
    category: 'BETWEEN',
    description: "Selecione pessoas que nasceram entre 1990-01-01 e 1999-12-31.",
    hint: "WHERE nascimento BETWEEN '1990-01-01' AND '1999-12-31'",
    tableSetup: [
      "CREATE TABLE pessoas (nome TEXT, nascimento TEXT);",
      "INSERT INTO pessoas VALUES ('Ana', '1985-05-05'), ('Beto', '1995-10-10'), ('Caio', '1992-01-01');"
    ],
    expectedOutput: [{ nome: 'Beto', nascimento: '1995-10-10' }, { nome: 'Caio', nascimento: '1992-01-01' }],
    initialQuery: 'SELECT * FROM pessoas'
  },
  {
    id: 'sql-b-b5',
    track: 'sql',
    rank: 'Junior',
    title: 'Pontuação de Rank',
    difficulty: 'Básico',
    category: 'BETWEEN',
    description: "Filtre jogadores com pontuação entre 1000 e 2000.",
    hint: "WHERE pontos BETWEEN 1000 AND 2000",
    tableSetup: [
      "CREATE TABLE player (nick TEXT, pontos INTEGER);",
      "INSERT INTO player VALUES ('User1', 500), ('User2', 1500), ('User3', 2500);"
    ],
    expectedOutput: [{ nick: 'User2', pontos: 1500 }],
    initialQuery: 'SELECT * FROM player'
  },

  // EXPANSÃO IN
  {
    id: 'sql-i-in2',
    track: 'sql',
    rank: 'Analyst',
    title: 'Estados Específicos',
    difficulty: 'Intermediário',
    category: 'IN',
    description: "Selecione clientes das siglas 'SP', 'RJ' ou 'MG'.",
    hint: "WHERE estado IN ('SP', 'RJ', 'MG')",
    tableSetup: [
      "CREATE TABLE clientes (nome TEXT, estado TEXT);",
      "INSERT INTO clientes VALUES ('A', 'SP'), ('B', 'BA'), ('C', 'RJ');"
    ],
    expectedOutput: [{ nome: 'A', estado: 'SP' }, { nome: 'C', estado: 'RJ' }],
    initialQuery: 'SELECT * FROM clientes'
  },
  {
    id: 'sql-i-in3',
    track: 'sql',
    rank: 'Analyst',
    title: 'Códigos de Erro',
    difficulty: 'Intermediário',
    category: 'IN',
    description: "Filtre os logs com códigos 404, 500 ou 503.",
    hint: "WHERE code IN (404, 500, 503)",
    tableSetup: [
      "CREATE TABLE logs (code INTEGER);",
      "INSERT INTO logs VALUES (200), (404), (500), (201);"
    ],
    expectedOutput: [{ code: 404 }, { code: 500 }],
    initialQuery: 'SELECT * FROM logs'
  },
  {
    id: 'sql-i-in4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Marcas de Carro',
    difficulty: 'Intermediário',
    category: 'IN',
    description: "Busque carros das marcas 'Ford', 'Fiat' ou 'VW'.",
    hint: "WHERE marca IN ('Ford', 'Fiat', 'VW')",
    tableSetup: [
      "CREATE TABLE frota (modelo TEXT, marca TEXT);",
      "INSERT INTO frota VALUES ('Ka', 'Ford'), ('Onix', 'GM'), ('Gol', 'VW');"
    ],
    expectedOutput: [{ modelo: 'Ka', marca: 'Ford' }, { modelo: 'Gol', marca: 'VW' }],
    initialQuery: 'SELECT * FROM frota'
  },
  {
    id: 'sql-i-in5',
    track: 'sql',
    rank: 'Analyst',
    title: 'IDs de Usuário',
    difficulty: 'Intermediário',
    category: 'IN',
    description: "Selecione usuários com os IDs 1, 3, 5 ou 7.",
    hint: "WHERE id IN (1, 3, 5, 7)",
    tableSetup: [
      "CREATE TABLE users (id INTEGER, nome TEXT);",
      "INSERT INTO users VALUES (1, 'A'), (2, 'B'), (3, 'C'), (4, 'D');"
    ],
    expectedOutput: [{ id: 1, nome: 'A' }, { id: 3, nome: 'C' }],
    initialQuery: 'SELECT * FROM users'
  },

  // EXPANSÃO PYTHON MERGE
  {
    id: 'python-i-m2',
    track: 'python',
    rank: 'Analyst',
    title: 'Merge de Vendas',
    difficulty: 'Intermediário',
    category: 'MERGE',
    description: "Simule `pd.merge(vendas, vendedores, on='vid')`. Mostre o valor da venda e o nome do vendedor.",
    hint: "JOIN vendedores ON vendas.vid = vendedores.id",
    tableSetup: [
      "CREATE TABLE vendas (id INTEGER, vid INTEGER, valor REAL);",
      "CREATE TABLE vendedores (id INTEGER, nome TEXT);",
      "INSERT INTO vendas VALUES (1, 10, 100), (2, 20, 200);",
      "INSERT INTO vendedores VALUES (10, 'Ana'), (20, 'Beto');"
    ],
    expectedOutput: [{ valor: 100, nome: 'Ana' }, { valor: 200, nome: 'Beto' }],
    initialQuery: 'SELECT v.valor, vend.nome FROM vendas v'
  },
  {
    id: 'python-i-m3',
    track: 'python',
    rank: 'Analyst',
    title: 'Merge Left Join',
    difficulty: 'Intermediário',
    category: 'MERGE',
    description: "Simule `pd.merge(df1, df2, how='left')`. Traga todos os alunos e seus cursos (mesmo se não houver curso).",
    hint: "LEFT JOIN cursos ON alunos.id = cursos.aid",
    tableSetup: [
      "CREATE TABLE alunos (id INTEGER, nome TEXT);",
      "CREATE TABLE cursos (aid INTEGER, cname TEXT);",
      "INSERT INTO alunos VALUES (1, 'Ana'), (2, 'Bob');",
      "INSERT INTO cursos VALUES (1, 'Python');"
    ],
    expectedOutput: [{ nome: 'Ana', cname: 'Python' }, { nome: 'Bob', cname: null }],
    initialQuery: 'SELECT * FROM alunos'
  },
  {
    id: 'python-i-m4',
    track: 'python',
    rank: 'Analyst',
    title: 'Merge de Preços',
    difficulty: 'Intermediário',
    category: 'MERGE',
    description: "Simule unir `itens` com `precos`. Traga o nome do item e o valor.",
    hint: "JOIN precos ON itens.cod = precos.cod",
    tableSetup: [
      "CREATE TABLE itens (cod TEXT, nome TEXT);",
      "CREATE TABLE precos (cod TEXT, valor REAL);",
      "INSERT INTO itens VALUES ('a1', 'Mouse'), ('b2', 'Teclado');",
      "INSERT INTO precos VALUES ('a1', 50), ('b2', 150);"
    ],
    expectedOutput: [{ nome: 'Mouse', valor: 50 }, { nome: 'Teclado', valor: 150 }],
    initialQuery: 'SELECT * FROM itens i'
  },
  {
    id: 'python-i-m5',
    track: 'python',
    rank: 'Analyst',
    title: 'Merge de Departamentos',
    difficulty: 'Intermediário',
    category: 'MERGE',
    description: "Simule unir `equipe` com `departamentos` por ID.",
    hint: "JOIN departamentos ON equipe.did = departamentos.id",
    tableSetup: [
      "CREATE TABLE equipe (nome TEXT, did INTEGER);",
      "CREATE TABLE departamentos (id INTEGER, dname TEXT);",
      "INSERT INTO equipe VALUES ('Ana', 1), ('Beto', 2);",
      "INSERT INTO departamentos VALUES (1, 'RH'), (2, 'TI');"
    ],
    expectedOutput: [{ nome: 'Ana', dname: 'RH' }, { nome: 'Beto', dname: 'TI' }],
    initialQuery: 'SELECT * FROM equipe'
  },

  // EXPANSÃO PYTHON AGGREGATE
  {
    id: 'python-i-a2',
    track: 'python',
    rank: 'Analyst',
    title: 'Soma por Grupo',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df.groupby('loja')['vendas'].sum()`. Some as vendas por loja.",
    hint: "SELECT loja, SUM(vendas) as total FROM df GROUP BY loja",
    tableSetup: [
      "CREATE TABLE df (loja TEXT, vendas REAL);",
      "INSERT INTO df VALUES ('A', 100), ('B', 200), ('A', 50);"
    ],
    expectedOutput: [{ loja: 'A', total: 150 }, { loja: 'B', total: 200 }],
    initialQuery: 'SELECT loja FROM df'
  },
  {
    id: 'python-i-a3',
    track: 'python',
    rank: 'Analyst',
    title: 'Média e Contagem',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df.groupby('cat').agg(['mean', 'count'])`. Traga a média e o total de itens por categoria.",
    hint: "SELECT cat, AVG(val) as media, COUNT(*) as total FROM df GROUP BY cat",
    tableSetup: [
      "CREATE TABLE df (cat TEXT, val REAL);",
      "INSERT INTO df VALUES ('X', 10), ('X', 20), ('Y', 50);"
    ],
    expectedOutput: [{ cat: 'X', media: 15, total: 2 }, { cat: 'Y', media: 50, total: 1 }],
    initialQuery: 'SELECT cat FROM df'
  },
  {
    id: 'python-i-a4',
    track: 'python',
    rank: 'Analyst',
    title: 'Máximo por Ano',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df.groupby('ano')['temperatura'].max()`. Traga a maior temperatura por ano.",
    hint: "SELECT ano, MAX(temperatura) FROM df GROUP BY ano",
    tableSetup: [
      "CREATE TABLE df (ano INTEGER, temperatura REAL);",
      "INSERT INTO df VALUES (2022, 35), (2022, 38), (2023, 30);"
    ],
    expectedOutput: [{ ano: 2022, max_t: 38 }, { ano: 2023, max_t: 30 }],
    initialQuery: 'SELECT ano, MAX(temperatura) as max_t FROM df GROUP BY ano'
  },
  {
    id: 'python-i-a5',
    track: 'python',
    rank: 'Analyst',
    title: 'Múltiplas Agregações',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Traga a soma e a média de `faturamento` por `setor`.",
    hint: "SELECT setor, SUM(faturamento) as s, AVG(faturamento) as m FROM df GROUP BY setor",
    tableSetup: [
      "CREATE TABLE df (setor TEXT, faturamento REAL);",
      "INSERT INTO df VALUES ('Sul', 100), ('Sul', 200), ('Norte', 500);"
    ],
    expectedOutput: [{ setor: 'Norte', s: 500, m: 500 }, { setor: 'Sul', s: 300, m: 150 }],
    initialQuery: 'SELECT setor FROM df'
  },

  // ==========================================
  // DESAFIOS FINAIS (DESAFIOS BOSS)
  // ==========================================

  // SQL FINAL TESTS
  {
    id: 'sql-final-junior',
    track: 'sql',
    rank: 'Junior',
    isFinalTest: true,
    title: 'Desafio Final: O Pequeno DBA',
    difficulty: 'Básico',
    category: 'FINAL TEST',
    description: 'Relatório Completo de Inventário: Selecione o nome do item e o setor em letras maiúsculas, mas APENAS para itens com preco > 50, ordenados pelo nome (Z para A).',
    hint: "SELECT UPPER(nome), UPPER(setor) ... WHERE preco > 50 ORDER BY nome DESC",
    tableSetup: [
      "CREATE TABLE inv (nome TEXT, setor TEXT, preco REAL);",
      "INSERT INTO inv VALUES ('Mouse', 'TI', 60), ('Cabo', 'TI', 20), ('Teclado', 'TI', 150), ('Cadeira', 'Office', 200);"
    ],
    expectedOutput: [
      { nome: 'TECLADO', setor: 'TI' },
      { nome: 'MOUSE', setor: 'TI' },
      { nome: 'CADEIRA', setor: 'OFFICE' }
    ],
    initialQuery: 'SELECT * FROM inv',
    orderSensitive: true
  },
  {
    id: 'sql-final-analyst',
    track: 'sql',
    rank: 'Analyst',
    isFinalTest: true,
    title: 'Desafio Final: Analista de BI',
    difficulty: 'Intermediário',
    category: 'FINAL TEST',
    description: 'Relatório de Performance: Una as tabelas `equipe` e `vendas`. Traga o nome do vendedor e o faturamento total dele, mas mostre apenas quem faturou mais de 5000 no total.',
    hint: "JOIN ... GROUP BY ... HAVING SUM(valor) > 5000",
    tableSetup: [
      "CREATE TABLE equipe (id INTEGER, nome TEXT);",
      "CREATE TABLE vendas (vid INTEGER, valor REAL);",
      "INSERT INTO equipe VALUES (1, 'Ana'), (2, 'Bob'), (3, 'Caio');",
      "INSERT INTO vendas VALUES (1, 6000), (2, 4000), (1, 1500), (3, 2000);"
    ],
    expectedOutput: [{ nome: 'Ana', total: 7500.0 }],
    initialQuery: 'SELECT e.nome, SUM(v.valor) as total FROM equipe e'
  },
  {
    id: 'sql-final-expert',
    track: 'sql',
    rank: 'Expert',
    isFinalTest: true,
    title: 'Desafio Final: Engineer Master',
    difficulty: 'Avançado',
    category: 'FINAL TEST',
    description: 'Cálculo de Bônus Robusto: Com uma CTE, calcule a média de vendas de todos. Depois, selecione vendedores cujo faturamento individual é maior que essa média global. O bônus é 10% do faturamento deles.',
    hint: "WITH Media AS (SELECT AVG(faturamento) as m FROM dados) SELECT ... FROM dados WHERE faturamento > (SELECT m FROM Media)",
    tableSetup: [
      "CREATE TABLE dados (vendedor TEXT, faturamento REAL);",
      "INSERT INTO dados VALUES ('A', 3000), ('B', 5000), ('C', 10000), ('D', 4000);"
    ],
    expectedOutput: [{ vendedor: 'C', bonus: 1000.0 }],
    initialQuery: 'SELECT vendedor, faturamento * 0.1 as bonus FROM dados'
  },

  // EXCEL FINAL TESTS
  {
    id: 'excel-final-junior',
    track: 'excel',
    rank: 'Junior',
    isFinalTest: true,
    title: 'Desafio Final: Ninja das Planilhas',
    difficulty: 'Básico',
    category: 'FINAL TEST',
    description: 'Consolidação de Turma: Calcule a MÉDIA da nota e a SOMA total de faltas para todos os alunos na tabela `diario`.',
    hint: "SELECT AVG(nota) as media, SUM(faltas) as total_faltas FROM diario",
    tableSetup: [
      "CREATE TABLE diario (aluno TEXT, nota REAL, faltas INTEGER);",
      "INSERT INTO diario VALUES ('A', 8, 2), ('B', 6, 1), ('C', 10, 0);"
    ],
    expectedOutput: [{ media: 8.0, total_faltas: 3 }],
    initialQuery: 'SELECT * FROM diario'
  },
  {
    id: 'excel-final-analyst',
    track: 'excel',
    rank: 'Analyst',
    isFinalTest: true,
    title: 'Desafio Final: Controller Analyst',
    difficulty: 'Intermediário',
    category: 'FINAL TEST',
    description: 'Auditoria de Estoque: Simule um VLOOKUP para trazer o preço do `id_ref` da tabela `inventario` comparando com a tabela `preços`. Traga apenas o total (qtd * preco) onde o item começa com a letra "C".',
    hint: "JOIN ... WHERE item LIKE 'C%'",
    tableSetup: [
      "CREATE TABLE inventario (item TEXT, id_ref INTEGER, qtd INTEGER);",
      "CREATE TABLE precos (id INTEGER, preco REAL);",
      "INSERT INTO inventario VALUES ('Chave', 1, 10), ('Alicate', 2, 5), ('Cabo', 3, 20);",
      "INSERT INTO precos VALUES (1, 15.0), (2, 25.0), (3, 5.0);"
    ],
    expectedOutput: [{ item: 'Chave', total: 150.0 }, { item: 'Cabo', total: 100.0 }],
    initialQuery: 'SELECT i.item FROM inventario i'
  },
  {
    id: 'excel-final-expert',
    track: 'excel',
    rank: 'Expert',
    isFinalTest: true,
    title: 'Desafio Final: Dashboard Architect',
    difficulty: 'Avançado',
    category: 'FINAL TEST',
    description: 'Status de Meta Dinâmico: Use CASE para classificar o atingimento da meta (vendas / meta). Se >= 1 -> "Meta Batida", se >= 0.8 -> "Quase lá", senão "Longe".',
    hint: "CASE WHEN vendas/meta >= 1 THEN 'Meta Batida' ...",
    tableSetup: [
      "CREATE TABLE dashboard (mes TEXT, vendas REAL, meta REAL);",
      "INSERT INTO dashboard VALUES ('Jan', 12000, 10000), ('Fev', 8500, 10000), ('Mar', 5000, 10000);"
    ],
    expectedOutput: [
      { mes: 'Jan', status: 'Meta Batida' },
      { mes: 'Fev', status: 'Quase lá' },
      { mes: 'Mar', status: 'Longe' }
    ],
    initialQuery: 'SELECT mes FROM dashboard'
  },

  // PYTHON FINAL TESTS
  {
    id: 'python-final-junior',
    track: 'python',
    rank: 'Junior',
    isFinalTest: true,
    title: 'Desafio Final: Python Scripts Starter',
    difficulty: 'Básico',
    category: 'FINAL TEST',
    description: 'Pandas Head & Filter: Simule carregar os dados, filtrar por idade > 20 e mostrar apenas as 2 primeiras linhas (head).',
    hint: "WHERE idade > 20 LIMIT 2",
    tableSetup: [
      "CREATE TABLE users (id INTEGER, nome TEXT, idade INTEGER);",
      "INSERT INTO users VALUES (1, 'A', 25), (2, 'B', 30), (3, 'C', 15), (4, 'D', 22);"
    ],
    expectedOutput: [{ id: 1, nome: 'A', idade: 25 }, { id: 2, nome: 'B', idade: 30 }],
    initialQuery: 'SELECT * FROM users',
    orderSensitive: true
  },
  {
    id: 'python-final-analyst',
    track: 'python',
    rank: 'Analyst',
    isFinalTest: true,
    title: 'Desafio Final: Data Analyst Python',
    difficulty: 'Intermediário',
    category: 'FINAL TEST',
    description: 'Merge & Aggregate: Una o `df_pedidos` com `df_clientes` e retorne a MÉDIA de pedidos por cidade.',
    hint: "JOIN ... GROUP BY cidade",
    tableSetup: [
      "CREATE TABLE df_pedidos (cid INTEGER, valor REAL);",
      "CREATE TABLE df_clientes (id INTEGER, cidade TEXT);",
      "INSERT INTO df_pedidos VALUES (1, 100), (1, 200), (2, 500);",
      "INSERT INTO df_clientes VALUES (1, 'SP'), (2, 'RJ');"
    ],
    expectedOutput: [{ cidade: 'RJ', media: 500.0 }, { cidade: 'SP', media: 150.0 }],
    initialQuery: 'SELECT cidade, AVG(valor) as media FROM df_pedidos p'
  },
  {
    id: 'python-final-expert',
    track: 'python',
    rank: 'Expert',
    isFinalTest: true,
    title: 'Desafio Final: Data Scientist Pro',
    difficulty: 'Avançado',
    category: 'FINAL TEST',
    description: 'Advanced Processing: Crie uma Pivot Table (vendas por ano) e uma lógica Lambda para sinalizar bônus de 500 se o faturamento total do ano for > 2000.',
    hint: "Soma condicional com CASE no Pivot, depois outra coluna para o bônus.",
    tableSetup: [
      "CREATE TABLE v (loja TEXT, ano INTEGER, valor REAL);",
      "INSERT INTO v VALUES ('Sul', 2023, 2500), ('Norte', 2023, 1500), ('Sul', 2022, 3000);"
    ],
    expectedOutput: [
      { loja: 'Norte', f2023: 1500.0, bonus: 0 },
      { loja: 'Sul', f2023: 2500.0, bonus: 500 }
    ],
    initialQuery: 'SELECT loja, SUM(CASE WHEN ano=2023 THEN valor ELSE 0 END) as f2023 FROM v GROUP BY loja'
  }
];
