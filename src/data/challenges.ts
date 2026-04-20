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
    title: 'Auditoria de Equipe: Visibilidade Total',
    difficulty: 'Básico',
    category: 'SELECT',
    description: 'Como novo Analista de Dados, seu primeiro passo é auditar a base de talentos da empresa. Recupere todos os registros e colunas da tabela `funcionarios` para obter uma visão panorâmica da estrutura organizacional atual.',
    hint: 'Utilize o comando fundamental SELECT com o asterisco (*) para projetar todas as colunas disponíveis na fonte de dados.',
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
    title: 'Filtragem Estratégica: Faixa Salarial',
    difficulty: 'Básico',
    category: 'WHERE',
    description: 'O departamento de RH precisa identificar colaboradores com remuneração acima da média de mercado para um estudo de retenção. Selecione o `nome` e o `cargo` de todos os funcionários cujo salário seja estritamente superior a 4000.',
    hint: 'Aplique a cláusula WHERE para estabelecer um critério de filtragem numérica sobre a coluna de remuneração.',
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
    title: 'Busca Fonética: Indexação de Clientes',
    difficulty: 'Básico',
    category: 'LIKE',
    description: "A equipe de marketing está segmentando clientes para uma campanha alfabética. Liste todos os clientes da tabela `clientes` cujos nomes iniciem com a letra 'A'.",
    hint: "Use o operador LIKE em conjunto com o caractere curinga '%' para identificar padrões de texto que começam com o caractere desejado.",
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
    title: 'Mapeamento de Departamentos Únicos',
    difficulty: 'Básico',
    category: 'DISTINCT',
    description: "Para organizar o novo organograma, precisamos de uma lista consolidada de todos os departamentos existentes na empresa, sem repetições. Extraia os valores únicos da coluna `departamento` na tabela `setores`.",
    hint: "A palavra-chave DISTINCT permite remover duplicidade de registros no conjunto de resultados retornado pela consulta.",
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
    title: 'Ranking de Preços: Ordenação de Catálogo',
    difficulty: 'Básico',
    category: 'ORDER BY',
    description: "O e-commerce precisa exibir os produtos do mais barato para o mais caro para atrair clientes sensíveis ao preço. Selecione todos os produtos da tabela e organize-os por preço em ordem crescente.",
    hint: "A cláusula ORDER BY define a sequência de exibição dos dados. Por padrão, a ordenação é ascendente (ASC).",
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
    title: 'Análise de Performance: Performance de Vendas',
    difficulty: 'Intermediário',
    category: 'GROUP BY',
    description: 'A gerência comercial quer avaliar o desempenho individual de cada vendedor. Agregue o faturamento total da tabela `vendas` por `vendedor`. Certifique-se de nomear a coluna de resultado como `total_vendas` para clareza no relatório final.',
    hint: 'A função de agregação SUM deve ser acompanhada pela instrução GROUP BY para que o cálculo seja segmentado corretamente por categoria (neste caso, por vendedor).',
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
    title: 'Filtro de Metas: Vendedores de Alta Performance',
    difficulty: 'Intermediário',
    category: 'HAVING',
    description: "Após agrupar as vendas, precisamos destacar apenas os profissionais que superaram a meta trimestral. Filtre seu relatório anterior para exibir exclusivamente os vendedores cujo `total_vendas` seja estritamente superior a 250.",
    hint: "Diferente do WHERE, a cláusula HAVING é aplicada após a agregação dos dados, permitindo filtrar os resultados baseados em cálculos de grupo.",
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
    title: 'Relacionamento de Dados: Jornada do Cliente',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Para entender o comportamento de compra, cruze os dados cadastrais com os históricos de pedidos. Recupere o `nome` do cliente e o `produto` adquirido, relacionando as tabelas `clientes` e `pedidos` através da chave estrangeira apropriada.",
    hint: "Utilize o INNER JOIN para combinar registros de duas tabelas quando houver uma correspondência exata entre as colunas relacionadas (id vs cliente_id).",
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
    title: 'Benchmarks Corporativos: Análise de Desvio Salarial',
    difficulty: 'Avançado',
    category: 'SUBQUERY',
    description: "A diretoria financeira deseja identificar talentos que possuem uma remuneração de elite. Selecione todos os funcionários cujo salário seja superior à média salarial global da organização. Resolva este desafio utilizando uma subconsulta para o cálculo da média.",
    hint: "Uma subconsulta (inner query) pode ser utilizada dentro da cláusula WHERE para fornecer um valor dinâmico (como a média global) para a comparação da consulta principal.",
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
    title: 'Logística Inteligente: Categorização de Inventário',
    difficulty: 'Avançado',
    category: 'CASE',
    description: "Para otimizar o fluxo do armazém, precisamos de uma classificação automatizada de volume. Crie uma nova coluna chamada `status` que classifique o estoque como 'Alto' se a quantidade for superior a 100, e 'Baixo' para quantidades iguais ou inferiores.",
    hint: "A estrutura condicional CASE WHEN permite criar lógica de ramificação diretamente no seu conjunto de resultados, funcionando como o 'SE' das planilhas.",
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
    title: 'Consolidação Financeira: Soma de Receita',
    difficulty: 'Básico',
    category: 'SOMA',
    description: "Para o fechamento do caixa mensal, é necessário consolidar todos os valores registrados na planilha de vendas. Utilize a lógica da função =SOMA() para calcular o montante total da coluna `faturamento` na tabela `planilha_vendas`.",
    hint: "Embora o motor de execução seja SQL, pense na lógica do Excel: o SUM(coluna) agregará todos os valores numéricos do intervalo selecionado.",
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
    title: 'Cálculo de Desempenho: Média Acadêmica',
    difficulty: 'Básico',
    category: 'AVERAGE',
    description: "O conselho de classe precisa calcular a média aritmética final dos estudantes para o conselho deliberativo. Aplique a lógica da função =MÉDIA() para encontrar a pontuação média da turma a partir da coluna `nota`.",
    hint: "A função AVG no banco de dados replica o comportamento da função MÉDIA (ou AVERAGE) das planilhas, somando os valores e dividindo pela contagem total.",
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
    title: 'Inteligência de Dados: Busca Relacional (PROCV)',
    difficulty: 'Intermediário',
    category: 'VLOOKUP',
    description: "Você possui uma base de IDs e precisa enriquecê-la com informações de localização. Utilizando a lógica do =PROCV() (ou VLOOKUP), cruze a tabela `ID_CLIENTES` com a tabela `ENDERECOS` para retornar o nome do cliente e sua respectiva cidade.",
    hint: "No desenvolvimento SQL, um JOIN entre tabelas é a forma mais robusta de realizar o comportamento de um PROCV entre diferentes planilhas ou abas.",
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
    title: 'Sumarização de Dados: Tabela Dinâmica de Inventário',
    difficulty: 'Intermediário',
    category: 'PIVOT',
    description: "A equipe de suprimentos precisa de um resumo rápido do estoque por departamento. Simule a criação de uma Tabela Dinâmica que conte a quantidade de itens presentes em cada `setor` consolidado.",
    hint: "Para simular o 'Arraste de Campos' de uma Tabela Dinâmica, utilize o comando de agrupamento para consolidar as categorias desejadas.",
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
    title: 'Data Wrangling: Filtragem de DataFrames',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Na análise exploratória de dados com a biblioteca Pandas, é comum filtrar registros baseados em condições lógicas. Simule a instrução `df[df['idade'] > 18]` para extrair todos os usuários que já atingiram a maioridade civil.",
    hint: "Pense na sintaxe de filtragem do Pandas: a condição dentro dos colchetes se traduz diretamente na restrição de linhas do seu conjunto de dados.",
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
    title: 'Inspeção de Dados: Snapshot de Observações',
    difficulty: 'Básico',
    category: 'HEAD',
    description: "Para validar a estrutura de um DataFrame recém-carregado sem sobrecarregar a memória, os Cientistas de Dados utilizam o método `.head()`. Recupere as 2 primeiras observações da tabela para uma inspeção inicial da integridade dos dados.",
    hint: "O método head(n) do Pandas limita o retorno às primeiras N linhas do objeto DataFrame. No ambiente de banco de dados, utilizamos uma restrição de volume similar.",
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
    title: 'Engenharia de Features: Normalização de Texto',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Dados brutos frequentemente vêm com ruídos de formatação. Aplique uma rotina de limpeza para remover espaços em branco excedentes à direita e padronizar a coluna `tags` para letras maiúsculas, preparando os dados para um modelo de Processamento de Linguagem Natural (NLP).",
    hint: "No Pandas, isso seria feito com `str.strip()` e `str.upper()`. Aqui, utilize as funções equivalentes para transformação de strings.",
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
    title: 'Junção de Fontes: Integração de DataFrames',
    difficulty: 'Intermediário',
    category: 'MERGE',
    description: "Muitas vezes, os dados estão distribuídos em fontes distintas. Implemente a integração das tabelas `df1` e `df2` utilizando a lógica do método `pd.merge()`, relacionando os alunos aos seus respectivos cursos através da chave de identificação.",
    hint: "O 'merge' padrão do Pandas realiza uma junção interna (inner) por padrão. No ambiente de análise, certifique-se de que a condição de igualdade entre as colunas de ID esteja clara.",
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
    title: 'Filtro Temporal: Janela de Vendas',
    difficulty: 'Básico',
    category: 'BETWEEN',
    description: 'O departamento de logística solicita um relatório de todos os pedidos processados durante o primeiro mês do ano para fechar o balanço. Filtre os registros da tabela `pedidos` ocorridos entre 01/01/2023 e 31/01/2023.',
    hint: "O operador BETWEEN é a forma mais legível de filtrar dados que residem dentro de um intervalo inclusivo (data de início e data de término).",
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
    title: 'Auditoria de Engajamento: Churn de Clientes',
    difficulty: 'Intermediário',
    category: 'LEFT JOIN',
    description: 'Identificar prospectos que completaram o cadastro mas ainda não realizaram sua primeira compra é vital para o time de Sucesso do Cliente. Retorne o `nome` de todos os clientes que não possuem registros correspondentes na tabela de `pedidos`.',
    hint: "Uma técnica comum é utilizar o LEFT JOIN e filtrar por IS NULL na tabela da direita para identificar registros órfãos ou sem correspondência.",
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
    title: 'Segmentação Departamental: Filtro Multivalorado',
    difficulty: 'Intermediário',
    category: 'IN',
    description: "O comitê interno de cultura está organizando um evento e precisa da lista de colaboradores dos setores de 'TI', 'RH' e 'Financeiro'. Utilize uma abordagem eficiente para filtrar estes departamentos simultaneamente.",
    hint: "O operador IN é extremamente útil para comparar um valor contra uma lista de múltiplos critérios, tornando o código mais limpo do que múltiplos operadores OR.",
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
    title: 'Arquitetura de Dados: Modularização com CTE',
    difficulty: 'Avançado',
    category: 'CTE',
    description: 'Para melhorar a legibilidade de consultas complexas, a engenharia de dados utiliza Expressões de Tabela Comuns (CTEs). Implemente uma CTE para consolidar o faturamento por categoria e, a partir dessa estrutura temporária, selecione apenas aquelas com faturamento acumulado superior a 1000.',
    hint: "A cláusula WITH define um conjunto de resultados temporário que você pode referenciar como se fosse uma tabela real dentro da sua consulta principal.",
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
    title: 'Sanitização de Dados: Tratamento de valores Nulos',
    difficulty: 'Avançado',
    category: 'COALESCE',
    description: "A integridade do mailing é fundamental. Recupere o nome do cliente e seu respectivo telefone. Caso o campo de contato esteja ausente (NULL), o sistema deve exibir a mensagem padrão 'Não Informado' na coluna `contato`.",
    hint: "A função COALESCE retorna o primeiro valor não nulo de uma lista, sendo a ferramenta ideal para prover fallbacks de dados ausentes.",
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
    title: 'Estatística de Vendas: Frequência de Pedidos',
    difficulty: 'Básico',
    category: 'COUNTIF',
    description: "O gerente de vendas deseja monitorar itens de alto ticket médio. Baseando-se na função =CONT.SE(), conte quantos produtos na tabela `estoque` possuem um preço unitário superior a 100.",
    hint: "O comportamento de um CONT.SE com critério numérico é replicado combinando a função de contagem com uma restrição de categoria.",
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
    title: 'Ajuste Salarial: Projeção de Orçamento',
    difficulty: 'Básico',
    category: 'SELECT',
    description: 'O setor de planejamento financeiro está simulando um reajuste de 10% para todos os colaboradores. Projete o `nome` do funcionário e o novo salário calculado. Certifique-se de nomear a coluna de cálculo como `salario_aumentado`.',
    hint: 'Operações aritméticas podem ser realizadas diretamente na projeção do SELECT, permitindo criar colunas virtuais de cálculo.',
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
    title: 'Gestão de Lead: Padronização de CRM',
    difficulty: 'Básico',
    category: 'SELECT',
    description: "Para uma importação em massa no novo sistema de CRM, todos os leads devem possuir um status inicial definido. Selecione o campo `nome` e crie uma coluna estática chamada `status` com o valor fixo 'Ativo'.",
    hint: "Valores literais entre aspas simples podem ser incluídos na lista de projeção para criar colunas com valores constantes para todos os registros.",
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
    title: 'Saneamento Cadastral: Duplicidade de Chave',
    difficulty: 'Básico',
    category: 'SELECT',
    description: "Durante uma rotina de manutenção de banco de dados, precisamos verificar a integridade dos IDs. Recupere o campo `id` original e crie uma cópia idêntica chamada `backup_id` para fins de validação técnica.",
    hint: "Uma mesma coluna física pode ser projetada múltiplas vezes no SELECT com aliases distintos para diferentes propósitos analíticos.",
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
    title: 'Padronização de Ativos: Normalização de Texto',
    difficulty: 'Básico',
    category: 'SELECT',
    description: "Para garantir a consistência nas buscas do catálogo, todos os modelos de veículos devem ser exibidos em letras minúsculas. Aplique a transformação necessária na coluna `modelo` e nomeie o resultado como `modelo_minusculo`.",
    hint: "Funções de manipulação de texto como LOWER() são essenciais para normalizar dados textuais vindos de diferentes fontes de digitação.",
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
    title: 'Filtro de Funções: Múltiplas Condições',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "O RH precisa de uma listagem rápida que contemple tanto 'Analistas' quanto 'Gerentes'. Utilize a lógica conjuntiva para retornar funcionários que ocupem qualquer um desses dois cargos.",
    hint: "O operador lógico OR permite que o registro seja selecionado se atender a pelo menos uma das condições especificadas na cláusula de filtragem.",
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
    title: 'Inventário de Precisão: Exclusão de Valores',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "A equipe de vendas quer ver todos os itens do catálogo, exceto aqueles que custam exatamente 50, que estão passando por revisão de preço. Filtre a lista de produtos omitindo este valor específico.",
    hint: "O operador de desigualdade (!= ou <>) é utilizado para excluir registros que correspondam a um critério exato de valor.",
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
    title: 'Pesquisa Direta: Localização por Chave Primária',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "Para um suporte técnico personalizado, você precisa recuperar os detalhes completos do colaborador que possui a identificação única (ID) de valor 7. Localize este registro específico na tabela `emp`.",
    hint: "A filtragem por ID é a forma mais rápida e precisa de recuperar uma única observação de um banco de dados, utilizando o operador de igualdade na coluna de identificação.",
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
    title: 'Gestão de Compras: Disponibilidade de Baixo Custo',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "O setor de compras precisa repor itens que sejam econômicos e possuam alta rotatividade. Selecione da tabela `prod` todos os produtos que custam menos de 100 e que possuam simultaneamente mais de 10 unidades em estoque.",
    hint: "Combine múltiplas restrições em uma única cláusula WHERE utilizando o operador lógico AND para que ambas as condições sejam obrigatoriamente verdadeiras.",
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
    title: 'Relatório de Compras: Integração Produto-Venda',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Para gerar as notas fiscais, o sistema precisa cruzar o ID da transação com o nome descritivo do produto. Una as tabelas `vendas` e `produtos` para projetar o `id_venda` e o `nome_produto` correspondente.",
    hint: "A junção INNER JOIN deve ser estabelecida através da coluna que serve como ponte entre as duas entidades (prod_id na tabela de vendas e id na tabela de produtos).",
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
    title: 'Visão Organizacional: Alocação Departamental',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "O time de operações solicitou um mapeamento de pessoal. Recupere o `nome` do colaborador e o `nome_depto` associado, integrando a tabela de funcionários (`emp`) com a tabela de departamentos (`deptos`) via chave estrangeira.",
    hint: "Utilize o relacionamento de chaves entre depto_id e o ID da tabela de departamentos para materializar o nome legível do setor de cada funcionário.",
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
    title: 'Auditoria de Ticket Médio: Detalhamento de Pedido',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Para uma análise de faturamento por transação, precisamos do valor monetário associado a cada pedido. Una `pedidos` com a tabela referencial de preços (`precos_itens`) para retornar o `id_pedido` e seu respectivo `valor`.",
    hint: "Relacione as tabelas através da chave de item para buscar o preço unitário correspondente a cada entrada de pedido registrada.",
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
    title: 'Integração Acadêmica: Relatório de Matrículas e Notas',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "A secretaria acadêmica precisa de um boletim consolidado. Cruze os dados das tabelas `alunos`, `matriculas` e `cursos` para projetar em uma única visão o `nome` do aluno, o `nome_curso` em que ele está inscrito e a `nota` obtida.",
    hint: "Junções triplas seguem a mesma lógica de encadeamento: voce une a primeira tabela à segunda, e o resultado desta junção à terceira tabela, respeitando as chaves de ligação de cada par.",
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
    title: 'Desafio Final: O Pequeno DBA - Gestão de Ativos',
    difficulty: 'Básico',
    category: 'FINAL TEST',
    description: 'Relatório Consolidado de Inventário: Em seu primeiro grande projeto, a gerência solicita uma listagem de ativos de alto valor. Selecione o nome do item e o setor em letras MAIÚSCULAS, filtrando apenas itens com preço superior a 50. Para garantir a organização, a lista deve ser exibida em ordem alfabética inversa (Z para A).',
    hint: "Combine as transformações de string (UPPER) com restrições numéricas (WHERE) e controle de fluxo (ORDER BY DESC) para entregar o resultado esperado.",
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
    title: 'Desafio Final: Analista de BI - Atribuição de Metas',
    difficulty: 'Intermediário',
    category: 'FINAL TEST',
    description: 'Auditoria de Performance Global: O time executivo precisa de visibilidade sobre o faturamento acumulado por colaborador. Integre os dados das tabelas de `equipe` e `vendas` para retornar o nome consolidado do vendedor e o seu faturamento total. Para focar nos talentos de elite, exiba apenas aqueles que acumularam um volume superior a 5000.',
    hint: "A resolução deste desafio exige a utilização de junções relacionais acompanhadas de funções agregadoras e filtros de grupo (HAVING).",
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
    title: 'Desafio Final: Engineer Master - Lógica de Programação Analítica',
    difficulty: 'Avançado',
    category: 'FINAL TEST',
    description: 'Engenharia de Retribuição Variável: Utilizando uma Expressão de Tabela Comum (CTE), identifique os colaboradores cujo faturamento supere o benchmark médio da organização. Para estes profissionais, calcule um bônus de incentivo equivalente a 10% de suas respectivas vendas.',
    hint: "Modularize sua consulta utilizando o bloco WITH para calcular a média global e utilize essa variável dinâmica para filtrar os nomes qualificados.",
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
    title: 'Desafio Final: Ninja das Planilhas - Fechamento de Ciclo',
    difficulty: 'Básico',
    category: 'FINAL TEST',
    description: 'Relatório Consolidado de Rendimento: Como Controller Acadêmico, sua missão é entregar o resumo estatístico da turma. Calcule a MÉDIA aritmética das notas e o somatório acumulado de faltas de todos os alunos registrados no `diario`.',
    hint: "Combine as funções agregadoras SUM e AVG de acordo com a lógica das fórmulas originais do Excel para processar o intervalo completo.",
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
    title: 'Desafio Final: Controller Analyst - Auditoria Cruzada',
    difficulty: 'Intermediário',
    category: 'FINAL TEST',
    description: 'Análise de Margem e Custo: Simule a utilização do PROCV para identificar o preço unitário de cada item do `inventario`. O seu relatório final deve conter o nome do produto e o valor total (quantidade x preço), filtrando apenas por itens da categoria "C" (nomes que começam com a letra C).',
    hint: "Integre as fontes de dados através de um relacionamento de chaves e aplique filtros textuais para selecionar o subconjunto desejado da operação.",
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
    title: 'Desafio Final: Dashboard Architect - Gestão de Metas',
    difficulty: 'Avançado',
    category: 'FINAL TEST',
    description: 'Monitoramento de KPIs Corporativos: Para o dashboard da diretoria, crie uma lógica de classificação de batimento de meta (Vendas / Meta). Utilize a estrutura CASE para retornar: "Meta Batida" (razão >= 1), "Quase lá" (razão >= 0.8) e "Longe" para desempenhos inferiores.',
    hint: "Pense na lógica de um 'Farol de Performance'. A comparação entre valores realizados e orçados é a base para a gestão de indicadores de sucesso (KPIs).",
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
    title: 'Desafio Final: Python Scripts Starter - Data Exploration',
    difficulty: 'Básico',
    category: 'FINAL TEST',
    description: 'Pipeline de Inspeção de Dados: Como Cientista de Dados Júnior, você deve carregar os registros de usuários, aplicar um filtro para selecionar apenas perfis acima de 20 anos e exibir as 2 primeiras observações (`head`) para validação rápida.',
    hint: "No ecossistema Python, este fluxo representa o tratamento inicial de um DataFrame. Utilize a filtragem lógica seguida pela limitação de registros na visualização.",
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
    title: 'Desafio Final: Data Analyst Python - Agregação Regional',
    difficulty: 'Intermediário',
    category: 'FINAL TEST',
    description: 'Business Intelligence com Python: Integre os DataFrames de `pedidos` e `clientes` (merge). O objetivo final é extrair a média de ticket por cidade, permitindo uma análise geográfica de rentabilidade.',
    hint: "Realize a junção dos objetos e, em seguida, aplique a agregação por categoria para calcular a métrica de média aritmética solicitada.",
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
    title: 'Desafio Final: Data Scientist Pro - Engenharia de Atributos',
    difficulty: 'Avançado',
    category: 'FINAL TEST',
    description: 'Processamento de Séries Temporais: Desenvolva uma estrutura de visualização pivotada para comparar vendas anuais. Adicionalmente, implemente uma regra de negócio (Lambda) que conceda um bônus de 500 para lojas cujo faturamento no ano de 2023 tenha superado o benchmark de 2000.',
    hint: "Combine a transposição de dados (pivot) com lógica condicional aplicada linha a linha para identificar os registros que cumprem com os requisitos de incentivo.",
    tableSetup: [
      "CREATE TABLE v (loja TEXT, ano INTEGER, valor REAL);",
      "INSERT INTO v VALUES ('Sul', 2023, 2500), ('Norte', 2023, 1500), ('Sul', 2022, 3000);"
    ],
    expectedOutput: [
      { loja: 'Norte', f2023: 1500.0, bonus: 0 },
      { loja: 'Sul', f2023: 2500.0, bonus: 500 }
    ],
    initialQuery: 'SELECT loja, SUM(CASE WHEN ano=2023 THEN valor ELSE 0 END) as f2023 FROM v GROUP BY loja'
  },

  // ==========================================
  // EXPANSÃO: EXCEL AVANÇADO (Mais Desafios)
  // ==========================================

  // BÁSICO - EXCEL
  {
    id: 'excel-b-ext-1',
    track: 'excel',
    rank: 'Junior',
    title: 'Mínimo e Máximo de Estoque',
    difficulty: 'Básico',
    category: 'MIN/MAX',
    description: "Simule as funções =MÍN() e =MÁX(). Encontre o menor e o maior valor de estoque na tabela.",
    hint: "Use MIN(coluna) e MAX(coluna)",
    tableSetup: [
      "CREATE TABLE estoque (item TEXT, qtd INTEGER);",
      "INSERT INTO estoque VALUES ('A', 10), ('B', 50), ('C', 5), ('D', 100);"
    ],
    expectedOutput: [{ menor: 5, maior: 100 }],
    initialQuery: 'SELECT MIN(qtd) as menor, MAX(qtd) as maior FROM estoque'
  },
  {
    id: 'excel-b-ext-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Filtro de Data Recente',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Filtre todas as vendas que ocorreram após '2023-06-01'.",
    hint: "WHERE data > '2023-06-01'",
    tableSetup: [
      "CREATE TABLE vendas_data (id INTEGER, data TEXT, valor REAL);",
      "INSERT INTO vendas_data VALUES (1, '2023-01-10', 100), (2, '2023-07-15', 500), (3, '2023-12-01', 350);"
    ],
    expectedOutput: [{ id: 2, data: '2023-07-15', valor: 500 }, { id: 3, data: '2023-12-01', valor: 350 }],
    initialQuery: 'SELECT * FROM vendas_data'
  },

  // INTERMEDIÁRIO - EXCEL
  {
    id: 'excel-i-ext-1',
    track: 'excel',
    rank: 'Analyst',
    title: 'Média Condicional (AVERAGEIF)',
    difficulty: 'Intermediário',
    category: 'AVERAGEIF',
    description: "Simule =MÉDIA.SE(). Calcule a média salarial apenas do departamento 'Marketing'. Texto para busca: 'Marketing'.",
    hint: "=MÉDIA.SE(depto; 'Marketing'; salario)",
    tableSetup: [
      "CREATE TABLE folha (nome TEXT, depto TEXT, salario REAL);",
      "INSERT INTO folha VALUES ('Ana', 'TI', 5000), ('Joao', 'Marketing', 4500), ('Bia', 'Marketing', 5500), ('Leo', 'RH', 4000);"
    ],
    expectedOutput: [{ media_mkt: 5000.0 }],
  },
  {
    id: 'excel-i-ext-2',
    track: 'excel',
    rank: 'Analyst',
    title: 'Arredondamento de Valores',
    difficulty: 'Intermediário',
    category: 'ROUND',
    description: "Simule a função =ARRED(). Arredonde os preços dos produtos para 1 casa decimal.",
    hint: "=ARRED(preco; 1)",
    tableSetup: [
      "CREATE TABLE precos_quebrados (item TEXT, preco REAL);",
      "INSERT INTO precos_quebrados VALUES ('A', 10.556), ('B', 19.123), ('C', 5.789);"
    ],
    expectedOutput: [{ item: 'A', preco: 10.6 }, { item: 'B', preco: 19.1 }, { item: 'C', preco: 5.8 }],
  },

  // AVANÇADO - EXCEL
  {
    id: 'excel-a-ext-1',
    track: 'excel',
    rank: 'Expert',
    title: 'Soma Acumulada (Running Total)',
    difficulty: 'Avançado',
    category: 'WINDOW',
    description: "Calcule o faturamento acumulado mês a mês (Soma Acumulada).",
    hint: "Em Excel usamos referências mistas, aqui simule a lógica acumulativa.",
    tableSetup: [
      "CREATE TABLE meses (id INTEGER, mes TEXT, valor REAL);",
      "INSERT INTO meses VALUES (1, 'Jan', 1000), (2, 'Fev', 1500), (3, 'Mar', 1200);"
    ],
    expectedOutput: [
      { mes: 'Jan', acumulado: 1000.0 },
      { mes: 'Fev', acumulado: 2500.0 },
      { mes: 'Mar', acumulado: 3700.0 }
    ],
    orderSensitive: true
  },

  // ==========================================
  // EXPANSÃO: PYTHON DATA (Mais Desafios)
  // ==========================================

  // BÁSICO - PYTHON
  {
    id: 'python-b-ext-1',
    track: 'python',
    rank: 'Junior',
    title: 'Cálculo de Coluna (Apply)',
    difficulty: 'Básico',
    category: 'APPLY',
    description: "Crie uma nova coluna `total` multiplicando `qtd` por `preco`.",
    hint: "df['total'] = df['qtd'] * df['preco']",
    tableSetup: [
      "CREATE TABLE df_vendas (item TEXT, qtd INTEGER, preco REAL);",
      "INSERT INTO df_vendas VALUES ('A', 2, 10.0), ('B', 5, 5.0);"
    ],
    expectedOutput: [{ item: 'A', total: 20.0 }, { item: 'B', total: 25.0 }],
  },
  {
    id: 'python-b-ext-2',
    track: 'python',
    rank: 'Junior',
    title: 'Seleção de Colunas',
    difficulty: 'Básico',
    category: 'SELECT',
    description: "Selecione apenas as colunas `nome` e `email` do DataFrame.",
    hint: "df[['nome', 'email']]",
    tableSetup: [
      "CREATE TABLE users (id INTEGER, nome TEXT, email TEXT, senha TEXT);",
      "INSERT INTO users VALUES (1, 'Ana', 'ana@email.com', '123'), (2, 'Bob', 'bob@email.com', '456');"
    ],
    expectedOutput: [{ nome: 'Ana', email: 'ana@email.com' }, { nome: 'Bob', email: 'bob@email.com' }],
  },

  // INTERMEDIÁRIO - PYTHON
  {
    id: 'python-i-ext-1',
    track: 'python',
    rank: 'Analyst',
    title: 'Tratamento de Nulos',
    difficulty: 'Intermediário',
    category: 'FILLNA',
    description: "Use `.fillna(0)` para substituir valores nulos na coluna `score` por 0.",
    hint: "df['score'].fillna(0)",
    tableSetup: [
      "CREATE TABLE dataset (id INTEGER, score REAL);",
      "INSERT INTO dataset VALUES (1, 85.0), (2, NULL), (3, 70.0);"
    ],
    expectedOutput: [{ id: 1, score: 85.0 }, { id: 2, score: 0.0 }, { id: 3, score: 70.0 }],
  },
  {
    id: 'python-i-ext-2',
    track: 'python',
    rank: 'Analyst',
    title: 'Mudança de Tipos',
    difficulty: 'Intermediário',
    category: 'ASTYPE',
    description: "Converta a coluna numérica `id` para string (texto).",
    hint: "df['id'].astype(str)",
    tableSetup: [
      "CREATE TABLE raw_ids (id INTEGER);",
      "INSERT INTO raw_ids VALUES (101), (202);"
    ],
    expectedOutput: [{ id_str: '101' }, { id_str: '202' }],
  },

  // AVANÇADO - PYTHON
  {
    id: 'python-a-ext-1',
    track: 'python',
    rank: 'Expert',
    isFinalTest: true,
    title: 'Janelas Móveis (Rolling)',
    difficulty: 'Avançado',
    category: 'ROLLING',
    description: "Calcule uma média móvel de 2 períodos usando `.rolling(window=2).mean()`.",
    hint: "df['valor'].rolling(window=2).mean()",
    tableSetup: [
      "CREATE TABLE series (id INTEGER, valor REAL);",
      "INSERT INTO series VALUES (1, 10), (2, 20), (3, 30), (4, 40);"
    ],
    expectedOutput: [
      { id: 1, media_movel: 10.0 },
      { id: 2, media_movel: 15.0 },
      { id: 3, media_movel: 25.0 },
      { id: 4, media_movel: 35.0 }
    ],
    orderSensitive: true
  },

  // ==========================================
  // MEGA EXPANSÃO: EXCEL (JUNIOR & ANALYST)
  // ==========================================

  // JUNIOR - EXCEL
  {
    id: 'excel-b-ext-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Função SE Básica (IF)',
    difficulty: 'Básico',
    category: 'LOGIC',
    description: "Simule a função =SE(valor > 100; 'Caro'; 'Barato').",
    hint: "=SE(preco > 100; 'Caro'; 'Barato')",
    tableSetup: [
      "CREATE TABLE itens (nome TEXT, preco REAL);",
      "INSERT INTO itens VALUES ('Pneu', 250), ('Filtro', 80), ('Oleo', 120);"
    ],
    expectedOutput: [
      { nome: 'Pneu', status: 'Caro' },
      { nome: 'Filtro', status: 'Barato' },
      { nome: 'Oleo', status: 'Caro' }
    ],
  },
  {
    id: 'excel-b-ext-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Extração de Texto (ESQUERDA)',
    difficulty: 'Básico',
    category: 'TEXT',
    description: "Simule =ESQUERDA(texto; 3) para pegar o prefixo dos códigos.",
    hint: "=ESQUERDA(codigo; 3)",
    tableSetup: [
      "CREATE TABLE codigos (codigo TEXT);",
      "INSERT INTO codigos VALUES ('REF-A101'), ('SKU-B202'), ('REF-C303');"
    ],
    expectedOutput: [{ prefixo: 'REF' }, { prefixo: 'SKU' }, { prefixo: 'REF' }],
  },
  {
    id: 'excel-b-ext-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Cálculo de Dias Úteis',
    difficulty: 'Básico',
    category: 'DATE',
    description: "Use a função de data para calcular a diferença de dias entre duas datas.",
    hint: "=DIAS(data_fim; data_inicio)",
    tableSetup: [
      "CREATE TABLE prazos (tarefa TEXT, data_inicio TEXT, data_fim TEXT);",
      "INSERT INTO prazos VALUES ('Projeto A', '2023-10-01', '2023-10-10'), ('Projeto B', '2023-10-05', '2023-10-07');"
    ],
    expectedOutput: [{ tarefa: 'Projeto A', dias: 9 }, { tarefa: 'Projeto B', dias: 2 }],
  },

  // ANALYST - EXCEL
  {
    id: 'excel-i-ext-3',
    track: 'excel',
    rank: 'Analyst',
    title: 'Lógica SE com E',
    difficulty: 'Intermediário',
    category: 'LOGIC',
    description: "Classifique como 'Urgente' se prioridade for 'Alta' E o status for 'Pendente'. Caso contrário, 'Normal'.",
    hint: "=SE(E(prioridade='Alta'; status='Pendente'); 'Urgente'; 'Normal')",
    tableSetup: [
      "CREATE TABLE chamados (id INTEGER, prioridade TEXT, status TEXT);",
      "INSERT INTO chamados VALUES (1, 'Alta', 'Pendente'), (2, 'Média', 'Pendente'), (3, 'Alta', 'Resolvido');"
    ],
    expectedOutput: [
      { id: 1, classificacao: 'Urgente' },
      { id: 2, classificacao: 'Normal' },
      { id: 3, classificacao: 'Normal' }
    ],
  },
  {
    id: 'excel-i-ext-4',
    track: 'excel',
    rank: 'Analyst',
    title: 'Limpeza de Texto',
    difficulty: 'Intermediário',
    category: 'TEXT',
    description: "Use a função para remover espaços indesejados no início e fim dos nomes.",
    hint: "=ARRUMAR(nome)",
    tableSetup: [
      "CREATE TABLE sujos (nome TEXT);",
      "INSERT INTO sujos VALUES ('  Ana  '), ('  Beto'), ('Carlos  ');"
    ],
    expectedOutput: [{ nome_limpo: 'Ana' }, { nome_limpo: 'Beto' }, { nome_limpo: 'Carlos' }],
  },
  {
    id: 'excel-i-ext-5',
    track: 'excel',
    rank: 'Analyst',
    title: 'Tabela Dinâmica (Subtotal)',
    difficulty: 'Intermediário',
    category: 'GROUP BY',
    description: "Simule uma Tabela Dinâmica que soma o faturamento agrupado por Região.",
    hint: "Dica: Região em Linhas, Valor em Valores (Soma)",
    tableSetup: [
      "CREATE TABLE global_vendas (regiao TEXT, valor REAL);",
      "INSERT INTO global_vendas VALUES ('Norte', 5000), ('Norte', 2000), ('Sul', 8000), ('Leste', 3000);"
    ],
    expectedOutput: [
      { regiao: 'Leste', total: 3000 },
      { regiao: 'Norte', total: 7000 },
      { regiao: 'Sul', total: 8000 }
    ],
  },

  // ADICIONANDO MAIS EXCEL (Date, Text, Logic, Filter, Min, Max, Avg)
  
  // BÁSICO - EXCEL
  {
    id: 'excel-b-ext-6',
    track: 'excel',
    rank: 'Junior',
    title: 'Extração de Ano',
    difficulty: 'Básico',
    category: 'DATE',
    description: "Use a função =ANO() para extrair o ano das datas de venda.",
    hint: "=ANO(data_venda)",
    tableSetup: [
      "CREATE TABLE vendas_ano (id INTEGER, data_venda TEXT);",
      "INSERT INTO vendas_ano VALUES (1, '2023-05-15'), (2, '2024-02-10'), (3, '2022-12-25');"
    ],
    expectedOutput: [{ ano: '2023' }, { ano: '2024' }, { ano: '2022' }],
  },
  {
    id: 'excel-b-ext-7',
    track: 'excel',
    rank: 'Junior',
    title: 'Maiúsculas',
    difficulty: 'Básico',
    category: 'TEXT',
    description: "Converta a descrição dos produtos para letras maiúsculas usando a função apropriada.",
    hint: "=MAIÚSCULA(descricao)",
    tableSetup: [
      "CREATE TABLE prod_desc (descricao TEXT);",
      "INSERT INTO prod_desc VALUES ('mouse sem fio'), ('teclado mecanico'), ('monitor 4k');"
    ],
    expectedOutput: [{ desc_upper: 'MOUSE SEM FIO' }, { desc_upper: 'TECLADO MECANICO' }, { desc_upper: 'MONITOR 4K' }],
  },
  {
    id: 'excel-b-ext-8',
    track: 'excel',
    rank: 'Junior',
    title: 'Lógica Binária',
    difficulty: 'Básico',
    category: 'LOGIC',
    description: "Identifique se o `id` é 'Par' ou 'Ímpar' usando a lógica de resto ou funções lógicas.",
    hint: "=SE(MOD(id; 2)=0; 'Par'; 'Ímpar')",
    tableSetup: [
      "CREATE TABLE numeros (id INTEGER);",
      "INSERT INTO numeros VALUES (10), (15), (22), (33);"
    ],
    expectedOutput: [
      { id: 10, tipo: 'Par' },
      { id: 15, tipo: 'Ímpar' },
      { id: 22, tipo: 'Par' },
      { id: 33, tipo: 'Ímpar' }
    ],
  },
  {
    id: 'excel-b-ext-9',
    track: 'excel',
    rank: 'Junior',
    title: 'Filtro de Estoque',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Aplique um filtro para ver apenas o 'Setor A' com quantidade < 20.",
    hint: "Filtro: setor='Setor A', qtd < 20",
    tableSetup: [
      "CREATE TABLE prod_estoque (id INTEGER, setor TEXT, qtd INTEGER);",
      "INSERT INTO prod_estoque VALUES (1, 'Setor A', 15), (2, 'Setor B', 10), (3, 'Setor A', 50), (4, 'Setor A', 5);"
    ],
    expectedOutput: [{ id: 1, setor: 'Setor A', qtd: 15 }, { id: 4, setor: 'Setor A', qtd: 5 }],
  },
  {
    id: 'excel-b-ext-10',
    track: 'excel',
    rank: 'Junior',
    title: 'Amplitude',
    difficulty: 'Básico',
    category: 'MIN/MAX',
    description: "Calcule a diferença entre o valor Máximo e o Mínimo da lista.",
    hint: "=MÁXIMO(preco) - MÍNIMO(preco)",
    tableSetup: [
      "CREATE TABLE precos_amp (preco REAL);",
      "INSERT INTO precos_amp VALUES (10.0), (50.0), (5.0), (100.0);"
    ],
    expectedOutput: [{ amplitude: 95.0 }],
  },
  {
    id: 'excel-b-ext-11',
    track: 'excel',
    rank: 'Junior',
    title: 'Média Condicional',
    difficulty: 'Básico',
    category: 'AVG',
    description: "Calcule a média de estrelas para os produtos da categoria 'Eletrônicos'.",
    hint: "=MÉDIASE(categoria; 'Eletrônicos'; estrelas)",
    tableSetup: [
      "CREATE TABLE avaliacoes (categoria TEXT, estrelas INTEGER);",
      "INSERT INTO avaliacoes VALUES ('Eletrônicos', 5), ('Livros', 4), ('Eletrônicos', 3), ('Eletrônicos', 4);"
    ],
    expectedOutput: [{ media_estrelas: 4.0 }],
  },

  // INTERMEDIÁRIO - EXCEL
  {
    id: 'excel-i-ext-6',
    track: 'excel',
    rank: 'Analyst',
    title: 'Cálculo de Idade',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Determine a idade dos usuários com base no ano atual (2024).",
    hint: "=2024 - ANO(nascimento)",
    tableSetup: [
      "CREATE TABLE nasc (nome TEXT, nascimento TEXT);",
      "INSERT INTO nasc VALUES ('Ana', '1990-01-01'), ('Joao', '1985-05-12'), ('Bia', '2000-11-20');"
    ],
    expectedOutput: [{ nome: 'Ana', idade: 34 }, { nome: 'Joao', idade: 39 }, { nome: 'Bia', idade: 24 }],
  },
  {
    id: 'excel-i-ext-7',
    track: 'excel',
    rank: 'Analyst',
    title: 'Substituir Caracteres',
    difficulty: 'Intermediário',
    category: 'TEXT',
    description: "Troque os hífens '-' por barras '/' nas datas.",
    hint: "=SUBSTITUIR(data_texto; '-'; '/')",
    tableSetup: [
      "CREATE TABLE datas_sujas (data_texto TEXT);",
      "INSERT INTO datas_sujas VALUES ('2023-01-01'), ('2023-05-15');"
    ],
    expectedOutput: [{ data_ajustada: '2023/01/01' }, { data_ajustada: '2023/05/15' }],
  },
  {
    id: 'excel-i-ext-8',
    track: 'excel',
    rank: 'Analyst',
    title: 'Score Multinível',
    difficulty: 'Intermediário',
    category: 'LOGIC',
    description: "Classifique o score: >= 80 'Excelente', >= 50 'Bom', senão 'Melhorável'.",
    hint: "=SE(score>=80; 'Excelente'; SE(score>=50; 'Bom'; 'Melhorável'))",
    tableSetup: [
      "CREATE TABLE scores (aluno TEXT, score INTEGER);",
      "INSERT INTO scores VALUES ('Ana', 90), ('Joao', 45), ('Bia', 75);"
    ],
    expectedOutput: [
      { aluno: 'Ana', status: 'Excelente' },
      { aluno: 'Bia', status: 'Bom' },
      { aluno: 'Joao', status: 'Melhorável' }
    ],
  },
  {
    id: 'excel-i-ext-9',
    track: 'excel',
    rank: 'Analyst',
    title: 'Filtros Avançados',
    difficulty: 'Intermediário',
    category: 'FILTER',
    description: "Filtre pedidos Pagos > 1000 OU Pendentes > 5000.",
    hint: "Filtro: (status='Pago' E valor > 1000) OU (status='Pendente' E valor > 5000)",
    tableSetup: [
      "CREATE TABLE pedidos_filt (id INTEGER, status TEXT, valor REAL);",
      "INSERT INTO pedidos_filt VALUES (1, 'Pago', 1200), (2, 'Pendente', 2000), (3, 'Pendente', 6000), (4, 'Pago', 500);"
    ],
    expectedOutput: [
      { id: 1, status: 'Pago', valor: 1200 },
      { id: 3, status: 'Pendente', valor: 6000 }
    ],
  },
  {
    id: 'excel-i-ext-10',
    track: 'excel',
    rank: 'Analyst',
    title: 'Máximo por Depto',
    difficulty: 'Intermediário',
    category: 'MIN/MAX',
    description: "Obtenha o maior salário registrado para cada departamento.",
    hint: "MÁXIMOSE ou Pivot",
    tableSetup: [
      "CREATE TABLE depto_sal (nome TEXT, depto TEXT, salario REAL);",
      "INSERT INTO depto_sal VALUES ('Ana', 'TI', 5000), ('Joao', 'RH', 4000), ('Bia', 'TI', 7000), ('Leo', 'RH', 4500);"
    ],
    expectedOutput: [{ depto: 'RH', max_sal: 4500.0 }, { depto: 'TI', max_sal: 7000.0 }],
  },
  {
    id: 'excel-i-ext-11',
    track: 'excel',
    rank: 'Analyst',
    title: 'Média de Elite',
    difficulty: 'Intermediário',
    category: 'AVG',
    description: "Calcule a média de vendas de quem superou a meta de 2000.",
    hint: "=MÉDIASE(valor; '>2000')",
    tableSetup: [
      "CREATE TABLE vend_avg (vendedor TEXT, valor REAL);",
      "INSERT INTO vend_avg VALUES ('Ana', 2500), ('Joao', 1500), ('Bia', 3500), ('Leo', 1000);"
    ],
    expectedOutput: [{ media_top: 3000.0 }],
  }
];
