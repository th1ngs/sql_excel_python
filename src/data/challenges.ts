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
    description: "Para o fechamento do caixa mensal, é necessário consolidar todos os valores registrados na planilha de vendas. Utilize a função `=SOMA()` para calcular o montante total da coluna B (faturamento).",
    hint: "No Excel, você pode somar uma coluna inteira ou um intervalo. Tente usar `=SOMA(B2:B4)` ou apenas `=SOMA(B)`.",
    tableSetup: [
      "CREATE TABLE planilha_vendas (id INTEGER, faturamento REAL);",
      "INSERT INTO planilha_vendas VALUES (1, 1200.50), (2, 450.00), (3, 890.30);"
    ],
    expectedOutput: [{ total: 2540.8 }],
    initialQuery: '=SOMA(B:B)'
  },
  {
    id: 'excel-b-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Cálculo de Desempenho: Média Acadêmica',
    difficulty: 'Básico',
    category: 'AVERAGE',
    description: "O conselho de classe precisa calcular a média aritmética final dos estudantes. Aplique a função `=MÉDIA()` na coluna B (nota) para encontrar a pontuação média da turma.",
    hint: "A função MÉDIA (ou AVERAGE) do Excel calcula o valor médio de um intervalo de células. Tente `=MÉDIA(B2:B4)`.",
    tableSetup: [
      "CREATE TABLE notas (aluno TEXT, nota REAL);",
      "INSERT INTO notas VALUES ('Igor', 8), ('Julia', 10), ('Kiko', 6);"
    ],
    expectedOutput: [{ media: 8 }],
    initialQuery: '=MÉDIA(B:B)'
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
    initialQuery: "df[df['idade'] > 18]"
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
    initialQuery: 'df.head(2)',
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
    initialQuery: "df['tags'].str.strip().str.upper()"
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
    description: "O gerente de vendas deseja monitorar itens de alto ticket médio. Baseando-se na função `=CONT.SE()`, conte quantos produtos na coluna B (preco) possuem um valor superior a 100.",
    hint: "A função CONT.SE(intervalo; critério) é usada para contar células que atendem a um requisito. Tente `=CONT.SE(B:B; \">100\")`.",
    tableSetup: [
      "CREATE TABLE estoque (produto TEXT, preco REAL);",
      "INSERT INTO estoque VALUES ('Monitor', 500), ('Mouse', 45), ('Teclado', 120), ('Cabo', 15);"
    ],
    expectedOutput: [{ contagem: 2 }],
    initialQuery: '=CONT.SE(B:B; ">100")'
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
    description: "Calcule a soma de todos os `pontos` registrados na coluna B da tabela de `jogadores`.",
    hint: "Use Column B (pontos). Exemplo: `=SOMA(B:B)` ou `=SOMA(B2:B4)`.",
    tableSetup: [
      "CREATE TABLE jogadores (nome TEXT, pontos INTEGER);",
      "INSERT INTO jogadores VALUES ('A', 100), ('B', 200), ('C', 150);"
    ],
    expectedOutput: [{ total: 450 }],
    initialQuery: '=SOMA(B:B)'
  },
  {
    id: 'excel-b-s2',
    track: 'excel',
    rank: 'Junior',
    title: 'Gasto Mensal',
    difficulty: 'Básico',
    category: 'SOMA',
    description: "Some todos os `valores` da coluna B na tabela `despesas`.",
    hint: "Referencie a coluna B. Exemplo: `=SOMA(B:B)`.",
    tableSetup: [
      "CREATE TABLE despesas (id INTEGER, valores REAL);",
      "INSERT INTO despesas VALUES (1, 50.25), (2, 30.00), (3, 20.75);"
    ],
    expectedOutput: [{ total: 101.0 }],
    initialQuery: '=SOMA(B:B)'
  },
  {
    id: 'excel-b-s3',
    track: 'excel',
    rank: 'Junior',
    title: 'Total de Inscritos',
    difficulty: 'Básico',
    category: 'SOMA',
    description: "Calcule o total de inscrições somando a coluna B (`quantidade`).",
    hint: "Utilize a função `=SOMA(B:B)`.",
    tableSetup: [
      "CREATE TABLE inscritos (curso TEXT, quantidade INTEGER);",
      "INSERT INTO inscritos VALUES ('Excel', 150), ('Python', 80);"
    ],
    expectedOutput: [{ total: 230 }],
    initialQuery: '=SOMA(B:B)'
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
    description: "Para um relatório de média de vendas, utilize a função `=MÉDIA()` na coluna B.",
    hint: "A função MÉDIA no Excel aceita um intervalo. Tente `=MÉDIA(B2:B4)`.",
    tableSetup: [
      "CREATE TABLE diario (data TEXT, vendas REAL);",
      "INSERT INTO diario VALUES ('Seg', 1000), ('Ter', 1500), ('Qua', 1100);"
    ],
    expectedOutput: [{ media: 1200.0 }],
    initialQuery: '=MÉDIA(B:B)'
  },
  {
    id: 'excel-b-av3',
    track: 'excel',
    rank: 'Junior',
    title: 'Média de Idade',
    difficulty: 'Básico',
    category: 'AVERAGE',
    description: "Calcule a média de idade dos alunos na coluna B.",
    hint: "Use `=MÉDIA(B:B)` para processar a coluna de idade.",
    tableSetup: [
      "CREATE TABLE alunos (nome TEXT, idade INTEGER);",
      "INSERT INTO alunos VALUES ('A', 20), ('B', 30), ('C', 25);"
    ],
    expectedOutput: [{ media: 25.0 }],
    initialQuery: '=MÉDIA(B:B)'
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
    initialQuery: '=SOMASES(D:D; B:B; "Sul"; C:C; "Pago")'
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
    description: "Identifique o menor e o maior nível de estoque nas colunas da tabela. Utilize as funções `=MÍN()` e `=MÁX()` na coluna B.",
    hint: "Use `=MÍNIMO(B:B)` e `=MÁXIMO(B:B)` para capturar os extremos do intervalo.",
    tableSetup: [
      "CREATE TABLE estoque (item TEXT, qtd INTEGER);",
      "INSERT INTO estoque VALUES ('A', 10), ('B', 50), ('C', 5), ('D', 100);"
    ],
    expectedOutput: [{ menor: 5, maior: 100 }],
    initialQuery: '=MÁXIMO(B:B)'
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
    initialQuery: '=MÉDIASE(B:B; "Marketing"; C:C)'
  },
  {
    id: 'excel-i-ext-2',
    track: 'excel',
    rank: 'Analyst',
    title: 'Arredondamento de Valores',
    difficulty: 'Intermediário',
    category: 'ROUND',
    description: "Para padronizar os relatórios, arredonde os preços da coluna B para apenas 1 casa decimal utilizando `=ARRED()`.",
    hint: "A função ARRED(valor; num_digitos) é essencial para limpeza de dados financeiros. Tente `=ARRED(B:B; 1)`.",
    tableSetup: [
      "CREATE TABLE precos_quebrados (item TEXT, preco REAL);",
      "INSERT INTO precos_quebrados VALUES ('A', 10.556), ('B', 19.123), ('C', 5.789);"
    ],
    expectedOutput: [{ item: 'A', preco: 10.6 }, { item: 'B', preco: 19.1 }, { item: 'C', preco: 5.8 }],
    initialQuery: '=ARRED(B:B; 1)'
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
    description: "Classifique os produtos baseando-se no preço (coluna B). Utilize a função `=SE()` para retornar 'Caro' se o valor for superior a 100, caso contrário, retorne 'Barato'.",
    hint: "Lembre-se da estrutura: `=SE(B2 > 100; \"Caro\"; \"Barato\")`. A lógica condicional é o coração do Excel.",
    tableSetup: [
      "CREATE TABLE itens (nome TEXT, preco REAL);",
      "INSERT INTO itens VALUES ('Pneu', 250), ('Filtro', 80), ('Oleo', 120);"
    ],
    expectedOutput: [
      { nome: 'Pneu', status: 'Caro' },
      { nome: 'Filtro', status: 'Barato' },
      { nome: 'Oleo', status: 'Caro' }
    ],
    initialQuery: '=SE(B:B > 100; "Caro"; "Barato")'
  },
  {
    id: 'excel-b-ext-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Extração de Texto (ESQUERDA)',
    difficulty: 'Básico',
    category: 'TEXT',
    description: "Extraia os 3 primeiros caracteres da coluna A (código) para identificar o fornecedor utilizando a função `=ESQUERDA()`.",
    hint: "Functions de texto como `=ESQUERDA(A:A; 3)` permitem fatiar cadeias de caracteres de forma eficiente.",
    tableSetup: [
      "CREATE TABLE codigos (codigo TEXT);",
      "INSERT INTO codigos VALUES ('REF-A101'), ('SKU-B202'), ('REF-C303');"
    ],
    expectedOutput: [{ prefixo: 'REF' }, { prefixo: 'SKU' }, { prefixo: 'REF' }],
    initialQuery: '=ESQUERDA(A:A; 3)'
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
    initialQuery: '=SE(E(B:B="Alta"; C:C="Pendente"); "Urgente"; "Normal")'
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
    description: "O time de BI precisa monitorar a sazonalidade por ano. Extraia o ano da coluna B (data_venda) utilizando a função `=ANO()`.",
    hint: "A função `=ANO(B:B)` extrai a parte do ano de uma célula com formato de data reconhecido.",
    tableSetup: [
      "CREATE TABLE vendas_ano (id INTEGER, data_venda TEXT);",
      "INSERT INTO vendas_ano VALUES (1, '2023-05-15'), (2, '2024-02-10'), (3, '2022-12-25');"
    ],
    expectedOutput: [{ ano: '2023' }, { ano: '2024' }, { ano: '2022' }],
    initialQuery: '=ANO(B:B)'
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
  },
  // SQL EXPANSÃO ADICIONAL (Para completar 50B, 30I, 20A)
  // BÁSICO - SQL (B-EXT)
  {
    id: 'sql-b-ext-10',
    track: 'sql',
    rank: 'Junior',
    title: 'Filtragem por Faixa Salarial',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "Identifique os colaboradores que recebem entre 5.000 e 8.000 para análise de orçamento.",
    hint: "Use o operador BETWEEN ou >= e <=.",
    tableSetup: ["CREATE TABLE salarios (nome TEXT, valor REAL);", "INSERT INTO salarios VALUES ('A', 4500), ('B', 5500), ('C', 7500), ('D', 9000);"],
    expectedOutput: [{ nome: 'B', valor: 5500 }, { nome: 'C', valor: 7500 }],
    initialQuery: 'SELECT * FROM salarios'
  },
  {
    id: 'sql-b-ext-11',
    track: 'sql',
    rank: 'Junior',
    title: 'Busca por Departamento Específico',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "Recupere apenas os funcionários que pertencem ao departamento 'TI' ou 'RH'.",
    hint: "Use o operador IN ('TI', 'RH').",
    tableSetup: ["CREATE TABLE deptos (nome TEXT, depto TEXT);", "INSERT INTO deptos VALUES ('Ana', 'TI'), ('Joao', 'Vendas'), ('Beatriz', 'RH');"],
    expectedOutput: [{ nome: 'Ana', depto: 'TI' }, { nome: 'Beatriz', depto: 'RH' }],
    initialQuery: 'SELECT * FROM deptos'
  },
  {
    id: 'sql-b-ext-12',
    track: 'sql',
    rank: 'Junior',
    title: 'Contagem de Serviços Ativos',
    difficulty: 'Básico',
    category: 'COUNT',
    description: "Conte quantos serviços na tabela `servicos` estão com o status 'Ativo'.",
    hint: "COUNT(*) com um filtro WHERE.",
    tableSetup: ["CREATE TABLE servicos (servico TEXT, status TEXT);", "INSERT INTO servicos VALUES ('Cloud', 'Ativo'), ('Local', 'Inativo'), ('Backup', 'Ativo');"],
    expectedOutput: [{ total: 2 }],
    initialQuery: 'SELECT COUNT(*) as total FROM servicos'
  },
  {
    id: 'sql-b-ext-13',
    track: 'sql',
    rank: 'Junior',
    title: 'Soma de Volume de Vendas',
    difficulty: 'Básico',
    category: 'SUM',
    description: "Calcule o volume total de vendas da semana.",
    hint: "Use a função SUM(valor).",
    tableSetup: ["CREATE TABLE vendas_s (dia TEXT, valor REAL);", "INSERT INTO vendas_s VALUES ('Seg', 1500.50), ('Ter', 1200.00), ('Qua', 1800.75);"],
    expectedOutput: [{ total_semanal: 4501.25 }],
    initialQuery: 'SELECT SUM(valor) as total_semanal FROM vendas_s'
  },
  {
    id: 'sql-b-ext-14',
    track: 'sql',
    rank: 'Junior',
    title: 'Valor Mínimo Disponível',
    difficulty: 'Básico',
    category: 'MIN',
    description: "Encontre o menor preço unitário na tabela de produtos.",
    hint: "Use MIN(preco).",
    tableSetup: ["CREATE TABLE prod_m (nome TEXT, preco REAL);", "INSERT INTO prod_m VALUES ('A', 19.90), ('B', 5.50), ('C', 12.00);"],
    expectedOutput: [{ menor_preco: 5.50 }],
    initialQuery: 'SELECT MIN(preco) as menor_preco FROM prod_m'
  },
  {
    id: 'sql-b-ext-15',
    track: 'sql',
    rank: 'Junior',
    title: 'Valor Máximo de Transação',
    difficulty: 'Básico',
    category: 'MAX',
    description: "Busque o maior valor de transação registrado no sistema.",
    hint: "Use MAX(valor).",
    tableSetup: ["CREATE TABLE trans (id INTEGER, valor REAL);", "INSERT INTO trans VALUES (1, 5000), (2, 8500), (3, 2200);"],
    expectedOutput: [{ maior_transacao: 8500.0 }],
    initialQuery: 'SELECT MAX(valor) as maior_transacao FROM trans'
  },
  {
    id: 'sql-b-ext-16',
    track: 'sql',
    rank: 'Junior',
    title: 'Média de Avaliações',
    difficulty: 'Básico',
    category: 'AVG',
    description: "Determine a média de estrelas recebidas pelos produtos.",
    hint: "Use AVG(estrelas).",
    tableSetup: ["CREATE TABLE rating (prod TEXT, estrelas INTEGER);", "INSERT INTO rating VALUES ('A', 4), ('B', 5), ('C', 3);"],
    expectedOutput: [{ media_rating: 4.0 }],
    initialQuery: 'SELECT AVG(estrelas) as media_rating FROM rating'
  },
  {
    id: 'sql-b-ext-17',
    track: 'sql',
    rank: 'Junior',
    title: 'Nomes que Começam com L',
    difficulty: 'Básico',
    category: 'LIKE',
    description: "Selecione todos os funcionários cujos nomes começam com a letra 'L'.",
    hint: "WHERE nome LIKE 'L%'",
    tableSetup: ["CREATE TABLE lista (nome TEXT);", "INSERT INTO lista VALUES ('Lucas'), ('Lara'), ('Beatriz'), ('Leonardo');"],
    expectedOutput: [{ nome: 'Lucas' }, { nome: 'Lara' }, { nome: 'Leonardo' }],
    initialQuery: 'SELECT * FROM lista'
  },
  {
    id: 'sql-b-ext-18',
    track: 'sql',
    rank: 'Junior',
    title: 'Produtos sem Estoque',
    difficulty: 'Básico',
    category: 'IS NULL',
    description: "Encontre produtos que têm a coluna `estoque` vazia (NULL).",
    hint: "WHERE estoque IS NULL",
    tableSetup: ["CREATE TABLE armazem (nome TEXT, estoque INTEGER);", "INSERT INTO armazem VALUES ('Papel', NULL), ('Lápis', 100), ('Caneta', NULL);"],
    expectedOutput: [{ nome: 'Papel' }, { nome: 'Caneta' }],
    initialQuery: 'SELECT nome FROM armazem'
  },
  {
    id: 'sql-b-ext-19',
    track: 'sql',
    rank: 'Junior',
    title: 'Ordenação por Data',
    difficulty: 'Básico',
    category: 'ORDER BY',
    description: "Liste os eventos do mais antigo para o mais recente.",
    hint: "ORDER BY data_evento ASC",
    tableSetup: ["CREATE TABLE eventos (evento TEXT, data_evento TEXT);", "INSERT INTO eventos VALUES ('Show', '2023-01-01'), ('Webinar', '2022-12-01'), ('Meetup', '2023-05-01');"],
    expectedOutput: [{ evento: 'Webinar', data_evento: '2022-12-01' }, { evento: 'Show', data_evento: '2023-01-01' }, { evento: 'Meetup', data_evento: '2023-05-01' }],
    initialQuery: 'SELECT * FROM eventos',
    orderSensitive: true
  },
  {
    id: 'sql-b-ext-20',
    track: 'sql',
    rank: 'Junior',
    title: 'Agrupamento Simples por País',
    difficulty: 'Básico',
    category: 'GROUP BY',
    description: "Conte quantos clientes temos em cada país.",
    hint: "GROUP BY pais",
    tableSetup: ["CREATE TABLE clientes_p (nome TEXT, pais TEXT);", "INSERT INTO clientes_p VALUES ('A', 'Bra'), ('B', 'Usa'), ('C', 'Bra');"],
    expectedOutput: [{ pais: 'Bra', total: 2 }, { pais: 'Usa', total: 1 }],
    initialQuery: 'SELECT pais, COUNT(*) as total FROM clientes_p GROUP BY pais'
  },
  {
    id: 'sql-b-ext-21',
    track: 'sql',
    rank: 'Junior',
    title: 'Limitação de Resultados',
    difficulty: 'Básico',
    category: 'LIMIT',
    description: "Mostre apenas os primeiros 2 registros da tabela de logs.",
    hint: "LIMIT 2",
    tableSetup: ["CREATE TABLE logs_l (msg TEXT);", "INSERT INTO logs_l VALUES ('Erro 1'), ('Erro 2'), ('Sucesso'), ('Erro 3');"],
    expectedOutput: [{ msg: 'Erro 1' }, { msg: 'Erro 2' }],
    initialQuery: 'SELECT * FROM logs_l',
    orderSensitive: true
  },
  {
    id: 'sql-b-ext-22',
    track: 'sql',
    rank: 'Junior',
    title: 'Cálculo de Desconto',
    difficulty: 'Básico',
    category: 'SELECT',
    description: "Apresente o nome do produto e o preço com 10% de desconto (preco * 0.9).",
    hint: "Selecione preco * 0.9 as preco_final.",
    tableSetup: ["CREATE TABLE promo (nome TEXT, preco REAL);", "INSERT INTO promo VALUES ('Teclado', 100), ('Mouse', 50);"],
    expectedOutput: [{ nome: 'Teclado', preco_final: 90.0 }, { nome: 'Mouse', preco_final: 45.0 }],
    initialQuery: 'SELECT nome, preco * 0.9 as preco_final FROM promo'
  },
  {
    id: 'sql-b-ext-23',
    track: 'sql',
    rank: 'Junior',
    title: 'Filtro por Ano de Nascimento',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "Selecione usuários que nasceram a partir do ano 2000.",
    hint: "WHERE nascimento >= '2000-01-01'",
    tableSetup: ["CREATE TABLE users_n (nome TEXT, nascimento TEXT);", "INSERT INTO users_n VALUES ('Vovó', '1950-01-01'), ('Neto', '2005-05-15'), ('Filho', '2000-01-01');"],
    expectedOutput: [{ nome: 'Neto', nascimento: '2005-05-15' }, { nome: 'Filho', nascimento: '2000-01-01' }],
    initialQuery: 'SELECT * FROM users_n'
  },
  {
    id: 'sql-b-ext-24',
    track: 'sql',
    rank: 'Junior',
    title: 'Filtragem por Texto Parcial',
    difficulty: 'Básico',
    category: 'LIKE',
    description: "Busque logs que contenham a palavra 'Falha' em qualquer posição.",
    hint: "LIKE '%Falha%'",
    tableSetup: ["CREATE TABLE logs_s (txt TEXT);", "INSERT INTO logs_s VALUES ('Relatório: Sucesso'), ('Falha de Conexão'), ('Sucesso total'), ('Nova Falha');"],
    expectedOutput: [{ txt: 'Falha de Conexão' }, { txt: 'Nova Falha' }],
    initialQuery: 'SELECT * FROM logs_s'
  },
  {
    id: 'sql-b-ext-25',
    track: 'sql',
    rank: 'Junior',
    title: 'Combinando WHERE e ORDER BY',
    difficulty: 'Básico',
    category: 'ORDER BY',
    description: "Liste os funcionários ativos em ordem alfabética.",
    hint: "WHERE status = 'Ativo' ORDER BY nome ASC",
    tableSetup: ["CREATE TABLE emp (nome TEXT, status TEXT);", "INSERT INTO emp VALUES ('Zeca', 'Ativo'), ('Abel', 'Inativo'), ('Bia', 'Ativo');"],
    expectedOutput: [{ nome: 'Bia', status: 'Ativo' }, { nome: 'Zeca', status: 'Ativo' }],
    initialQuery: 'SELECT * FROM emp',
    orderSensitive: true
  },
  {
    id: 'sql-b-ext-26',
    track: 'sql',
    rank: 'Junior',
    title: 'Cálculo de Projeção de Estoque',
    difficulty: 'Básico',
    category: 'SELECT',
    description: "Projete o estoque final se cada item for vendido 5 vezes (estoque - 5).",
    hint: "Selecione estoque - 5.",
    tableSetup: ["CREATE TABLE stock_p (item TEXT, estoque INTEGER);", "INSERT INTO stock_p VALUES ('A', 10), ('B', 20);"],
    expectedOutput: [{ item: 'A', projecao: 5 }, { item: 'B', projecao: 15 }],
    initialQuery: 'SELECT item, estoque - 5 as projecao FROM stock_p'
  },
  {
    id: 'sql-b-ext-27',
    track: 'sql',
    rank: 'Junior',
    title: 'Filtro por Valor Diferente',
    difficulty: 'Básico',
    category: 'WHERE',
    description: "Selecione todos os usuários que NÃO são de 'Curitiba'.",
    hint: "Use != ou <>.",
    tableSetup: ["CREATE TABLE loc (nome TEXT, cidade TEXT);", "INSERT INTO loc VALUES ('Ana', 'SP'), ('Beto', 'Curitiba'), ('Caio', 'RJ');"],
    expectedOutput: [{ nome: 'Ana', cidade: 'SP' }, { nome: 'Caio', cidade: 'RJ' }],
    initialQuery: 'SELECT * FROM loc'
  },
  {
    id: 'sql-b-ext-28',
    track: 'sql',
    rank: 'Junior',
    title: 'Distinct de Cargos',
    difficulty: 'Básico',
    category: 'DISTINCT',
    description: "Quais são os diferentes cargos cadastrados na tabela sem repetições?",
    hint: "SELECT DISTINCT cargo FROM ...",
    tableSetup: ["CREATE TABLE staff (nome TEXT, cargo TEXT);", "INSERT INTO staff VALUES ('A', 'Analista'), ('B', 'Dev'), ('C', 'Analista');"],
    expectedOutput: [{ cargo: 'Analista' }, { cargo: 'Dev' }],
    initialQuery: 'SELECT cargo FROM staff'
  },

  // INTERMEDIÁRIO - SQL (I-EXT)
  {
    id: 'sql-i-ext-10',
    track: 'sql',
    rank: 'Analyst',
    title: 'Junção de Vendas e Regiões',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Cruze a tabela `vendas` com `regioes` para mostrar o nome da região e o lucro total daquela venda.",
    hint: "JOIN regioes ON vendas.rid = regioes.id",
    tableSetup: ["CREATE TABLE vendas (rid INTEGER, lucro REAL);", "CREATE TABLE regioes (id INTEGER, nome TEXT);", "INSERT INTO vendas VALUES (1, 100), (2, 50);", "INSERT INTO regioes VALUES (1, 'Sul'), (2, 'Norte');"],
    expectedOutput: [{ nome: 'Sul', lucro: 100.0 }, { nome: 'Norte', lucro: 50.0 }],
    initialQuery: 'SELECT r.nome, v.lucro FROM vendas v JOIN regioes r ON v.rid = r.id'
  },
  {
    id: 'sql-i-ext-11',
    track: 'sql',
    rank: 'Analyst',
    title: 'Agrupamento com Filtro HAVING',
    difficulty: 'Intermediário',
    category: 'HAVING',
    description: "Mostre as categorias que possuem uma média de preço superior a 50.",
    hint: "GROUP BY categoria HAVING AVG(preco) > 50",
    tableSetup: ["CREATE TABLE prod_c (cat TEXT, preco REAL);", "INSERT INTO prod_c VALUES ('TI', 100), ('TI', 80), ('Home', 20), ('Home', 30);"],
    expectedOutput: [{ cat: 'TI', media: 90.0 }],
    initialQuery: 'SELECT cat, AVG(preco) as media FROM prod_c GROUP BY cat'
  },
  {
    id: 'sql-i-ext-12',
    track: 'sql',
    rank: 'Analyst',
    title: 'Subquery de Comparação',
    difficulty: 'Intermediário',
    category: 'SUBQUERY',
    description: "Encontre os funcionários que ganham mais que a média da empresa.",
    hint: "WHERE salario > (SELECT AVG(salario) FROM ...)",
    tableSetup: ["CREATE TABLE staff_s (nome TEXT, salario REAL);", "INSERT INTO staff_s VALUES ('A', 3000), ('B', 5000), ('C', 4000);"],
    expectedOutput: [{ nome: 'B', salario: 5000.0 }],
    initialQuery: 'SELECT * FROM staff_s WHERE salario > (SELECT AVG(salario) FROM staff_s)'
  },
  {
    id: 'sql-i-ext-13',
    track: 'sql',
    rank: 'Analyst',
    title: 'Case When para Níveis de Risco',
    difficulty: 'Intermediário',
    category: 'CASE',
    description: "Crie uma coluna `risco` baseada no saldo: < 0 'Crítico', < 1000 'Alerta', senão 'Seguro'.",
    hint: "CASE WHEN saldo < 0 THEN 'Crítico' ...",
    tableSetup: ["CREATE TABLE contas (id INTEGER, saldo REAL);", "INSERT INTO contas VALUES (1, -50), (2, 500), (3, 2000);"],
    expectedOutput: [{ id: 1, risco: 'Crítico' }, { id: 2, risco: 'Alerta' }, { id: 3, risco: 'Seguro' }],
    initialQuery: 'SELECT id FROM contas'
  },
  {
    id: 'sql-i-ext-14',
    track: 'sql',
    rank: 'Analyst',
    title: 'Junção Múltipla (3 Tabelas)',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Una Pedidos, Itens e Produtos para trazer o nome do produto vendido em cada pedido.",
    hint: "Faça dois JOINs sucessivos.",
    tableSetup: ["CREATE TABLE pedidos (id INTEGER);", "CREATE TABLE itens (pid INTEGER, prid INTEGER);", "CREATE TABLE prod (id INTEGER, nome TEXT);", "INSERT INTO pedidos VALUES (10);", "INSERT INTO itens VALUES (10, 1);", "INSERT INTO prod VALUES (1, 'Monitor');"],
    expectedOutput: [{ id: 10, nome: 'Monitor' }],
    initialQuery: 'SELECT p.id, pr.nome FROM pedidos p'
  },
  {
    id: 'sql-i-ext-15',
    track: 'sql',
    rank: 'Analyst',
    title: 'Contagem com Filtro de Grupo',
    difficulty: 'Intermediário',
    category: 'HAVING',
    description: "Liste os clientes (ids) que realizaram mais de 1 pedido.",
    hint: "GROUP BY cliente_id HAVING COUNT(*) > 1",
    tableSetup: ["CREATE TABLE ordens (id INTEGER, cid INTEGER);", "INSERT INTO ordens VALUES (1, 101), (2, 101), (3, 102);"],
    expectedOutput: [{ cid: 101, total: 2 }],
    initialQuery: 'SELECT cid, COUNT(*) as total FROM ordens GROUP BY cid'
  },
  {
    id: 'sql-i-ext-16',
    track: 'sql',
    rank: 'Analyst',
    title: 'Data Truncation (Apenas Mês)',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Extraia o mês da coluna data e agrupe o faturamento por mês.",
    hint: "Use STRFTIME('%m', data) no SQLite.",
    tableSetup: ["CREATE TABLE hist (data TEXT, valor REAL);", "INSERT INTO hist VALUES ('2023-01-05', 100), ('2023-01-20', 200), ('2023-02-10', 500);"],
    expectedOutput: [{ mes: '01', total: 300.0 }, { mes: '02', total: 500.0 }],
    initialQuery: "SELECT STRFTIME('%m', data) as mes, SUM(valor) as total FROM hist GROUP BY mes"
  },
  {
    id: 'sql-i-ext-17',
    track: 'sql',
    rank: 'Analyst',
    title: 'Union All: Consolidando Tabelas',
    difficulty: 'Intermediário',
    category: 'UNION',
    description: "Consolide os nomes das tabelas `leads_sul` e `leads_norte` em uma única lista.",
    hint: "SELECT nome FROM leads_sul UNION ALL SELECT nome FROM leads_norte",
    tableSetup: ["CREATE TABLE leads_sul (nome TEXT);", "CREATE TABLE leads_norte (nome TEXT);", "INSERT INTO leads_sul VALUES ('Ana');", "INSERT INTO leads_norte VALUES ('Bob');"],
    expectedOutput: [{ nome: 'Ana' }, { nome: 'Bob' }],
    initialQuery: 'SELECT nome FROM leads_sul'
  },
  {
    id: 'sql-i-ext-18',
    track: 'sql',
    rank: 'Analyst',
    title: 'Subquery Correlacionada',
    difficulty: 'Intermediário',
    category: 'SUBQUERY',
    description: "Para cada cargo, mostre o funcionário que ganha o maior salário.",
    hint: "Filtre onde salario = (SELECT MAX(salario) FROM ... WHERE cargo = externo.cargo)",
    tableSetup: ["CREATE TABLE staff_c (nome TEXT, cargo TEXT, sal REAL);", "INSERT INTO staff_c VALUES ('Ana', 'Dev', 5000), ('Bob', 'Dev', 6000), ('Zeca', 'RH', 4000);"],
    expectedOutput: [{ nome: 'Bob', cargo: 'Dev', sal: 6000.0 }, { nome: 'Zeca', cargo: 'RH', sal: 4000.0 }],
    initialQuery: 'SELECT * FROM staff_c s1'
  },
  {
    id: 'sql-i-ext-19',
    track: 'sql',
    rank: 'Analyst',
    title: 'Cálculo de Percentual por Grupo',
    difficulty: 'Intermediário',
    category: 'WINDOW',
    description: "Calcule a soma acumulada de vendas.",
    hint: "SUM(valor) OVER (ORDER BY data)",
    tableSetup: ["CREATE TABLE vendas_w (data TEXT, valor REAL);", "INSERT INTO vendas_w VALUES ('2023-01-01', 100), ('2023-01-02', 150), ('2023-01-03', 50);"],
    expectedOutput: [{ data: '2023-01-01', acum: 100.0 }, { data: '2023-01-02', acum: 250.0 }, { data: '2023-01-03', acum: 300.0 }],
    initialQuery: 'SELECT data, SUM(valor) OVER (ORDER BY data) as acum FROM vendas_w',
    orderSensitive: true
  },
  {
    id: 'sql-i-ext-20',
    track: 'sql',
    rank: 'Analyst',
    title: 'Self-Join: Hierarquia',
    difficulty: 'Intermediário',
    category: 'JOIN',
    description: "Mostre o nome do funcionário e o nome do seu gestor.",
    hint: "JOIN staff s2 ON s1.gestor_id = s2.id",
    tableSetup: ["CREATE TABLE staff_h (id INTEGER, nome TEXT, gestor_id INTEGER);", "INSERT INTO staff_h VALUES (1, 'Diretor', NULL), (2, 'Analista', 1);"],
    expectedOutput: [{ f: 'Analista', g: 'Diretor' }],
    initialQuery: 'SELECT s1.nome as f, s2.nome as g FROM staff_h s1'
  },
  {
    id: 'sql-i-ext-21',
    track: 'sql',
    rank: 'Analyst',
    title: 'Replace e Concatenação',
    difficulty: 'Intermediário',
    category: 'TEXT',
    description: "Formate o código: Troque 'ID_' por '' e adicione 'REF-' no início.",
    hint: "'REF-' || REPLACE(code, 'ID_', '')",
    tableSetup: ["CREATE TABLE codes_t (code TEXT);", "INSERT INTO codes_t VALUES ('ID_123'), ('ID_456');"],
    expectedOutput: [{ novo: 'REF-123' }, { novo: 'REF-456' }],
    initialQuery: 'SELECT code FROM codes_t'
  },
  {
    id: 'sql-i-ext-22',
    track: 'sql',
    rank: 'Analyst',
    title: 'Filtro por Comprimento de String',
    difficulty: 'Intermediário',
    category: 'WHERE',
    description: "Selecione apenas registros onde o login possui mais de 5 caracteres.",
    hint: "LENGTH(login) > 5",
    tableSetup: ["CREATE TABLE login_t (login TEXT);", "INSERT INTO login_t VALUES ('ana'), ('beatriz'), ('carlos');"],
    expectedOutput: [{ login: 'beatriz' }, { login: 'carlos' }],
    initialQuery: 'SELECT * FROM login_t'
  },

  // AVANÇADO - SQL (A-EXT)
  {
    id: 'sql-a-ext-10',
    track: 'sql',
    rank: 'Expert',
    title: 'Ranking de Vendas por Vendedor',
    difficulty: 'Avançado',
    category: 'WINDOW',
    description: "Crie um ranking (RANK) dos vendedores baseado no volume de vendas.",
    hint: "RANK() OVER (ORDER BY valor DESC)",
    tableSetup: ["CREATE TABLE vend_rank (nome TEXT, valor REAL);", "INSERT INTO vend_rank VALUES ('A', 1000), ('B', 5000), ('C', 3000);"],
    expectedOutput: [{ nome: 'B', rnk: 1 }, { nome: 'C', rnk: 2 }, { nome: 'A', rnk: 3 }],
    initialQuery: 'SELECT nome, RANK() OVER (ORDER BY valor DESC) as rnk FROM vend_rank'
  },
  {
    id: 'sql-a-ext-11',
    track: 'sql',
    rank: 'Expert',
    title: 'Análise de Média Móvel',
    difficulty: 'Avançado',
    category: 'WINDOW',
    description: "Calcule a média móvel de lucro considerando a linha atual e a anterior.",
    hint: "AVG(lucro) OVER (ORDER BY id ROWS BETWEEN 1 PRECEDING AND CURRENT ROW)",
    tableSetup: ["CREATE TABLE series (id INTEGER, lucro REAL);", "INSERT INTO series VALUES (1, 100), (2, 200), (3, 300);"],
    expectedOutput: [{ id: 1, m_movel: 100.0 }, { id: 2, m_movel: 150.0 }, { id: 3, m_movel: 250.0 }],
    initialQuery: 'SELECT id FROM series',
    orderSensitive: true
  },
  {
    id: 'sql-a-ext-12',
    track: 'sql',
    rank: 'Expert',
    title: 'CTE de Performance Comparativa',
    difficulty: 'Avançado',
    category: 'CTE',
    description: "Use um WITH para calcular a média e mostre a diferença de cada salário em relação a essa média.",
    hint: "WITH avg_sal AS (SELECT AVG(salario) as av FROM ...) SELECT nome, salario - (SELECT av FROM avg_sal) as diff ...",
    tableSetup: ["CREATE TABLE salaries (nome TEXT, salario REAL);", "INSERT INTO salaries VALUES ('A', 5000), ('B', 3000);"],
    expectedOutput: [{ nome: 'A', diff: 1000.0 }, { nome: 'B', diff: -1000.0 }],
    initialQuery: 'SELECT nome FROM salaries'
  },
  {
    id: 'sql-a-ext-13',
    track: 'sql',
    rank: 'Expert',
    title: 'Cálculo de Churn Rate (Lógica)',
    difficulty: 'Avançado',
    category: 'EXP',
    description: "Determine a taxa de retenção comparando o total de clientes ativos vs inativos em uma única linha.",
    hint: "Use subqueries ou CASE aggregation.",
    tableSetup: ["CREATE TABLE c_status (id INTEGER, ativo INTEGER);", "INSERT INTO c_status VALUES (1, 1), (2, 1), (3, 0), (4, 1);"],
    expectedOutput: [{ taxa: 0.75 }],
    initialQuery: 'SELECT CAST(SUM(ativo) AS REAL) / COUNT(*) as taxa FROM c_status'
  },
  {
    id: 'sql-a-ext-14',
    track: 'sql',
    rank: 'Expert',
    title: 'Detecção de Outliers',
    difficulty: 'Avançado',
    category: 'MATH',
    description: "Identifique valores que estão a mais de 2x o desvio padrão da média (Simulado).",
    hint: "Use cálculos matemáticos de variância.",
    tableSetup: ["CREATE TABLE obs (val REAL);", "INSERT INTO obs VALUES (10), (12), (10), (500);"],
    expectedOutput: [{ val: 500.0 }],
    initialQuery: 'SELECT val FROM obs WHERE val > (SELECT AVG(val) * 2 FROM obs)'
  },
  {
    id: 'sql-a-ext-15',
    track: 'sql',
    rank: 'Expert',
    title: 'Explosão de Dados (Cross Join)',
    difficulty: 'Avançado',
    category: 'JOIN',
    description: "Gere todas as combinações possíveis de Cores e Tamanhos.",
    hint: "CROSS JOIN",
    tableSetup: ["CREATE TABLE cores (c TEXT);", "CREATE TABLE tamanhos (t TEXT);", "INSERT INTO cores VALUES ('R'), ('B');", "INSERT INTO tamanhos VALUES ('S'), ('M');"],
    expectedOutput: [{ c: 'R', t: 'S' }, { c: 'R', t: 'M' }, { c: 'B', t: 'S' }, { c: 'B', t: 'M' }],
    initialQuery: 'SELECT * FROM cores CROSS JOIN tamanhos'
  },
  {
    id: 'sql-a-ext-16',
    track: 'sql',
    rank: 'Expert',
    title: 'CTE de Lucro Acumulado Regional',
    difficulty: 'Avançado',
    category: 'CTE',
    description: "Calcule o rank de lucro por região usando CTE.",
    hint: "WITH reg_lucro AS ...",
    tableSetup: ["CREATE TABLE r_v (reg TEXT, luc REAL);", "INSERT INTO r_v VALUES ('S', 1000), ('S', 2000), ('N', 500);"],
    expectedOutput: [{ reg: 'S', total: 3000.0, rnk: 1 }, { reg: 'N', total: 500.0, rnk: 2 }],
    initialQuery: 'WITH r AS (SELECT reg, SUM(luc) as total FROM r_v GROUP BY reg) SELECT *, RANK() OVER(ORDER BY total DESC) as rnk FROM r'
  },
  {
    id: 'sql-a-ext-17',
    track: 'sql',
    rank: 'Expert',
    title: 'Análise de Cohort (Mês de Início)',
    difficulty: 'Avançado',
    category: 'WINDOW',
    description: "Identifique para cada cliente a data do seu primeiro pedido (FIRST_VALUE).",
    hint: "FIRST_VALUE(data) OVER (PARTITION BY cid ORDER BY data)",
    tableSetup: ["CREATE TABLE orders_c (cid INTEGER, data TEXT);", "INSERT INTO orders_c VALUES (1, '2023-01-01'), (1, '2023-02-01'), (2, '2023-01-15');"],
    expectedOutput: [{ cid: 1, data: '2023-01-01', primeira: '2023-01-01' }, { cid: 1, data: '2023-02-01', primeira: '2023-01-01' }, { cid: 2, data: '2023-01-15', primeira: '2023-01-15' }],
    initialQuery: 'SELECT cid, data FROM orders_c'
  },
  {
    id: 'sql-a-ext-18',
    track: 'sql',
    rank: 'Expert',
    title: 'Simulação de Full Outer Join',
    difficulty: 'Avançado',
    category: 'JOIN',
    description: "Simule um FULL JOIN (LEFT JOIN UNION RIGHT JOIN) entre duas tabelas.",
    hint: "SQLite não suporta FULL JOIN nativo, use UNION.",
    tableSetup: ["CREATE TABLE a (id INTEGER);", "CREATE TABLE b (id INTEGER);", "INSERT INTO a VALUES (1);", "INSERT INTO b VALUES (2);"],
    expectedOutput: [{ id: 1 }, { id: 2 }],
    initialQuery: 'SELECT id FROM a UNION SELECT id FROM b'
  },
  {
    id: 'sql-a-ext-19',
    track: 'sql',
    rank: 'Expert',
    title: 'Categorização de Quartis (NTILE)',
    difficulty: 'Avançado',
    category: 'WINDOW',
    description: "Divida os funcionários em 2 grupos baseando-se no salário (NTILE).",
    hint: "NTILE(2) OVER (ORDER BY salario DESC)",
    tableSetup: ["CREATE TABLE staff_q (nome TEXT, salario REAL);", "INSERT INTO staff_q VALUES ('A', 1000), ('B', 2000), ('C', 3000), ('D', 4000);"],
    expectedOutput: [{ nome: 'D', grupo: 1 }, { nome: 'C', grupo: 1 }, { nome: 'B', grupo: 2 }, { nome: 'A', grupo: 2 }],
    initialQuery: 'SELECT nome, NTILE(2) OVER (ORDER BY salario DESC) as grupo FROM staff_q'
  },
  {
    id: 'sql-a-ext-20',
    track: 'sql',
    rank: 'Expert',
    title: 'Detecção de Duplicados Complexos',
    difficulty: 'Avançado',
    category: 'WINDOW',
    description: "Identifique registros duplicados (mesmo nome e data) usando ROW_NUMBER.",
    hint: "ROW_NUMBER() OVER (PARTITION BY nome, data ORDER BY id)",
    tableSetup: ["CREATE TABLE dup (id INTEGER, nome TEXT, data TEXT);", "INSERT INTO dup VALUES (1, 'A', 'X'), (2, 'A', 'X'), (3, 'B', 'Y');"],
    expectedOutput: [{ id: 2, nome: 'A', num: 2 }],
    initialQuery: 'SELECT id, nome, ROW_NUMBER() OVER(PARTITION BY nome, data ORDER BY id) as num FROM dup'
  },
  {
    id: 'sql-a-ext-21',
    track: 'sql',
    rank: 'Expert',
    title: 'Cálculo de Diferença Temporal (Lead/Lag)',
    difficulty: 'Avançado',
    category: 'WINDOW',
    description: "Mostre a diferença de valor entre o pedido atual e o pedido anterior do mesmo cliente.",
    hint: "valor - LAG(valor) OVER (PARTITION BY cid ORDER BY data)",
    tableSetup: ["CREATE TABLE ord_diff (cid INTEGER, valor REAL, data TEXT);", "INSERT INTO ord_diff VALUES (1, 100, 'A'), (1, 150, 'B'), (2, 200, 'A');"],
    expectedOutput: [{ cid: 1, valor: 100, diff: null }, { cid: 1, valor: 150, diff: 50.0 }, { cid: 2, valor: 200, diff: null }],
    initialQuery: 'SELECT cid, valor FROM ord_diff'
  },
  // EXCEL EXPANSÃO ADICIONAL (Para completar 50B, 30I)
  // BÁSICO - EXCEL (B-EXT-X)
  {
    id: 'excel-b-ext-12',
    track: 'excel',
    rank: 'Junior',
    title: 'Soma de Volume Mensal',
    difficulty: 'Básico',
    category: 'SOMA',
    description: "Some todos os valores de venda na coluna B para o relatório mensal.",
    hint: "=SOMA(B:B)",
    tableSetup: ["CREATE TABLE vendas_m (dia TEXT, valor REAL);", "INSERT INTO vendas_m VALUES ('D1', 100), ('D2', 150), ('D3', 200);"],
    expectedOutput: [{ total: 450.0 }],
    initialQuery: '=SOMA(B:B)'
  },
  {
    id: 'excel-b-ext-13',
    track: 'excel',
    rank: 'Junior',
    title: 'Média de Preços de Insumos',
    difficulty: 'Básico',
    category: 'AVERAGE',
    description: "Calcule o preço médio dos insumos na coluna B.",
    hint: "=MÉDIA(B:B)",
    tableSetup: ["CREATE TABLE insumos (nome TEXT, preco REAL);", "INSERT INTO insumos VALUES ('Agua', 2.5), ('Luz', 5.5), ('Gas', 10.0);"],
    expectedOutput: [{ media: 6.0 }],
    initialQuery: '=MÉDIA(B:B)'
  },
  {
    id: 'excel-b-ext-14',
    track: 'excel',
    rank: 'Junior',
    title: 'Contar Células Preenchidas',
    difficulty: 'Básico',
    category: 'CONT.VALORES',
    description: "Conte quantos nomes de clientes estão preenchidos na coluna A.",
    hint: "=CONT.VALORES(A:A)",
    tableSetup: ["CREATE TABLE clientes_list (nome TEXT);", "INSERT INTO clientes_list VALUES ('Ana'), ('Bob'), ('Caio');"],
    expectedOutput: [{ total: 3 }],
    initialQuery: '=CONT.VALORES(A:A)'
  },
  {
    id: 'excel-b-ext-15',
    track: 'excel',
    rank: 'Junior',
    title: 'Concatenar Nome e Sobrenome',
    difficulty: 'Básico',
    category: 'CONCAT',
    description: "Junte o Nome (A) e o Sobrenome (B) com um espaço entre eles.",
    hint: "=CONCATENAR(A2; ' '; B2)",
    tableSetup: ["CREATE TABLE nomes_full (nome TEXT, sobrenome TEXT);", "INSERT INTO nomes_full VALUES ('Ana', 'Silva'), ('Bob', 'Santos');"],
    expectedOutput: [{ completo: 'Ana Silva' }, { completo: 'Bob Santos' }],
    initialQuery: '=CONCATENAR(A2; " "; B2)'
  },
  {
    id: 'excel-b-ext-16',
    track: 'excel',
    rank: 'Junior',
    title: 'PROCV Simples: Buscar Preço',
    difficulty: 'Básico',
    category: 'VLOOKUP',
    description: "Busque o preço do item 'Teclado' na tabela de referência.",
    hint: "=PROCV('Teclado'; A:B; 2; 0)",
    tableSetup: ["CREATE TABLE ref_precos (nome TEXT, preco REAL);", "INSERT INTO ref_precos VALUES ('Mouse', 50), ('Teclado', 150);"],
    expectedOutput: [{ preco: 150.0 }],
    initialQuery: "=PROCV('Teclado'; A:B; 2; 0)"
  },
  {
    id: 'excel-b-ext-17',
    track: 'excel',
    rank: 'Junior',
    title: 'SE Simples: Status Financeiro',
    difficulty: 'Básico',
    category: 'IF',
    description: "Se o saldo (A) for negativo, mostre 'Devedor', senão 'Regular'.",
    hint: "=SE(A2 < 0; 'Devedor'; 'Regular')",
    tableSetup: ["CREATE TABLE banco (saldo REAL);", "INSERT INTO banco VALUES (-10), (500);"],
    expectedOutput: [{ status: 'Devedor' }, { status: 'Regular' }],
    initialQuery: '=SE(A:A < 0; "Devedor"; "Regular")'
  },
  {
    id: 'excel-b-ext-18',
    track: 'excel',
    rank: 'Junior',
    title: 'Extrair Código à Esquerda',
    difficulty: 'Básico',
    category: 'LEFT',
    description: "Extraia os 2 primeiros caracteres do SKU na coluna A.",
    hint: "=ESQUERDA(A2; 2)",
    tableSetup: ["CREATE TABLE skus (sku TEXT);", "INSERT INTO skus VALUES ('BR-101'), ('US-202');"],
    expectedOutput: [{ cod: 'BR' }, { cod: 'US' }],
    initialQuery: '=ESQUERDA(A:A; 2)'
  },
  {
    id: 'excel-b-ext-19',
    track: 'excel',
    rank: 'Junior',
    title: 'Arredondar para Cima',
    difficulty: 'Básico',
    category: 'ROUND',
    description: "Arredonde os pesos na coluna B para 0 casas decimais.",
    hint: "=ARRED(B2; 0)",
    tableSetup: ["CREATE TABLE pesos (item TEXT, peso REAL);", "INSERT INTO pesos VALUES ('A', 1.55), ('B', 2.12);"],
    expectedOutput: [{ item: 'A', peso_arr: 2.0 }, { item: 'B', peso_arr: 2.0 }],
    initialQuery: '=ARRED(B:B; 0)'
  },
  {
    id: 'excel-b-ext-20',
    track: 'excel',
    rank: 'Junior',
    title: 'Contar Números',
    difficulty: 'Básico',
    category: 'CONT.NÚM',
    description: "Conte quantas células na coluna B contêm números.",
    hint: "=CONT.NÚM(B:B)",
    tableSetup: ["CREATE TABLE counts (val TEXT);", "INSERT INTO counts VALUES ('10'), ('ABC'), ('20');"],
    expectedOutput: [{ total: 2 }],
    initialQuery: '=CONT.NÚM(B:B)'
  },
  {
    id: 'excel-b-ext-21',
    track: 'excel',
    rank: 'Junior',
    title: 'Soma com Condição Única',
    difficulty: 'Básico',
    category: 'SUMIF',
    description: "Some as quantidades onde a cor (A) é 'Verde'.",
    hint: "=SOMASE(A:A; 'Verde'; B:B)",
    tableSetup: ["CREATE TABLE invent (cor TEXT, qtd INTEGER);", "INSERT INTO invent VALUES ('Verde', 10), ('Azul', 5), ('Verde', 20);"],
    expectedOutput: [{ total: 30 }],
    initialQuery: "=SOMASE(A:A; 'Verde'; B:B)"
  },
  {
    id: 'excel-b-ext-22',
    track: 'excel',
    rank: 'Junior',
    title: 'Média com Condição Única',
    difficulty: 'Básico',
    category: 'AVERAGEIF',
    description: "Média de notas onde o aluno atingiu a nota mínima de 7.",
    hint: "=MÉDIASE(B:B; '>=7')",
    tableSetup: ["CREATE TABLE notas_f (nota REAL);", "INSERT INTO notas_f VALUES (8), (5), (9), (6);"],
    expectedOutput: [{ media: 8.5 }],
    initialQuery: "=MÉDIASE(B:B; '>=7')"
  },
  {
    id: 'excel-b-ext-23',
    track: 'excel',
    rank: 'Junior',
    title: 'Mínimo Absoluto',
    difficulty: 'Básico',
    category: 'MIN',
    description: "Encontre o menor valor de temperatura na coluna B.",
    hint: "=MÍN(B:B)",
    tableSetup: ["CREATE TABLE temps (hora TEXT, t REAL);", "INSERT INTO temps VALUES ('10h', 22.5), ('11h', 19.0), ('12h', 25.0);"],
    expectedOutput: [{ min_t: 19.0 }],
    initialQuery: '=MÍN(B:B)'
  },
  {
    id: 'excel-b-ext-24',
    track: 'excel',
    rank: 'Junior',
    title: 'Máximo Histórico',
    difficulty: 'Básico',
    category: 'MAX',
    description: "Qual o maior valor de faturamento registrado na coluna B?",
    hint: "=MÁX(B:B)",
    tableSetup: ["CREATE TABLE hist_f (ano INTEGER, f REAL);", "INSERT INTO hist_f VALUES (2020, 10000), (2021, 50000), (2022, 35000);"],
    expectedOutput: [{ max_f: 50000.0 }],
    initialQuery: '=MÁX(B:B)'
  },
  {
    id: 'excel-b-ext-25',
    track: 'excel',
    rank: 'Junior',
    title: 'Texto para Maiúsculas',
    difficulty: 'Básico',
    category: 'UPPER',
    description: "Converta os códigos de minúsculo para maiúsculo na coluna A.",
    hint: "=MAIÚSCULA(A2)",
    tableSetup: ["CREATE TABLE codes_m (c TEXT);", "INSERT INTO codes_m VALUES ('abc'), ('xyz');"],
    expectedOutput: [{ c: 'ABC' }, { c: 'XYZ' }],
    initialQuery: '=MAIÚSCULA(A:A)'
  },
  {
    id: 'excel-b-ext-26',
    track: 'excel',
    rank: 'Junior',
    title: 'Texto para Minúsculas',
    difficulty: 'Básico',
    category: 'LOWER',
    description: "Converta os nomes na coluna A para letras minúsculas.",
    hint: "=MINÚSCULA(A2)",
    tableSetup: ["CREATE TABLE names_m (n TEXT);", "INSERT INTO names_m VALUES ('ANA'), ('BOB');"],
    expectedOutput: [{ n: 'ana' }, { n: 'bob' }],
    initialQuery: '=MINÚSCULA(A:A)'
  },
  {
    id: 'excel-b-ext-27',
    track: 'excel',
    rank: 'Junior',
    title: 'Extrair Caracteres à Direita',
    difficulty: 'Básico',
    category: 'RIGHT',
    description: "Pegue os 4 últimos dígitos do telefone na coluna A.",
    hint: "=DIREITA(A2; 4)",
    tableSetup: ["CREATE TABLE tels (num TEXT);", "INSERT INTO tels VALUES ('9999-1234'), ('8888-5678');"],
    expectedOutput: [{ fim: '1234' }, { fim: '5678' }],
    initialQuery: '=DIREITA(A:A; 4)'
  },
  {
    id: 'excel-b-ext-28',
    track: 'excel',
    rank: 'Junior',
    title: 'Tamanho do Texto',
    difficulty: 'Básico',
    category: 'LEN',
    description: "Conte quantos caracteres existem no campo de observação (A).",
    hint: "=NÚM.CARACT(A2)",
    tableSetup: ["CREATE TABLE obs_t (txt TEXT);", "INSERT INTO obs_t VALUES ('OK'), ('Pendente');"],
    expectedOutput: [{ tam: 2 }, { tam: 8 }],
    initialQuery: '=NÚM.CARACT(A:A)'
  },
  {
    id: 'excel-b-ext-29',
    track: 'excel',
    rank: 'Junior',
    title: 'Remover Espaços',
    difficulty: 'Básico',
    category: 'TRIM',
    description: "Limpe os espaços excedentes no nome do produto na coluna A.",
    hint: "=ARRUMAR(A2)",
    tableSetup: ["CREATE TABLE products_s (p TEXT);", "INSERT INTO products_s VALUES (' Item A '), ('Item B  ');"],
    expectedOutput: [{ limpo: 'Item A' }, { limpo: 'Item B' }],
    initialQuery: '=ARRUMAR(A:A)'
  },
  {
    id: 'excel-b-ext-30',
    track: 'excel',
    rank: 'Junior',
    title: 'Substituição de Padrão',
    difficulty: 'Básico',
    category: 'SUBSTITUTE',
    description: "Troque todos os '.' por '-' no código da coluna A.",
    hint: "=SUBSTITUIR(A2; '.'; '-')",
    tableSetup: ["CREATE TABLE code_p (c TEXT);", "INSERT INTO code_p VALUES ('1.2.3'), ('A.B.C');"],
    expectedOutput: [{ novo: '1-2-3' }, { novo: 'A-B-C' }],
    initialQuery: '=SUBSTITUIR(A:A; "."; "-")'
  },
  {
    id: 'excel-b-ext-31',
    track: 'excel',
    rank: 'Junior',
    title: 'Verificar se é Número',
    difficulty: 'Básico',
    category: 'ISNUMBER',
    description: "Retorne VERDADEIRO se o campo A for numérico, senão FALSO.",
    hint: "=ÉNUM(A2)",
    tableSetup: ["CREATE TABLE inputs (val TEXT);", "INSERT INTO inputs VALUES ('10'), ('Texto');"],
    expectedOutput: [{ is_num: 1 }, { is_num: 0 }],
    initialQuery: '=ÉNUM(A:A)'
  },
  {
    id: 'excel-b-ext-32',
    track: 'excel',
    rank: 'Junior',
    title: 'Simulação de Power (Potência)',
    difficulty: 'Básico',
    category: 'MATH',
    description: "Eleve o valor da coluna A ao quadrado.",
    hint: "=POTÊNCIA(A2; 2)",
    tableSetup: ["CREATE TABLE powers (v INTEGER);", "INSERT INTO powers VALUES (2), (5), (10);"],
    expectedOutput: [{ res: 4 }, { res: 25 }, { res: 100 }],
    initialQuery: '=POTÊNCIA(A:A; 2)'
  },
  {
    id: 'excel-b-ext-33',
    track: 'excel',
    rank: 'Junior',
    title: 'Raiz Quadrada',
    difficulty: 'Básico',
    category: 'MATH',
    description: "Calcule a raiz quadrada dos valores na coluna A.",
    hint: "=RAIZ(A2)",
    tableSetup: ["CREATE TABLE roots (v INTEGER);", "INSERT INTO roots VALUES (16), (25), (100);"],
    expectedOutput: [{ res: 4.0 }, { res: 5.0 }, { res: 10.0 }],
    initialQuery: '=RAIZ(A:A)'
  },
  {
    id: 'excel-b-ext-34',
    track: 'excel',
    rank: 'Junior',
    title: 'Módulo (Resto da Divisão)',
    difficulty: 'Básico',
    category: 'MATH',
    description: "Obtenha o resto da divisão do valor A por 2.",
    hint: "=MOD(A2; 2)",
    tableSetup: ["CREATE TABLE modulos (v INTEGER);", "INSERT INTO modulos VALUES (10), (11), (20), (23);"],
    expectedOutput: [{ res: 0 }, { res: 1 }, { res: 0 }, { res: 1 }],
    initialQuery: '=MOD(A:A; 2)'
  },

  // INTERMEDIÁRIO - EXCEL (I-EXT-X)
  {
    id: 'excel-i-ext-12',
    track: 'excel',
    rank: 'Analyst',
    title: 'SOMA com E e OU',
    difficulty: 'Intermediário',
    category: 'SUMIFS',
    description: "Some as vendas onde o setor é 'TI' E o valor é maior que 1000.",
    hint: "=SOMASES(C:C; B:B; 'TI'; C:C; '>1000')",
    tableSetup: ["CREATE TABLE sales_cond (vendedor TEXT, setor TEXT, valor REAL);", "INSERT INTO sales_cond VALUES ('A', 'TI', 1500), ('B', 'Vendas', 2000), ('C', 'TI', 500);"],
    expectedOutput: [{ total: 1500.0 }],
    initialQuery: "=SOMASES(C:C; B:B; 'TI'; C:C; '>1000')"
  },
  {
    id: 'excel-i-ext-13',
    track: 'excel',
    rank: 'Analyst',
    title: 'PROCV com Tratamento de Erro',
    difficulty: 'Intermediário',
    category: 'IFERROR',
    description: "Tente buscar o preço do item (A). Se não encontrar, retorne 0.",
    hint: "=SEERRO(PROCV(A2; D:E; 2; 0); 0)",
    tableSetup: ["CREATE TABLE busca (item TEXT);", "CREATE TABLE precos (item TEXT, p REAL);", "INSERT INTO busca VALUES ('Pen');", "INSERT INTO precos VALUES ('Mouse', 50);"],
    expectedOutput: [{ p: 0.0 }],
    initialQuery: "=SEERRO(PROCV(A:A; D:E; 2; 0); 0)"
  },
  {
    id: 'excel-i-ext-14',
    track: 'excel',
    rank: 'Analyst',
    title: 'Contar com Múltiplas Regras',
    difficulty: 'Intermediário',
    category: 'COUNTIFS',
    description: "Conte quantos itens são da Cor 'Azul' E tamanho 'G'.",
    hint: "=CONT.SES(A:A; 'Azul'; B:B; 'G')",
    tableSetup: ["CREATE TABLE stock_c (cor TEXT, tam TEXT);", "INSERT INTO stock_c VALUES ('Azul', 'G'), ('Azul', 'M'), ('Vermelho', 'G');"],
    expectedOutput: [{ total: 1 }],
    initialQuery: "=CONT.SES(A:A; 'Azul'; B:B; 'G')"
  },
  {
    id: 'excel-i-ext-15',
    track: 'excel',
    rank: 'Analyst',
    title: 'Extrair do Meio (EXT.TEXTO)',
    difficulty: 'Intermediário',
    category: 'MID',
    description: "Extraia 3 caracteres a partir da posição 5 do código.",
    hint: "=EXT.TEXTO(A2; 5; 3)",
    tableSetup: ["CREATE TABLE mid_t (c TEXT);", "INSERT INTO mid_t VALUES ('COD-ABC-123'), ('REF-XYZ-456');"],
    expectedOutput: [{ exc: 'ABC' }, { exc: 'XYZ' }],
    initialQuery: '=EXT.TEXTO(A:A; 5; 3)'
  },
  {
    id: 'excel-i-ext-16',
    track: 'excel',
    rank: 'Analyst',
    title: 'Índice e Corresp (Index-Match)',
    difficulty: 'Intermediário',
    category: 'INDEX',
    description: "Simule a busca de preço usando ÍNDICE/CORRESP.",
    hint: "=ÍNDICE(E:E; CORRESP(A2; D:D; 0))",
    tableSetup: ["CREATE TABLE items (nome TEXT);", "CREATE TABLE prices (n TEXT, p REAL);", "INSERT INTO items VALUES ('A');", "INSERT INTO prices VALUES ('A', 10.0);"],
    expectedOutput: [{ p: 10.0 }],
    initialQuery: "=ÍNDICE(E:E; CORRESP(A:A; D:D; 0))"
  },
  {
    id: 'excel-i-ext-17',
    track: 'excel',
    rank: 'Analyst',
    title: 'Data Atual e Diferença',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Calcule a diferença de dias entre hoje (2024-04-20) e a data da coluna A.",
    hint: "='2024-04-20' - A2",
    tableSetup: ["CREATE TABLE dates_d (d TEXT);", "INSERT INTO dates_d VALUES ('2024-04-10'), ('2024-04-15');"],
    expectedOutput: [{ diff: 10 }, { diff: 5 }],
    initialQuery: "='2024-04-20' - A:A"
  },

  // ==========================================
  // EXPANSÃO SQL: MÍNIMO 5 POR CATEGORIA
  // ==========================================

  // SQL - AVG (Completando 5)
  {
    id: 'sql-b-avg-2',
    track: 'sql',
    rank: 'Junior',
    title: 'Média de Tempo de Resposta',
    difficulty: 'Básico',
    category: 'AVG',
    description: "Determine o tempo médio de resposta (em minutos) dos tickets de suporte.",
    hint: "AVG(minutos)",
    tableSetup: ["CREATE TABLE tickets (id INTEGER, minutos INTEGER);", "INSERT INTO tickets VALUES (1, 10), (2, 20), (3, 15);"],
    expectedOutput: [{ media: 15.0 }],
    initialQuery: 'SELECT AVG(minutos) as media FROM tickets'
  },
  {
    id: 'sql-b-avg-3',
    track: 'sql',
    rank: 'Junior',
    title: 'Média de Itens por Pedido',
    difficulty: 'Básico',
    category: 'AVG',
    description: "Qual a média de itens comprados por transação?",
    hint: "AVG(qtd)",
    tableSetup: ["CREATE TABLE orders_q (oid INTEGER, qtd INTEGER);", "INSERT INTO orders_q VALUES (101, 2), (102, 5), (103, 3);"],
    expectedOutput: [{ media_itens: 3.3333333333333335 }],
    initialQuery: 'SELECT AVG(qtd) as media_itens FROM orders_q'
  },
  {
    id: 'sql-b-avg-4',
    track: 'sql',
    rank: 'Junior',
    title: 'Média de Estrelas - App Store',
    difficulty: 'Básico',
    category: 'AVG',
    description: "Calcule a nota média do aplicativo baseada nas avaliações dos usuários.",
    hint: "AVG(nota)",
    tableSetup: ["CREATE TABLE reviews (app TEXT, nota INTEGER);", "INSERT INTO reviews VALUES ('App1', 5), ('App1', 4), ('App1', 4);"],
    expectedOutput: [{ media_nota: 4.333333333333333 }],
    initialQuery: 'SELECT AVG(nota) as media_nota FROM reviews'
  },
  {
    id: 'sql-b-avg-5',
    track: 'sql',
    rank: 'Junior',
    title: 'Média de Idade dos Clientes VIP',
    difficulty: 'Básico',
    category: 'AVG',
    description: "Encontre a média de idade dos clientes marcados como VIP.",
    hint: "WHERE tipo = 'VIP'",
    tableSetup: ["CREATE TABLE vips (nome TEXT, idade INTEGER, tipo TEXT);", "INSERT INTO vips VALUES ('Ana', 30, 'VIP'), ('Beto', 40, 'VIP'), ('Caio', 25, 'Regular');"],
    expectedOutput: [{ media_VIP: 35.0 }],
    initialQuery: "SELECT AVG(idade) as media_VIP FROM vips WHERE tipo = 'VIP'"
  },

  // SQL - COUNT (Completando 5)
  {
    id: 'sql-b-count-2',
    track: 'sql',
    rank: 'Junior',
    title: 'Total de Produtos em Falta',
    difficulty: 'Básico',
    category: 'COUNT',
    description: "Conte quantos produtos estão com estoque zerado.",
    hint: "COUNT(*) WHERE estoque = 0",
    tableSetup: ["CREATE TABLE prod_s (item TEXT, estoque INTEGER);", "INSERT INTO prod_s VALUES ('Teclado', 10), ('Mouse', 0), ('Cabo', 0);"],
    expectedOutput: [{ total: 2 }],
    initialQuery: 'SELECT COUNT(*) as total FROM prod_s WHERE estoque = 0'
  },
  {
    id: 'sql-b-count-3',
    track: 'sql',
    rank: 'Junior',
    title: 'Contagem de Transações Suspeitas',
    difficulty: 'Básico',
    category: 'COUNT',
    description: "Conte as transações com valor superior a 10.000.",
    hint: "COUNT(*) WHERE valor > 10000",
    tableSetup: ["CREATE TABLE trans_s (id INTEGER, valor REAL);", "INSERT INTO trans_s VALUES (1, 15000), (2, 500), (3, 12000);"],
    expectedOutput: [{ suspeitas: 2 }],
    initialQuery: 'SELECT COUNT(*) as suspeitas FROM trans_s WHERE valor > 10000'
  },
  {
    id: 'sql-b-count-4',
    track: 'sql',
    rank: 'Junior',
    title: 'Usuários com Email Verificado',
    difficulty: 'Básico',
    category: 'COUNT',
    description: "Quantos usuários já verificaram seus emails?",
    hint: "WHERE verificado = 1",
    tableSetup: ["CREATE TABLE users_v (id INTEGER, verificado INTEGER);", "INSERT INTO users_v VALUES (1, 1), (2, 0), (3, 1), (4, 1);"],
    expectedOutput: [{ total_verificados: 3 }],
    initialQuery: 'SELECT COUNT(*) as total_verificados FROM users_v WHERE verificado = 1'
  },
  {
    id: 'sql-b-count-5',
    track: 'sql',
    rank: 'Junior',
    title: 'Total de Leads por Canal',
    difficulty: 'Básico',
    category: 'COUNT',
    description: "Conte o total de leads oriundos do canal 'Google Ads'.",
    hint: "WHERE canal = 'Google Ads'",
    tableSetup: ["CREATE TABLE leads (id INTEGER, canal TEXT);", "INSERT INTO leads VALUES (1, 'Google Ads'), (2, 'Direct'), (3, 'Google Ads');"],
    expectedOutput: [{ total_ads: 2 }],
    initialQuery: "SELECT COUNT(*) as total_ads FROM leads WHERE canal = 'Google Ads'"
  },

  // SQL - SUM (Completando 5)
  {
    id: 'sql-b-sum-2',
    track: 'sql',
    rank: 'Junior',
    title: 'Faturamento Total por Loja',
    difficulty: 'Básico',
    category: 'SUM',
    description: "Calcule a soma total de faturamento da Loja 1.",
    hint: "SUM(valor) WHERE loja_id = 1",
    tableSetup: ["CREATE TABLE fat (loja_id INTEGER, valor REAL);", "INSERT INTO fat VALUES (1, 500.50), (2, 1000), (1, 499.50);"],
    expectedOutput: [{ total: 1000.0 }],
    initialQuery: 'SELECT SUM(valor) as total FROM fat WHERE loja_id = 1'
  },
  {
    id: 'sql-b-sum-3',
    track: 'sql',
    rank: 'Junior',
    title: 'Total de Horas Trabalhadas',
    difficulty: 'Básico',
    category: 'SUM',
    description: "Some todas as horas registradas no projeto 'X'.",
    hint: "SUM(horas)",
    tableSetup: ["CREATE TABLE timesheet (projeto TEXT, horas INTEGER);", "INSERT INTO timesheet VALUES ('X', 8), ('X', 5), ('Y', 10);"],
    expectedOutput: [{ total_horas: 13 }],
    initialQuery: "SELECT SUM(horas) as total_horas FROM timesheet WHERE projeto = 'X'"
  },
  {
    id: 'sql-b-sum-4',
    track: 'sql',
    rank: 'Junior',
    title: 'Soma de Pontos de Fidelidade',
    difficulty: 'Básico',
    category: 'SUM',
    description: "Qual o total de pontos de fidelidade acumulados por todos os clientes?",
    hint: "SUM(pontos)",
    tableSetup: ["CREATE TABLE loyalty (cid INTEGER, pontos INTEGER);", "INSERT INTO loyalty VALUES (1, 100), (2, 250), (3, 50);"],
    expectedOutput: [{ pontos_totais: 400 }],
    initialQuery: 'SELECT SUM(pontos) as pontos_totais FROM loyalty'
  },
  {
    id: 'sql-b-sum-5',
    track: 'sql',
    rank: 'Junior',
    title: 'Peso Total da Carga',
    difficulty: 'Básico',
    category: 'SUM',
    description: "Calcule o peso total de todos os itens cadastrados no caminhão.",
    hint: "SUM(peso)",
    tableSetup: ["CREATE TABLE carga (item TEXT, peso REAL);", "INSERT INTO carga VALUES ('Mesa', 25.5), ('Cadeira', 10.2);"],
    expectedOutput: [{ peso_total: 35.7 }],
    initialQuery: 'SELECT SUM(peso) as peso_total FROM carga'
  },

  // SQL - MAX (Completando 5)
  {
    id: 'sql-b-max-2',
    track: 'sql',
    rank: 'Junior',
    title: 'Maior Salário por Cargo',
    difficulty: 'Básico',
    category: 'MAX',
    description: "Encontre o maior salário registrado no departamento de 'Vendas'.",
    hint: "MAX(salario) WHERE depto = 'Vendas'",
    tableSetup: ["CREATE TABLE sal (depto TEXT, salario REAL);", "INSERT INTO sal VALUES ('Vendas', 5000), ('Vendas', 8000), ('TI', 9000);"],
    expectedOutput: [{ max_sal: 8000.0 }],
    initialQuery: "SELECT MAX(salario) as max_sal FROM sal WHERE depto = 'Vendas'"
  },
  {
    id: 'sql-b-max-3',
    track: 'sql',
    rank: 'Junior',
    title: 'Nota Máxima da Turma',
    difficulty: 'Básico',
    category: 'MAX',
    description: "Qual foi a maior nota da última prova?",
    hint: "MAX(nota)",
    tableSetup: ["CREATE TABLE provas (aluno TEXT, nota REAL);", "INSERT INTO provas VALUES ('Ana', 8.5), ('Bob', 9.8), ('Caio', 7.0);"],
    expectedOutput: [{ nota_max: 9.8 }],
    initialQuery: 'SELECT MAX(nota) as nota_max FROM provas'
  },
  {
    id: 'sql-b-max-4',
    track: 'sql',
    rank: 'Junior',
    title: 'Estoque Máximo Capacitado',
    difficulty: 'Básico',
    category: 'MAX',
    description: "Encontre a capacidade máxima de estoque entre as prateleiras.",
    hint: "MAX(capacidade)",
    tableSetup: ["CREATE TABLE shelves (id INTEGER, capacidade INTEGER);", "INSERT INTO shelves VALUES (1, 100), (2, 500), (3, 250);"],
    expectedOutput: [{ max_cap: 500 }],
    initialQuery: 'SELECT MAX(capacidade) as max_cap FROM shelves'
  },
  {
    id: 'sql-b-max-5',
    track: 'sql',
    rank: 'Junior',
    title: 'Recorde de Pontos',
    difficulty: 'Básico',
    category: 'MAX',
    description: "Determine o recorde atual de pontos do jogo.",
    hint: "MAX(score)",
    tableSetup: ["CREATE TABLE scores (player TEXT, score INTEGER);", "INSERT INTO scores VALUES ('A', 1500), ('B', 3000), ('C', 2200);"],
    expectedOutput: [{ recorde: 3000 }],
    initialQuery: 'SELECT MAX(score) as recorde FROM scores'
  },

  // SQL - MIN (Completando 5)
  {
    id: 'sql-b-min-2',
    track: 'sql',
    rank: 'Junior',
    title: 'Lance Mínimo de Leilão',
    difficulty: 'Básico',
    category: 'MIN',
    description: "Encontre o menor lance realizado no leilão atual.",
    hint: "MIN(lance)",
    tableSetup: ["CREATE TABLE leilao (user TEXT, lance REAL);", "INSERT INTO leilao VALUES ('A', 100.50), ('B', 95.00), ('C', 150.00);"],
    expectedOutput: [{ menor_lance: 95.00 }],
    initialQuery: 'SELECT MIN(lance) as menor_lance FROM leilao'
  },
  {
    id: 'sql-b-min-3',
    track: 'sql',
    rank: 'Junior',
    title: 'Temperatura Mínima Registrada',
    difficulty: 'Básico',
    category: 'MIN',
    description: "Qual a menor temperatura lida pelos sensores hoje?",
    hint: "MIN(temp)",
    tableSetup: ["CREATE TABLE sensores (id INTEGER, temp REAL);", "INSERT INTO sensores VALUES (1, 22.5), (2, 18.2), (3, 20.0);"],
    expectedOutput: [{ min_temp: 18.2 }],
    initialQuery: 'SELECT MIN(temp) as min_temp FROM sensores'
  },
  {
    id: 'sql-b-min-4',
    track: 'sql',
    rank: 'Junior',
    title: 'Menor Prazo de Entrega',
    difficulty: 'Básico',
    category: 'MIN',
    description: "Identifique o menor prazo de entrega em dias.",
    hint: "MIN(dias)",
    tableSetup: ["CREATE TABLE logistica (servico TEXT, dias INTEGER);", "INSERT INTO logistica VALUES ('Express', 2), ('Normal', 7), ('Retirada', 1);"],
    expectedOutput: [{ min_prazo: 1 }],
    initialQuery: 'SELECT MIN(dias) as min_prazo FROM logistica'
  },
  {
    id: 'sql-b-min-5',
    track: 'sql',
    rank: 'Junior',
    title: 'Primeiro ID de Usuário Autenticado',
    difficulty: 'Básico',
    category: 'MIN',
    description: "Encontre o ID do primeiro usuário que se autenticou no sistema hoje.",
    hint: "MIN(user_id)",
    tableSetup: ["CREATE TABLE auth_logs (id INTEGER, user_id INTEGER);", "INSERT INTO auth_logs VALUES (10, 501), (11, 402), (12, 600);"],
    expectedOutput: [{ primeiro_user: 402 }],
    initialQuery: 'SELECT MIN(user_id) as primeiro_user FROM auth_logs'
  },

  // SQL - TEXT (Completando 5)
  {
    id: 'sql-i-text-2',
    track: 'sql',
    rank: 'Analyst',
    title: 'Padronização de Emails',
    difficulty: 'Intermediário',
    category: 'TEXT',
    description: "Converta todos os emails para letras minúsculas para evitar duplicidades no banco.",
    hint: "LOWER(email)",
    tableSetup: ["CREATE TABLE contatos (id INTEGER, email TEXT);", "INSERT INTO contatos VALUES (1, 'ANA@TESTE.COM'), (2, 'Bob@Exemplo.Org');"],
    expectedOutput: [{ email_norm: 'ana@teste.com' }, { email_norm: 'bob@exemplo.org' }],
    initialQuery: 'SELECT LOWER(email) as email_norm FROM contatos'
  },
  {
    id: 'sql-i-text-3',
    track: 'sql',
    rank: 'Analyst',
    title: 'Extração de Domínio de Email',
    difficulty: 'Intermediário',
    category: 'TEXT',
    description: "Recupere os caracteres após o '@' para identificar o provedor (Simulado com SUBSTR e INSTR).",
    hint: "Use SUBSTR(email, INSTR(email, '@') + 1)",
    tableSetup: ["CREATE TABLE emails (id INTEGER, email TEXT);", "INSERT INTO emails VALUES (1, 'user@google.com'), (2, 'admin@aws.com');"],
    expectedOutput: [{ dominio: 'google.com' }, { dominio: 'aws.com' }],
    initialQuery: "SELECT SUBSTR(email, INSTR(email, '@') + 1) as dominio FROM emails"
  },
  {
    id: 'sql-i-text-4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Comprimento do Nome de Usuário',
    difficulty: 'Intermediário',
    category: 'TEXT',
    description: "Selecione usuários cujos nomes possuam exatamente 5 caracteres.",
    hint: "LENGTH(nome) = 5",
    tableSetup: ["CREATE TABLE nomes_l (nome TEXT);", "INSERT INTO nomes_l VALUES ('Ana'), ('Berto'), ('Carla'), ('Diana');"],
    expectedOutput: [{ nome: 'Berto' }, { nome: 'Carla' }, { nome: 'Diana' }],
    initialQuery: 'SELECT nome FROM nomes_l WHERE LENGTH(nome) = 5'
  },
  {
    id: 'sql-i-text-5',
    track: 'sql',
    rank: 'Analyst',
    title: 'Mascaramento de Telefone',
    difficulty: 'Intermediário',
    category: 'TEXT',
    description: "Apresente apenas os 4 últimos dígitos do telefone.",
    hint: "SUBSTR(tel, -4)",
    tableSetup: ["CREATE TABLE tels_m (tel TEXT);", "INSERT INTO tels_m VALUES ('11988884444'), ('21977773333');"],
    expectedOutput: [{ final: '4444' }, { final: '3333' }],
    initialQuery: 'SELECT SUBSTR(tel, -4) as final FROM tels_m'
  },

  // SQL - COALESCE (Completando 5)
  {
    id: 'sql-i-coalesce-2',
    track: 'sql',
    rank: 'Analyst',
    title: 'Nome de Exibição com Fallback',
    difficulty: 'Intermediário',
    category: 'COALESCE',
    description: "Se o `apelido` for nulo, use o `nome_real`.",
    hint: "COALESCE(apelido, nome_real)",
    tableSetup: ["CREATE TABLE perfis (nome_real TEXT, apelido TEXT);", "INSERT INTO perfis VALUES ('Ana Silva', 'Ani'), ('Carlos Souza', NULL);"],
    expectedOutput: [{ display: 'Ani' }, { display: 'Carlos Souza' }],
    initialQuery: 'SELECT COALESCE(apelido, nome_real) as display FROM perfis'
  },
  {
    id: 'sql-i-coalesce-3',
    track: 'sql',
    rank: 'Analyst',
    title: 'Status de Envio Padrão',
    difficulty: 'Intermediário',
    category: 'COALESCE',
    description: "Se a `data_envio` for nula, mostre o texto 'Pendente'.",
    hint: "COALESCE(data_envio, 'Pendente')",
    tableSetup: ["CREATE TABLE envios (id INTEGER, data_envio TEXT);", "INSERT INTO envios VALUES (1, '2023-01-01'), (2, NULL);"],
    expectedOutput: [{ id: 1, status: '2023-01-01' }, { id: 2, status: 'Pendente' }],
    initialQuery: "SELECT id, COALESCE(data_envio, 'Pendente') as status FROM envios"
  },
  {
    id: 'sql-i-coalesce-4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Telefone de Recado Alternativo',
    difficulty: 'Intermediário',
    category: 'COALESCE',
    description: "Busque o primeiro telefone disponível na ordem: Celular, Residencial, Trabalho.",
    hint: "COALESCE(cel, res, trab)",
    tableSetup: ["CREATE TABLE contatos_t (cel TEXT, res TEXT, trab TEXT);", "INSERT INTO contatos_t VALUES (NULL, '3333-1111', '4444-2222'), ('9999-0000', NULL, NULL);"],
    expectedOutput: [{ fone: '3333-1111' }, { fone: '9999-0000' }],
    initialQuery: 'SELECT COALESCE(cel, res, trab) as fone FROM contatos_t'
  },
  {
    id: 'sql-i-coalesce-5',
    track: 'sql',
    rank: 'Analyst',
    title: 'Saldo Final com COALESCE',
    difficulty: 'Intermediário',
    category: 'COALESCE',
    description: "Some Saldo + Bonus. Se o bônus for nulo, trate como 0.",
    hint: "saldo + COALESCE(bonus, 0)",
    tableSetup: ["CREATE TABLE conta_b (user TEXT, saldo REAL, bonus REAL);", "INSERT INTO conta_b VALUES ('Ana', 1000, 200), ('Beto', 500, NULL);"],
    expectedOutput: [{ user: 'Ana', total: 1200.0 }, { user: 'Beto', total: 500.0 }],
    initialQuery: 'SELECT user, saldo + COALESCE(bonus, 0) as total FROM conta_b'
  },

  // SQL - CTE (Completando 5)
  {
    id: 'sql-a-cte-4',
    track: 'sql',
    rank: 'Expert',
    title: 'CTE de Higienização de Dados',
    difficulty: 'Avançado',
    category: 'CTE',
    description: "Crie uma CTE para remover espaços dos nomes e depois selecione apenas nomes que começam com 'A'.",
    hint: "WITH nomes_limpos AS (SELECT TRIM(nome) as n FROM ...) SELECT * FROM nomes_limpos WHERE n LIKE 'A%'",
    tableSetup: ["CREATE TABLE raw (nome TEXT);", "INSERT INTO raw VALUES (' Ana'), (' Bob '), (' Alberto');"],
    expectedOutput: [{ n: 'Ana' }, { n: 'Alberto' }],
    initialQuery: 'WITH l AS (SELECT TRIM(nome) as n FROM raw) SELECT n FROM l WHERE n LIKE "A%"'
  },
  {
    id: 'sql-a-cte-5',
    track: 'sql',
    rank: 'Expert',
    title: 'CTE de Fluxo de Caixa Acumulado',
    difficulty: 'Avançado',
    category: 'CTE',
    description: "Use uma CTE para agrupar totais por dia e depois calcule a média desses totais diários.",
    hint: "WITH diaris AS (SELECT dia, SUM(valor) as t FROM ... GROUP BY dia) SELECT AVG(t) FROM diaris",
    tableSetup: ["CREATE TABLE fluxo (dia TEXT, valor REAL);", "INSERT INTO fluxo VALUES ('2023-01-01', 100), ('2023-01-01', 200), ('2023-01-02', 500);"],
    expectedOutput: [{ media_diaria: 400.0 }],
    initialQuery: 'WITH d AS (SELECT SUM(valor) as t FROM fluxo GROUP BY dia) SELECT AVG(t) as media_diaria FROM d'
  },

  // SQL - DATE (Completando 5)
  {
    id: 'sql-i-date-2',
    track: 'sql',
    rank: 'Analyst',
    title: 'Filtragem por Ano Corrente',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Filtre os registros que ocorreram no ano de 2023.",
    hint: "STRFTIME('%Y', data) = '2023'",
    tableSetup: ["CREATE TABLE hist_d (data TEXT);", "INSERT INTO hist_d VALUES ('2022-12-31'), ('2023-01-01'), ('2023-05-15');"],
    expectedOutput: [{ data: '2023-01-01' }, { data: '2023-05-15' }],
    initialQuery: "SELECT data FROM hist_d WHERE STRFTIME('%Y', data) = '2023'"
  },
  {
    id: 'sql-i-date-3',
    track: 'sql',
    rank: 'Analyst',
    title: 'Cálculo de Antiguidade (Dias)',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Calcule a diferença em dias entre '2024-01-01' e a data de entrada do funcionário.",
    hint: "JULIANDAY('2024-01-01') - JULIANDAY(data_entrada)",
    tableSetup: ["CREATE TABLE rh (nome TEXT, data_entrada TEXT);", "INSERT INTO rh VALUES ('Ana', '2023-12-01'), ('Bob', '2023-12-20');"],
    expectedOutput: [{ nome: 'Ana', dias: 31 }, { nome: 'Bob', dias: 12 }],
    initialQuery: "SELECT nome, CAST(JULIANDAY('2024-01-01') - JULIANDAY(data_entrada) AS INTEGER) as dias FROM rh"
  },
  {
    id: 'sql-i-date-4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Meses de Atividade',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Extraia o mês da data de venda para análise de sazonalidade.",
    hint: "STRFTIME('%m', data)",
    tableSetup: ["CREATE TABLE sazonal (venda_id INTEGER, data TEXT);", "INSERT INTO sazonal VALUES (1, '2023-01-10'), (2, '2023-12-25');"],
    expectedOutput: [{ venda_id: 1, mes: '01' }, { venda_id: 2, mes: '12' }],
    initialQuery: "SELECT venda_id, STRFTIME('%m', data) as mes FROM sazonal"
  },
  {
    id: 'sql-i-date-5',
    track: 'sql',
    rank: 'Analyst',
    title: 'Eventos em Finais de Semana',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Identifique eventos que caem no domingo (STRFTIME '%w' = '0').",
    hint: "STRFTIME('%w', data) = '0'",
    tableSetup: ["CREATE TABLE agenda (evento TEXT, data TEXT);", "INSERT INTO agenda VALUES ('Reunião', '2024-04-19'), ('Evento Top', '2024-04-21');"],
    expectedOutput: [{ evento: 'Evento Top' }],
    initialQuery: "SELECT evento FROM agenda WHERE STRFTIME('%w', data) = '0'"
  },

  // SQL - EXP (Completando 5)
  {
    id: 'sql-a-exp-2',
    track: 'sql',
    rank: 'Expert',
    title: 'Cálculo de ROI (Retorno sobre Investimento)',
    difficulty: 'Avançado',
    category: 'EXP',
    description: "Calcule the ROI por campanha: (Receita - Gasto) / Gasto.",
    hint: "(receita - gasto) / gasto",
    tableSetup: ["CREATE TABLE ads (campanha TEXT, gasto REAL, receita REAL);", "INSERT INTO ads VALUES ('BlackFriday', 1000, 5000), ('Natal', 2000, 3000);"],
    expectedOutput: [{ campanha: 'BlackFriday', roi: 4.0 }, { campanha: 'Natal', roi: 0.5 }],
    initialQuery: 'SELECT campanha, (receita - gasto) / gasto as roi FROM ads'
  },
  {
    id: 'sql-a-exp-3',
    track: 'sql',
    rank: 'Expert',
    title: 'Taxa de Conversão de Cliques',
    difficulty: 'Avançado',
    category: 'EXP',
    description: "Determine a conversão: Vendas / Cliques.",
    hint: "CAST(vendas AS REAL) / cliques",
    tableSetup: ["CREATE TABLE funnel (cliques INTEGER, vendas INTEGER);", "INSERT INTO funnel VALUES (1000, 50), (2000, 20);"],
    expectedOutput: [{ conversao: 0.05 }, { conversao: 0.01 }],
    initialQuery: 'SELECT CAST(vendas AS REAL) / cliques as conversao FROM funnel'
  },
  {
    id: 'sql-a-exp-4',
    track: 'sql',
    rank: 'Expert',
    title: 'Margem de Lucro Bruta',
    difficulty: 'Avançado',
    category: 'EXP',
    description: "Lucro / Receita * 100.",
    hint: "(receita - custo) / receita * 100",
    tableSetup: ["CREATE TABLE margin (p TEXT, receita REAL, custo REAL);", "INSERT INTO margin VALUES ('A', 100, 60), ('B', 100, 20);"],
    expectedOutput: [{ p: 'A', margem: 40.0 }, { p: 'B', margem: 80.0 }],
    initialQuery: 'SELECT p, (receita - custo) / receita * 100 as margem FROM margin'
  },
  {
    id: 'sql-a-exp-5',
    track: 'sql',
    rank: 'Expert',
    title: 'Crescimento Mês a Mês (MoM)',
    difficulty: 'Avançado',
    category: 'EXP',
    description: "Calcule a variação percentual de vendas entre Mês 2 e Mês 1.",
    hint: "(m2 - m1) / m1",
    tableSetup: ["CREATE TABLE mom (mes1 REAL, mes2 REAL);", "INSERT INTO mom VALUES (1000, 1200), (5000, 4500);"],
    expectedOutput: [{ variacao: 0.2 }, { variacao: -0.1 }],
    initialQuery: 'SELECT (mes2 - mes1) / mes1 as variacao FROM mom'
  },

  // SQL - HAVING (Completando 5)
  {
    id: 'sql-i-having-4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Cidades com Muitos Clientes',
    difficulty: 'Intermediário',
    category: 'HAVING',
    description: "Liste cidades que possuem mais de 10 clientes cadastrados.",
    hint: "GROUP BY cidade HAVING COUNT(*) > 10",
    tableSetup: ["CREATE TABLE clients_l (id INTEGER, cidade TEXT);", "INSERT INTO clients_l SELECT 1, 'SP' FROM (SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11);", "INSERT INTO clients_l VALUES (12, 'RJ');"],
    expectedOutput: [{ cidade: 'SP', total: 11 }],
    initialQuery: 'SELECT cidade, COUNT(*) as total FROM clients_l GROUP BY cidade HAVING total > 10'
  },
  {
    id: 'sql-i-having-5',
    track: 'sql',
    rank: 'Analyst',
    title: 'Produtos de Alta Performance',
    difficulty: 'Intermediário',
    category: 'HAVING',
    description: "Mostre produtos (IDs) cuja soma de vendas superou 1000.",
    hint: "GROUP BY pid HAVING SUM(valor) > 1000",
    tableSetup: ["CREATE TABLE sales_h (pid INTEGER, valor REAL);", "INSERT INTO sales_h VALUES (1, 600), (1, 500), (2, 800);"],
    expectedOutput: [{ pid: 1, total: 1100.0 }],
    initialQuery: 'SELECT pid, SUM(valor) as total FROM sales_h GROUP BY pid HAVING total > 1000'
  },

  // SQL - IS NULL (Completando 5)
  {
    id: 'sql-b-null-2',
    track: 'sql',
    rank: 'Junior',
    title: 'Clientes sem Endereço',
    difficulty: 'Básico',
    category: 'IS NULL',
    description: "Filtre todos os clientes que não possuem endereço cadastrado.",
    hint: "WHERE endereco IS NULL",
    tableSetup: ["CREATE TABLE addr (nome TEXT, endereco TEXT);", "INSERT INTO addr VALUES ('Ana', 'Rua A'), ('Beto', NULL);"],
    expectedOutput: [{ nome: 'Beto' }],
    initialQuery: 'SELECT nome FROM addr WHERE endereco IS NULL'
  },
  {
    id: 'sql-b-null-3',
    track: 'sql',
    rank: 'Junior',
    title: 'Pedidos sem Data de Entrega',
    difficulty: 'Básico',
    category: 'IS NULL',
    description: "Localize pedidos que ainda não foram entregues (data_entrega vazia).",
    hint: "WHERE data_entrega IS NULL",
    tableSetup: ["CREATE TABLE peds (id INTEGER, data_entrega TEXT);", "INSERT INTO peds VALUES (1, '2024-01-01'), (2, NULL);"],
    expectedOutput: [{ id: 2 }],
    initialQuery: 'SELECT id FROM peds WHERE data_entrega IS NULL'
  },
  {
    id: 'sql-b-null-4',
    track: 'sql',
    rank: 'Junior',
    title: 'Leads sem Telefone de Contato',
    difficulty: 'Básico',
    category: 'IS NULL',
    description: "Encontre leads que esqueceram de preencher o telefone.",
    hint: "WHERE telefone IS NULL",
    tableSetup: ["CREATE TABLE leads_t (nome TEXT, telefone TEXT);", "INSERT INTO leads_t VALUES ('Ana', '1234'), ('Leo', NULL);"],
    expectedOutput: [{ nome: 'Leo' }],
    initialQuery: 'SELECT nome FROM leads_t WHERE telefone IS NULL'
  },
  {
    id: 'sql-b-null-5',
    track: 'sql',
    rank: 'Junior',
    title: 'Campos Não Preenchidos em Perfil',
    difficulty: 'Básico',
    category: 'IS NULL',
    description: "Identifique quem não preencheu a biografia.",
    hint: "WHERE bio IS NULL",
    tableSetup: ["CREATE TABLE bio (nome TEXT, bio TEXT);", "INSERT INTO bio VALUES ('Ana', 'Olá!'), ('Bob', NULL);"],
    expectedOutput: [{ nome: 'Bob' }],
    initialQuery: 'SELECT nome FROM bio WHERE bio IS NULL'
  },

  // SQL - LEFT JOIN (Completando 5)
  {
    id: 'sql-i-lj-2',
    track: 'sql',
    rank: 'Analyst',
    title: 'Clientes sem Compras',
    difficulty: 'Intermediário',
    category: 'LEFT JOIN',
    description: "Apresente todos os clientes e seus pedidos. Filtre apenas aqueles que NUNCA fizeram um pedido.",
    hint: "LEFT JOIN pedidos ON ... WHERE pedidos.id IS NULL",
    tableSetup: ["CREATE TABLE c (id INTEGER, nome TEXT);", "CREATE TABLE p (cid INTEGER);", "INSERT INTO c VALUES (1, 'Ativo'), (2, 'Novo');", "INSERT INTO p VALUES (1);"],
    expectedOutput: [{ nome: 'Novo' }],
    initialQuery: 'SELECT c.nome FROM c LEFT JOIN p ON c.id = p.cid WHERE p.cid IS NULL'
  },
  {
    id: 'sql-i-lj-3',
    track: 'sql',
    rank: 'Analyst',
    title: 'Produtos sem Categoria',
    difficulty: 'Intermediário',
    category: 'LEFT JOIN',
    description: "Mostre todos os produtos e o nome de sua categoria. Se não houver, mostre nulo.",
    hint: "LEFT JOIN categorias ON ...",
    tableSetup: ["CREATE TABLE pr (nome TEXT, cid INTEGER);", "CREATE TABLE cat (id INTEGER, n TEXT);", "INSERT INTO pr VALUES ('Cabo', 1), ('Mouse', NULL);", "INSERT INTO cat VALUES (1, 'TI');"],
    expectedOutput: [{ nome: 'Cabo', n: 'TI' }, { nome: 'Mouse', n: null }],
    initialQuery: 'SELECT pr.nome, cat.n FROM pr LEFT JOIN cat ON pr.cid = cat.id'
  },
  {
    id: 'sql-i-lj-4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Departamentos sem Funcionários',
    difficulty: 'Intermediário',
    category: 'LEFT JOIN',
    description: "Identifique os departamentos que não possuem nenhum funcionário alocado.",
    hint: "LEFT JOIN funcionarios ON ... WHERE funcionarios.id IS NULL",
    tableSetup: ["CREATE TABLE d (id INTEGER, n TEXT);", "CREATE TABLE f (did INTEGER);", "INSERT INTO d VALUES (1, 'TI'), (2, 'RH');", "INSERT INTO f VALUES (1);"],
    expectedOutput: [{ n: 'RH' }],
    initialQuery: 'SELECT d.n FROM d LEFT JOIN f ON d.id = f.did WHERE f.did IS NULL'
  },
  {
    id: 'sql-i-lj-5',
    track: 'sql',
    rank: 'Analyst',
    title: 'Auditoria de Acessos por Usuário',
    difficulty: 'Intermediário',
    category: 'LEFT JOIN',
    description: "Liste todos os usuários cadastrados e a data do seu último acesso. Traga usuários que nunca acessaram também.",
    hint: "LEFT JOIN acessos ON ...",
    tableSetup: ["CREATE TABLE u (id INTEGER, nome TEXT);", "CREATE TABLE a (uid INTEGER, data TEXT);", "INSERT INTO u VALUES (1, 'Ana'), (2, 'Bob');", "INSERT INTO a VALUES (1, '2023-01-01');"],
    expectedOutput: [{ nome: 'Ana', data: '2023-01-01' }, { nome: 'Bob', data: null }],
    initialQuery: 'SELECT u.nome, a.data FROM u LEFT JOIN a ON u.id = a.uid'
  },

  // SQL - LIMIT (Completando 5)
  {
    id: 'sql-b-limit-2',
    track: 'sql',
    rank: 'Junior',
    title: 'Top 3 Vendedores',
    difficulty: 'Básico',
    category: 'LIMIT',
    description: "Mostre os 3 vendedores com maior volume de faturamento.",
    hint: "ORDER BY valor DESC LIMIT 3",
    tableSetup: ["CREATE TABLE vends (nome TEXT, valor REAL);", "INSERT INTO vends VALUES ('A', 100), ('B', 500), ('C', 300), ('D', 400);"],
    expectedOutput: [{ nome: 'B', valor: 500.0 }, { nome: 'D', valor: 400.0 }, { nome: 'C', valor: 300.0 }],
    initialQuery: 'SELECT * FROM vends ORDER BY valor DESC LIMIT 3',
    orderSensitive: true
  },
  {
    id: 'sql-b-limit-3',
    track: 'sql',
    rank: 'Junior',
    title: 'Página 2 de Feedback',
    difficulty: 'Básico',
    category: 'LIMIT',
    description: "Pule os 2 primeiros e mostre os próximos 2 feedbacks.",
    hint: "LIMIT 2 OFFSET 2",
    tableSetup: ["CREATE TABLE feed (id INTEGER, msg TEXT);", "INSERT INTO feed VALUES (1, 'E1'), (2, 'E2'), (3, 'E3'), (4, 'E4'), (5, 'E5');"],
    expectedOutput: [{ id: 3, msg: 'E3' }, { id: 4, msg: 'E4' }],
    initialQuery: 'SELECT * FROM feed LIMIT 2 OFFSET 2',
    orderSensitive: true
  },
  {
    id: 'sql-b-limit-4',
    track: 'sql',
    rank: 'Junior',
    title: 'Última Transação Registrada',
    difficulty: 'Básico',
    category: 'LIMIT',
    description: "Recupere apenas o registro mais recente da tabela de log.",
    hint: "ORDER BY id DESC LIMIT 1",
    tableSetup: ["CREATE TABLE logs_r (id INTEGER, log TEXT);", "INSERT INTO logs_r VALUES (1, 'Login'), (2, 'Logout');"],
    expectedOutput: [{ id: 2, log: 'Logout' }],
    initialQuery: 'SELECT * FROM logs_r ORDER BY id DESC LIMIT 1'
  },
  {
    id: 'sql-b-limit-5',
    track: 'sql',
    rank: 'Junior',
    title: 'Amostragem de Dados',
    difficulty: 'Básico',
    category: 'LIMIT',
    description: "A gerência pediu uma amostra rápida: pegue os 5 primeiros produtos.",
    hint: "LIMIT 5",
    tableSetup: ["CREATE TABLE p_amostra (id INTEGER);", "INSERT INTO p_amostra VALUES (1),(2),(3),(4),(5),(6),(7);"],
    expectedOutput: [{ id: 1 },{ id: 2 },{ id: 3 },{ id: 4 },{ id: 5 }],
    initialQuery: 'SELECT * FROM p_amostra LIMIT 5',
    orderSensitive: true
  },

  // SQL - MATH (Completando 5)
  {
    id: 'sql-i-math-2',
    track: 'sql',
    rank: 'Analyst',
    title: 'Cálculo de Área de Lotes',
    difficulty: 'Intermediário',
    category: 'MATH',
    description: "Área = Largura * Comprimento.",
    hint: "largura * comprimento",
    tableSetup: ["CREATE TABLE lotes (id INTEGER, largura REAL, comprimento REAL);", "INSERT INTO lotes VALUES (1, 10, 20), (2, 5, 50);"],
    expectedOutput: [{ id: 1, area: 200.0 }, { id: 2, area: 250.0 }],
    initialQuery: 'SELECT id, largura * comprimento as area FROM lotes'
  },
  {
    id: 'sql-i-math-3',
    track: 'sql',
    rank: 'Analyst',
    title: 'Imposto de Importação (Simulação)',
    difficulty: 'Intermediário',
    category: 'MATH',
    description: "Declare o valor + 15% de taxa.",
    hint: "valor * 1.15",
    tableSetup: ["CREATE TABLE itens_i (id INTEGER, valor REAL);", "INSERT INTO itens_i VALUES (1, 100), (2, 200);"],
    expectedOutput: [{ id: 1, total: 115.0 }, { id: 2, total: 230.0 }],
    initialQuery: 'SELECT id, valor * 1.15 as total FROM itens_i'
  },
  {
    id: 'sql-i-math-4',
    track: 'sql',
    rank: 'Analyst',
    title: 'Rateio de Despesas',
    difficulty: 'Intermediário',
    category: 'MATH',
    description: "Divida a despesa total por 4 pessoas.",
    hint: "valor / 4",
    tableSetup: ["CREATE TABLE despesas (id INTEGER, valor REAL);", "INSERT INTO despesas VALUES (1, 400), (2, 1000);"],
    expectedOutput: [{ id: 1, por_pessoa: 100.0 }, { id: 2, por_pessoa: 250.0 }],
    initialQuery: 'SELECT id, valor / 4 as por_pessoa FROM despesas'
  },
  {
    id: 'sql-i-math-5',
    track: 'sql',
    rank: 'Analyst',
    title: 'Diferença de Estoque',
    difficulty: 'Intermediário',
    category: 'MATH',
    description: "Diferença entre Estoque Físico e Estoque no Sistema.",
    hint: "fisico - sistema",
    tableSetup: ["CREATE TABLE invent_m (p TEXT, sistema INTEGER, fisico INTEGER);", "INSERT INTO invent_m VALUES ('A', 10, 8), ('B', 50, 55);"],
    expectedOutput: [{ p: 'A', diff: -2 }, { p: 'B', diff: 5 }],
    initialQuery: 'SELECT p, fisico - sistema as diff FROM invent_m'
  },

  // SQL - SUBQUERY (Completando 5)
  {
    id: 'sql-a-sub-4',
    track: 'sql',
    rank: 'Expert',
    title: 'Filtragem por Presença em Subquery',
    difficulty: 'Avançado',
    category: 'SUBQUERY',
    description: "Selecione produtos que NUNCA foram vendidos. Use NOT IN e uma subquery na tabela de vendas.",
    hint: "WHERE id NOT IN (SELECT pid FROM vendas)",
    tableSetup: ["CREATE TABLE p_list (id INTEGER, nome TEXT);", "CREATE TABLE s_list (pid INTEGER);", "INSERT INTO p_list VALUES (1, 'Vendido'), (2, 'Encalhado');", "INSERT INTO s_list VALUES (1);"],
    expectedOutput: [{ nome: 'Encalhado' }],
    initialQuery: 'SELECT nome FROM p_list WHERE id NOT IN (SELECT pid FROM s_list)'
  },
  {
    id: 'sql-a-sub-5',
    track: 'sql',
    rank: 'Expert',
    title: 'Maiores Salários Regionais via Subquery',
    difficulty: 'Avançado',
    category: 'SUBQUERY',
    description: "Encontre os funcionários que ganham o máximo absoluto da empresa.",
    hint: "WHERE salario = (SELECT MAX(salario) FROM ...)",
    tableSetup: ["CREATE TABLE f_sal (nome TEXT, salario REAL);", "INSERT INTO f_sal VALUES ('Ana', 5000), ('Bob', 9000), ('Caio', 9000);"],
    expectedOutput: [{ nome: 'Bob' }, { nome: 'Caio' }],
    initialQuery: 'SELECT nome FROM f_sal WHERE salario = (SELECT MAX(salario) FROM f_sal)'
  },

  // SQL - UNION (Completando 5)
  {
    id: 'sql-a-union-2',
    track: 'sql',
    rank: 'Expert',
    title: 'Lista de Contatos Consolidada',
    difficulty: 'Avançado',
    category: 'UNION',
    description: "Una o nome de clientes e o nome de fornecedores em uma única coluna 'Contatos'.",
    hint: "SELECT nome FROM clientes UNION SELECT nome FROM fornecedores",
    tableSetup: ["CREATE TABLE cl (nome TEXT);", "CREATE TABLE fo (nome TEXT);", "INSERT INTO cl VALUES ('Ana');", "INSERT INTO fo VALUES ('Tech Ltda');"],
    expectedOutput: [{ Contatos: 'Ana' }, { Contatos: 'Tech Ltda' }],
    initialQuery: 'SELECT nome as Contatos FROM cl UNION SELECT nome FROM fo'
  },
  {
    id: 'sql-a-union-3',
    track: 'sql',
    rank: 'Expert',
    title: 'União de Históricos de Anos Diferentes',
    difficulty: 'Avançado',
    category: 'UNION',
    description: "Combine os registros de `logs_2022` e `logs_2023`.",
    hint: "SELECT * FROM logs22 UNION ALL SELECT * FROM logs23",
    tableSetup: ["CREATE TABLE l22 (m TEXT);", "CREATE TABLE l23 (m TEXT);", "INSERT INTO l22 VALUES ('Erro 22');", "INSERT INTO l23 VALUES ('Erro 23');"],
    expectedOutput: [{ m: 'Erro 22' }, { m: 'Erro 23' }],
    initialQuery: 'SELECT m FROM l22 UNION ALL SELECT m FROM l23'
  },
  {
    id: 'sql-a-union-4',
    track: 'sql',
    rank: 'Expert',
    title: 'União de Perfis e Admins',
    difficulty: 'Avançado',
    category: 'UNION',
    description: "Retorne todos os emails dos administradores e usuários comuns em uma lista única.",
    hint: "SELECT email FROM admin UNION SELECT email FROM user",
    tableSetup: ["CREATE TABLE ad (email TEXT);", "CREATE TABLE us (email TEXT);", "INSERT INTO ad VALUES ('adm@t.com');", "INSERT INTO us VALUES ('usr@t.com');"],
    expectedOutput: [{ email: 'adm@t.com' }, { email: 'usr@t.com' }],
    initialQuery: 'SELECT email FROM ad UNION SELECT email FROM us'
  },
  {
    id: 'sql-a-union-5',
    track: 'sql',
    rank: 'Expert',
    title: 'Consolidando Vendas de Filiais',
    difficulty: 'Avançado',
    category: 'UNION',
    description: "Una os faturamentos da matriz e da filial.",
    hint: "UNION ALL",
    tableSetup: ["CREATE TABLE mat (v REAL);", "CREATE TABLE fil (v REAL);", "INSERT INTO mat VALUES (5000);", "INSERT INTO fil VALUES (2000);"],
    expectedOutput: [{ v: 5000.0 }, { v: 2000.0 }],
    initialQuery: 'SELECT v FROM mat UNION ALL SELECT v FROM fil'
  },

  // ==========================================
  // EXPANSÃO EXCEL: MÍNIMO 5 POR CATEGORIA
  // ==========================================

  // EXCEL - AVERAGEIF (Completando 5)
  {
    id: 'excel-i-avif-2',
    track: 'excel',
    rank: 'Analyst',
    title: 'Média de Preços Caros',
    difficulty: 'Intermediário',
    category: 'AVERAGEIF',
    description: "Média de preço onde valor > 100.",
    hint: "=MÉDIASE(B:B; '>100')",
    tableSetup: ["CREATE TABLE p_caros (p REAL);", "INSERT INTO p_caros VALUES (50), (150), (250);"],
    expectedOutput: [{ media: 200.0 }],
    initialQuery: "=MÉDIASE(B:B; '>100')"
  },
  {
    id: 'excel-i-avif-3',
    track: 'excel',
    rank: 'Analyst',
    title: 'Média de Lucro por Vendedor',
    difficulty: 'Intermediário',
    category: 'AVERAGEIF',
    description: "Média de lucro onde vendedor (A) é 'Zeca'.",
    hint: "=MÉDIASE(A:A; 'Zeca'; B:B)",
    tableSetup: ["CREATE TABLE lucros (nome TEXT, v REAL);", "INSERT INTO lucros VALUES ('Zeca', 100), ('Ana', 500), ('Zeca', 300);"],
    expectedOutput: [{ media: 200.0 }],
    initialQuery: "=MÉDIASE(A:A; 'Zeca'; B:B)"
  },
  {
    id: 'excel-i-avif-4',
    track: 'excel',
    rank: 'Analyst',
    title: 'Média de Idade por Setor',
    difficulty: 'Intermediário',
    category: 'AVERAGEIF',
    description: "Sua tarefa é encontrar a média de idade apenas para o setor 'RH'.",
    hint: "=MÉDIASE(B:B; 'RH'; C:C)",
    tableSetup: ["CREATE TABLE rh_idade (id INTEGER, setor TEXT, idade INTEGER);", "INSERT INTO rh_idade VALUES (1, 'RH', 30), (2, 'TI', 25), (3, 'RH', 40);"],
    expectedOutput: [{ m: 35.0 }],
    initialQuery: "=MÉDIASE(B:B; 'RH'; C:C)"
  },
  {
    id: 'excel-i-avif-5',
    track: 'excel',
    rank: 'Analyst',
    title: 'Média de Visualizações de Vídeos Curtos',
    difficulty: 'Intermediário',
    category: 'AVERAGEIF',
    description: "Calcule a média de 'views' onde a 'duracao' (A) é menor que 60 segundos.",
    hint: "=MÉDIASE(A:A; '<60'; B:B)",
    tableSetup: ["CREATE TABLE videos (dur INTEGER, views INTEGER);", "INSERT INTO videos VALUES (30, 1000), (90, 5000), (45, 2000);"],
    expectedOutput: [{ media_curtos: 1500.0 }],
    initialQuery: "=MÉDIASE(A:A; '<60'; B:B)"
  },

  // EXCEL - IF (Completando 5)
  {
    id: 'excel-b-if-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Passou ou Reprovou?',
    difficulty: 'Básico',
    category: 'IF',
    description: "Se a nota (A) for >= 6, retorne 'Aprovado', senão 'Reprovado'.",
    hint: "=SE(A2 >= 6; 'Aprovado'; 'Reprovado')",
    tableSetup: ["CREATE TABLE notas (n REAL);", "INSERT INTO notas VALUES (7.5), (4.0);"],
    expectedOutput: [{ res: 'Aprovado' }, { res: 'Reprovado' }],
    initialQuery: '=SE(A:A >= 6; "Aprovado"; "Reprovado")'
  },
  {
    id: 'excel-b-if-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Status de Entrega',
    difficulty: 'Básico',
    category: 'IF',
    description: "Se o campo A for 'OK', mostre 'Finalizado', senão 'Incompleto'.",
    hint: "=SE(A2 = 'OK'; 'Finalizado'; 'Incompleto')",
    tableSetup: ["CREATE TABLE status_c (s TEXT);", "INSERT INTO status_c VALUES ('OK'), ('NO');"],
    expectedOutput: [{ res: 'Finalizado' }, { res: 'Incompleto' }],
    initialQuery: '=SE(A:A = "OK"; "Finalizado"; "Incompleto")'
  },
  {
    id: 'excel-b-if-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Desconto por Volume',
    difficulty: 'Básico',
    category: 'IF',
    description: "Se quantidade (A) > 10, aplique 'Sim', senão 'Não' para desconto.",
    hint: "=SE(A2 > 10; 'Sim'; 'Não')",
    tableSetup: ["CREATE TABLE volume (q INTEGER);", "INSERT INTO volume VALUES (15), (5);"],
    expectedOutput: [{ desc: 'Sim' }, { desc: 'Não' }],
    initialQuery: '=SE(A:A > 10; "Sim"; "Não")'
  },
  {
    id: 'excel-b-if-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Turno de Trabalho',
    difficulty: 'Básico',
    category: 'IF',
    description: "Se a hora (A) for < 12, mostre 'Manhã', senão 'Tarde'.",
    hint: "=SE(A2 < 12; 'Manhã'; 'Tarde')",
    tableSetup: ["CREATE TABLE horas (h INTEGER);", "INSERT INTO horas VALUES (10), (15);"],
    expectedOutput: [{ turno: 'Manhã' }, { turno: 'Tarde' }],
    initialQuery: '=SE(A:A < 12; "Manhã"; "Tarde")'
  },

  // EXCEL - VLOOKUP (Completando 5)
  {
    id: 'excel-b-vl-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Buscar Email por ID',
    difficulty: 'Básico',
    category: 'VLOOKUP',
    description: "Use PROCV para encontrar o email do usuário com ID 1.",
    hint: "=PROCV(1; A:B; 2; 0)",
    tableSetup: ["CREATE TABLE users_e (id INTEGER, email TEXT);", "INSERT INTO users_e VALUES (1, 'ana@t.com'), (2, 'bob@t.com');"],
    expectedOutput: [{ email: 'ana@t.com' }],
    initialQuery: "=PROCV(1; A:B; 2; 0)"
  },
  {
    id: 'excel-b-vl-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Buscar Pontuação de Aluno',
    difficulty: 'Básico',
    category: 'VLOOKUP',
    description: "Busque a pontuação da 'Ana' na tabela A:B.",
    hint: "=PROCV('Ana'; A:B; 2; 0)",
    tableSetup: ["CREATE TABLE grades (nome TEXT, pontos INTEGER);", "INSERT INTO grades VALUES ('Leo', 80), ('Ana', 95);"],
    expectedOutput: [{ pontos: 95 }],
    initialQuery: "=PROCV('Ana'; A:B; 2; 0)"
  },
  {
    id: 'excel-b-vl-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Buscar Descrição de Erro',
    difficulty: 'Básico',
    category: 'VLOOKUP',
    description: "Procure o significado do erro 404 na coluna B.",
    hint: "=PROCV(404; A:B; 2; 0)",
    tableSetup: ["CREATE TABLE err_ref (code INTEGER, msg TEXT);", "INSERT INTO err_ref VALUES (200, 'OK'), (404, 'Not Found');"],
    expectedOutput: [{ msg: 'Not Found' }],
    initialQuery: "=PROCV(404; A:B; 2; 0)"
  },

  // EXCEL - MIN/MAX (Completando 5)
  {
    id: 'excel-b-mm-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Menor Preço de Custo',
    difficulty: 'Básico',
    category: 'MIN/MAX',
    description: "Encontre o menor preço de custo na coluna B.",
    hint: "=MÍN(B:B)",
    tableSetup: ["CREATE TABLE custos (item TEXT, v REAL);", "INSERT INTO custos VALUES ('A', 10.5), ('B', 5.0), ('C', 15.0);"],
    expectedOutput: [{ min_v: 5.0 }],
    initialQuery: '=MÍN(B:B)'
  },
  {
    id: 'excel-b-mm-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Maior Quantidade Vendida',
    difficulty: 'Básico',
    category: 'MIN/MAX',
    description: "Qual a maior quantidade vendida na coluna B?",
    hint: "=MÁX(B:B)",
    tableSetup: ["CREATE TABLE qtds (item TEXT, q INTEGER);", "INSERT INTO qtds VALUES ('A', 100), ('B', 500);"],
    expectedOutput: [{ max_q: 500 }],
    initialQuery: '=MÁX(B:B)'
  },
  {
    id: 'excel-b-mm-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Menor Temperatura da Semana',
    difficulty: 'Básico',
    category: 'MIN/MAX',
    description: "Identifique a menor temperatura registrada (B).",
    hint: "=MÍN(B:B)",
    tableSetup: ["CREATE TABLE temps_w (dia TEXT, t REAL);", "INSERT INTO temps_w VALUES ('Seg', 22), ('Ter', 18), ('Qua', 25);"],
    expectedOutput: [{ min_t: 18.0 }],
    initialQuery: '=MÍN(B:B)'
  },
  {
    id: 'excel-b-mm-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Maior Nota do Concurso',
    difficulty: 'Básico',
    category: 'MIN/MAX',
    description: "Determine a nota máxima da coluna B.",
    hint: "=MÁX(B:B)",
    tableSetup: ["CREATE TABLE conc (nome TEXT, nota REAL);", "INSERT INTO conc VALUES ('A', 85), ('B', 99), ('C', 70);"],
    expectedOutput: [{ max_n: 99.0 }],
    initialQuery: '=MÁX(B:B)'
  },

  // EXCEL - FILTER (Completando 5)
  {
    id: 'excel-b-filt-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Filtrar por Departamento',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Filtre todos os funcionários do departamento 'TI'.",
    hint: "WHERE depto = 'TI'",
    tableSetup: ["CREATE TABLE func (nome TEXT, depto TEXT);", "INSERT INTO func VALUES ('Ana', 'TI'), ('Bob', 'RH'), ('Caio', 'TI');"],
    expectedOutput: [{ nome: 'Ana', depto: 'TI' }, { nome: 'Caio', depto: 'TI' }],
    initialQuery: "SELECT * FROM func WHERE depto = 'TI'"
  },
  {
    id: 'excel-b-filt-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Filtrar Produtos Ativos',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Mostre apenas produtos com status 'Ativo'.",
    hint: "WHERE status = 'Ativo'",
    tableSetup: ["CREATE TABLE prods (nome TEXT, status TEXT);", "INSERT INTO prods VALUES ('A', 'Ativo'), ('B', 'Inativo');"],
    expectedOutput: [{ nome: 'A', status: 'Ativo' }],
    initialQuery: "SELECT * FROM prods WHERE status = 'Ativo'"
  },
  {
    id: 'excel-b-filt-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Filtrar por Valor Baixo',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Filtre itens com preço inferior a 10.",
    hint: "WHERE preco < 10",
    tableSetup: ["CREATE TABLE prec (item TEXT, preco REAL);", "INSERT INTO prec VALUES ('A', 5), ('B', 15);"],
    expectedOutput: [{ item: 'A', preco: 5.0 }],
    initialQuery: 'SELECT * FROM prec WHERE preco < 10'
  },
  {
    id: 'excel-b-filt-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Filtrar por Inicial',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Filtre nomes que começam com a letra 'A'.",
    hint: "WHERE nome LIKE 'A%'",
    tableSetup: ["CREATE TABLE nomes_f (nome TEXT);", "INSERT INTO nomes_f VALUES ('Ana'), ('Beto'), ('Alice');"],
    expectedOutput: [{ nome: 'Ana' }, { nome: 'Alice' }],
    initialQuery: "SELECT * FROM nomes_f WHERE nome LIKE 'A%'"
  },

  // EXCEL - ROUND (Completando 5)
  {
    id: 'excel-i-rnd-3',
    track: 'excel',
    rank: 'Analyst',
    title: 'Arredondar Médias Escolares',
    difficulty: 'Intermediário',
    category: 'ROUND',
    description: "Arredonde as médias na coluna B para 1 casa decimal.",
    hint: "=ARRED(B:B; 1)",
    tableSetup: ["CREATE TABLE med (aluno TEXT, nota REAL);", "INSERT INTO med VALUES ('A', 8.55), ('B', 7.21);"],
    expectedOutput: [{ aluno: 'A', res: 8.6 }, { aluno: 'B', res: 7.2 }],
    initialQuery: '=ARRED(B:B; 1)'
  },
  {
    id: 'excel-i-rnd-4',
    track: 'excel',
    rank: 'Analyst',
    title: 'Arredondar Moedas Estrangeiras',
    difficulty: 'Intermediário',
    category: 'ROUND',
    description: "Arredonde a conversão de moeda na coluna B para 2 casas.",
    hint: "=ARRED(B:B; 2)",
    tableSetup: ["CREATE TABLE conv (v REAL);", "INSERT INTO conv VALUES (5.1234), (4.5678);"],
    expectedOutput: [{ res: 5.12 }, { res: 4.57 }],
    initialQuery: '=ARRED(B:B; 2)'
  },
  {
    id: 'excel-i-rnd-5',
    track: 'excel',
    rank: 'Analyst',
    title: 'Arredondar para Inteiro Próximo',
    difficulty: 'Intermediário',
    category: 'ROUND',
    description: "Arredonde os pesos na coluna B para 0 casas decimais.",
    hint: "=ARRED(B:B; 0)",
    tableSetup: ["CREATE TABLE pesos_w (v REAL);", "INSERT INTO pesos_w VALUES (10.6), (9.4);"],
    expectedOutput: [{ res: 11.0 }, { res: 9.0 }],
    initialQuery: '=ARRED(B:B; 0)'
  },

  // EXCEL - LEFT (Completando 5)
  {
    id: 'excel-b-l-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Prefixo de Código',
    difficulty: 'Básico',
    category: 'LEFT',
    description: "Pegue os 3 primeiros caracteres do código (A).",
    hint: "=ESQUERDA(A:A; 3)",
    tableSetup: ["CREATE TABLE codes (c TEXT);", "INSERT INTO codes VALUES ('ABC-123'), ('XYZ-999');"],
    expectedOutput: [{ res: 'ABC' }, { res: 'XYZ' }],
    initialQuery: '=ESQUERDA(A:A; 3)'
  },
  {
    id: 'excel-b-l-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Inicial do Nome',
    difficulty: 'Básico',
    category: 'LEFT',
    description: "Extraia apenas a primeira letra do nome na coluna A.",
    hint: "=ESQUERDA(A:A; 1)",
    tableSetup: ["CREATE TABLE names (n TEXT);", "INSERT INTO names VALUES ('Ana'), ('Bob');"],
    expectedOutput: [{ res: 'A' }, { res: 'B' }],
    initialQuery: '=ESQUERDA(A:A; 1)'
  },
  {
    id: 'excel-b-l-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Código do País em DDI',
    difficulty: 'Básico',
    category: 'LEFT',
    description: "Pegue os 2 dígitos do DDI na coluna A.",
    hint: "=ESQUERDA(A:A; 2)",
    tableSetup: ["CREATE TABLE phones (p TEXT);", "INSERT INTO phones VALUES ('55-11-999'), ('01-212-333');"],
    expectedOutput: [{ ddi: '55' }, { ddi: '01' }],
    initialQuery: '=ESQUERDA(A:A; 2)'
  },
  {
    id: 'excel-b-l-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Ano de Lote curto',
    difficulty: 'Básico',
    category: 'LEFT',
    description: "Extraia os 4 primeiros caracteres da string de lote que representam o ano.",
    hint: "=ESQUERDA(A:A; 4)",
    tableSetup: ["CREATE TABLE lotes_t (l TEXT);", "INSERT INTO lotes_t VALUES ('2023-X-1'), ('2024-Y-2');"],
    expectedOutput: [{ ano: '2023' }, { ano: '2024' }],
    initialQuery: '=ESQUERDA(A:A; 4)'
  },

  // EXCEL - RIGHT (Completando 5)
  {
    id: 'excel-b-r-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Extensão de Arquivo',
    difficulty: 'Básico',
    category: 'RIGHT',
    description: "Pegue os 3 últimos caracteres do nome do arquivo.",
    hint: "=DIREITA(A:A; 3)",
    tableSetup: ["CREATE TABLE files (f TEXT);", "INSERT INTO files VALUES ('doc.pdf'), ('img.jpg');"],
    expectedOutput: [{ ext: 'pdf' }, { ext: 'jpg' }],
    initialQuery: '=DIREITA(A:A; 3)'
  },
  {
    id: 'excel-b-r-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Últimos 4 Dígitos do CPF',
    difficulty: 'Básico',
    category: 'RIGHT',
    description: "Extraia o final do documento na coluna A.",
    hint: "=DIREITA(A:A; 4)",
    tableSetup: ["CREATE TABLE docs (d TEXT);", "INSERT INTO docs VALUES ('123.456.789-00'), ('987.654.321-11');"],
    expectedOutput: [{ fim: '9-00' }, { fim: '1-11' }],
    initialQuery: '=DIREITA(A:A; 4)'
  },
  {
    id: 'excel-b-r-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Sufixo de SKU',
    difficulty: 'Básico',
    category: 'RIGHT',
    description: "Pegue o sufixo de 2 letras do SKU.",
    hint: "=DIREITA(A:A; 2)",
    tableSetup: ["CREATE TABLE skus_s (s TEXT);", "INSERT INTO skus_s VALUES ('SKU123-BR'), ('SKU999-US');"],
    expectedOutput: [{ uf: 'BR' }, { uf: 'US' }],
    initialQuery: '=DIREITA(A:A; 2)'
  },
  {
    id: 'excel-b-r-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Digito Verificador de Agência',
    difficulty: 'Básico',
    category: 'RIGHT',
    description: "Pegue o último caractere da agência bancária.",
    hint: "=DIREITA(A:A; 1)",
    tableSetup: ["CREATE TABLE agency (a TEXT);", "INSERT INTO agency VALUES ('1234-5'), ('0001-X');"],
    expectedOutput: [{ dv: '5' }, { dv: 'X' }],
    initialQuery: '=DIREITA(A:A; 1)'
  },

  // EXCEL - MID (Completando 5)
  {
    id: 'excel-i-m-2',
    track: 'excel',
    rank: 'Analyst',
    title: 'Extrair DDD do Meio',
    difficulty: 'Intermediário',
    category: 'MID',
    description: "Extraia o DDD entre parênteses: '(11) 9...' (caracteres 2, 3 e 4).",
    hint: "=EXT.TEXTO(A:A; 2; 2)",
    tableSetup: ["CREATE TABLE phones_d (p TEXT);", "INSERT INTO phones_d VALUES ('(11) 99'), ('(21) 88');"],
    expectedOutput: [{ ddd: '11' }, { ddd: '21' }],
    initialQuery: '=EXT.TEXTO(A:A; 2; 2)'
  },
  {
    id: 'excel-i-m-3',
    track: 'excel',
    rank: 'Analyst',
    title: 'Dígitos Centrais de Cartão',
    difficulty: 'Intermediário',
    category: 'MID',
    description: "Extraia 4 dígitos a partir da posição 5 do cartão de crédito.",
    hint: "=EXT.TEXTO(A:A; 5; 4)",
    tableSetup: ["CREATE TABLE cards (n TEXT);", "INSERT INTO cards VALUES ('1234-5678-9000'), ('5555-4444-3333');"],
    expectedOutput: [{ res: '5678' }, { res: '4444' }],
    initialQuery: '=EXT.TEXTO(A:A; 5; 4)'
  },
  {
    id: 'excel-i-m-4',
    track: 'excel',
    rank: 'Analyst',
    title: 'Mês em Código de Lote',
    difficulty: 'Intermediário',
    category: 'MID',
    description: "Lote tipo '2023-05-A'. Extraia o mês (caracteres 6 e 7).",
    hint: "=EXT.TEXTO(A:A; 6; 2)",
    tableSetup: ["CREATE TABLE lotes_m (l TEXT);", "INSERT INTO lotes_m VALUES ('2023-11-A'), ('2024-01-B');"],
    expectedOutput: [{ mes: '11' }, { mes: '01' }],
    initialQuery: '=EXT.TEXTO(A:A; 6; 2)'
  },
  {
    id: 'excel-i-m-5',
    track: 'excel',
    rank: 'Analyst',
    title: 'Identificador de Categoria no SKU',
    difficulty: 'Intermediário',
    category: 'MID',
    description: "Dado o SKU 'E-OFF-101', extraia a categoria do meio 'OFF' (caracteres 3 a 5).",
    hint: "=EXT.TEXTO(A:A; 3; 3)",
    tableSetup: ["CREATE TABLE skus_i (s TEXT);", "INSERT INTO skus_i VALUES ('A-PRO-001'), ('B-VIP-999');"],
    expectedOutput: [{ cat: 'PRO' }, { cat: 'VIP' }],
    initialQuery: '=EXT.TEXTO(A:A; 3; 3)'
  },

  // EXCEL - LEN (Completando 5)
  {
    id: 'excel-b-len-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Contar Caracteres de Senha',
    difficulty: 'Básico',
    category: 'LEN',
    description: "Verifique o comprimento da senha na coluna A.",
    hint: "=NÚM.CARACT(A:A)",
    tableSetup: ["CREATE TABLE passwords (p TEXT);", "INSERT INTO passwords VALUES ('123'), ('pass123');"],
    expectedOutput: [{ res: 3 }, { res: 7 }],
    initialQuery: '=NÚM.CARACT(A:A)'
  },
  {
    id: 'excel-b-len-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Tamanho de Comentário',
    difficulty: 'Básico',
    category: 'LEN',
    description: "Determine o tamanho das mensagens de feedback.",
    hint: "=NÚM.CARACT(A:A)",
    tableSetup: ["CREATE TABLE feedback_l (f TEXT);", "INSERT INTO feedback_l VALUES ('Bom'), ('Excelente serviço');"],
    expectedOutput: [{ res: 3 }, { res: 17 }],
    initialQuery: '=NÚM.CARACT(A:A)'
  },
  {
    id: 'excel-b-len-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Validar Tamanho de ID',
    difficulty: 'Básico',
    category: 'LEN',
    description: "Conte os dígitos do ID na coluna A.",
    hint: "=NÚM.CARACT(A:A)",
    tableSetup: ["CREATE TABLE ids_l (id TEXT);", "INSERT INTO ids_l VALUES ('ID-01'), ('ID-100');"],
    expectedOutput: [{ res: 5 }, { res: 6 }],
    initialQuery: '=NÚM.CARACT(A:A)'
  },
  {
    id: 'excel-b-len-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Contagem de Letras em Nome',
    difficulty: 'Básico',
    category: 'LEN',
    description: "Qual o tamanho do nome completo na coluna A?",
    hint: "=NÚM.CARACT(A:A)",
    tableSetup: ["CREATE TABLE full_n (n TEXT);", "INSERT INTO full_n VALUES ('Ana Maria'), ('Bob');"],
    expectedOutput: [{ res: 9 }, { res: 3 }],
    initialQuery: '=NÚM.CARACT(A:A)'
  },

  // EXCEL - TRIM (Completando 5)
  {
    id: 'excel-b-trim-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Limpeza de Espaços em Emails',
    difficulty: 'Básico',
    category: 'TRIM',
    description: "Remova espaços indesejados nos emails da coluna A.",
    hint: "=ARRUMAR(A:A)",
    tableSetup: ["CREATE TABLE emails_s (e TEXT);", "INSERT INTO emails_s VALUES (' ana@t.com'), ('bob@t.com ');"],
    expectedOutput: [{ res: 'ana@t.com' }, { res: 'bob@t.com' }],
    initialQuery: '=ARRUMAR(A:A)'
  },
  {
    id: 'excel-b-trim-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Normalizar Códigos de Barra',
    difficulty: 'Básico',
    category: 'TRIM',
    description: "Limpe os espaços ao redor dos códigos de barra.",
    hint: "=ARRUMAR(A:A)",
    tableSetup: ["CREATE TABLE bar (c TEXT);", "INSERT INTO bar VALUES ('  789  '), ('456  ');"],
    expectedOutput: [{ res: '789' }, { res: '456' }],
    initialQuery: '=ARRUMAR(A:A)'
  },
  {
    id: 'excel-b-trim-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Arrumar Cidades',
    difficulty: 'Básico',
    category: 'TRIM',
    description: "Trate os nomes das cidades na coluna A.",
    hint: "=ARRUMAR(A:A)",
    tableSetup: ["CREATE TABLE cities_s (c TEXT);", "INSERT INTO cities_s VALUES (' São Paulo '), ('Rio ');"],
    expectedOutput: [{ res: 'São Paulo' }, { res: 'Rio' }],
    initialQuery: '=ARRUMAR(A:A)'
  },
  {
    id: 'excel-b-trim-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Limpar Observações',
    difficulty: 'Básico',
    category: 'TRIM',
    description: "Remova espaços extras no campo de obs.",
    hint: "=ARRUMAR(A:A)",
    tableSetup: ["CREATE TABLE obs_s (o TEXT);", "INSERT INTO obs_s VALUES ('  Verificar  '), ('Urgente  ');"],
    expectedOutput: [{ res: 'Verificar' }, { res: 'Urgente' }],
    initialQuery: '=ARRUMAR(A:A)'
  },

  // EXCEL - SUBSTITUTE (Completando 5)
  {
    id: 'excel-b-subst-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Trocar Vírgula por Ponto',
    difficulty: 'Básico',
    category: 'SUBSTITUTE',
    description: "Substitua ',' por '.' no texto da coluna A.",
    hint: "=SUBSTITUIR(A:A; ','; '.')",
    tableSetup: ["CREATE TABLE commas (tx TEXT);", "INSERT INTO commas VALUES ('10,5'), ('20,0');"],
    expectedOutput: [{ res: '10.5' }, { res: '20.0' }],
    initialQuery: '=SUBSTITUIR(A:A; ","; ".")'
  },
  {
    id: 'excel-b-subst-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Mudar Caractere de Separação',
    difficulty: 'Básico',
    category: 'SUBSTITUTE',
    description: "Troque o caractere '/' por '-' nas datas em texto.",
    hint: "=SUBSTITUIR(A:A; '/'; '-')",
    tableSetup: ["CREATE TABLE slash (d TEXT);", "INSERT INTO slash VALUES ('2023/01/01');"],
    expectedOutput: [{ res: '2023-01-01' }],
    initialQuery: '=SUBSTITUIR(A:A; "/"; "-")'
  },
  {
    id: 'excel-b-subst-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Remover Parênteses',
    difficulty: 'Básico',
    category: 'SUBSTITUTE',
    description: "Remova o '(' do texto na coluna A.",
    hint: "=SUBSTITUIR(A:A; '('; '')",
    tableSetup: ["CREATE TABLE paren (t TEXT);", "INSERT INTO paren VALUES ('(SP)'), ('(RJ)');"],
    expectedOutput: [{ res: 'SP)' }, { res: 'RJ)' }],
    initialQuery: '=SUBSTITUIR(A:A; "("; "")'
  },
  {
    id: 'excel-b-subst-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Trocar Espaço por Underline',
    difficulty: 'Básico',
    category: 'SUBSTITUTE',
    description: "Prepare o nome de usuário trocando espaços por '_'.",
    hint: "=SUBSTITUIR(A:A; ' '; '_')",
    tableSetup: ["CREATE TABLE users_s (n TEXT);", "INSERT INTO users_s VALUES ('ana maria'), ('bob santos');"],
    expectedOutput: [{ res: 'ana_maria' }, { res: 'bob_santos' }],
    initialQuery: '=SUBSTITUIR(A:A; " "; "_")'
  },

  // EXCEL - ISNUMBER (Completando 5)
  {
    id: 'excel-b-isnum-2',
    track: 'excel',
    rank: 'Junior',
    title: 'Filtrar apenas Números',
    difficulty: 'Básico',
    category: 'ISNUMBER',
    description: "Retorne VERDADEIRO para valores numéricos.",
    hint: "=ÉNUM(A:A)",
    tableSetup: ["CREATE TABLE test_n (v TEXT);", "INSERT INTO test_n VALUES ('100'), ('abc');"],
    expectedOutput: [{ res: 1 }, { res: 0 }],
    initialQuery: '=ÉNUM(A:A)'
  },
  {
    id: 'excel-b-isnum-3',
    track: 'excel',
    rank: 'Junior',
    title: 'Validar Campo Quantidade',
    difficulty: 'Básico',
    category: 'ISNUMBER',
    description: "A coluna A contém a quantidade. Verifique se é número.",
    hint: "=ÉNUM(A:A)",
    tableSetup: ["CREATE TABLE qty_v (q TEXT);", "INSERT INTO qty_v VALUES ('10'), ('vazio');"],
    expectedOutput: [{ res: 1 }, { res: 0 }],
    initialQuery: '=ÉNUM(A:A)'
  },
  {
    id: 'excel-b-isnum-4',
    track: 'excel',
    rank: 'Junior',
    title: 'Check de Tipo de Dado',
    difficulty: 'Básico',
    category: 'ISNUMBER',
    description: "Retorne VERDADEIRO se o conteúdo for numérico.",
    hint: "=ÉNUM(A:A)",
    tableSetup: ["CREATE TABLE type_c (v TEXT);", "INSERT INTO type_c VALUES ('5.5'), ('texto');"],
    expectedOutput: [{ res: 1 }, { res: 0 }],
    initialQuery: '=ÉNUM(A:A)'
  },
  {
    id: 'excel-b-isnum-5',
    track: 'excel',
    rank: 'Junior',
    title: 'Identificar Anos Válidos',
    difficulty: 'Básico',
    category: 'ISNUMBER',
    description: "Anos devem ser números. Verifique a coluna A.",
    hint: "=ÉNUM(A:A)",
    tableSetup: ["CREATE TABLE years_v (y TEXT);", "INSERT INTO years_v VALUES ('2023'), ('não');"],
    expectedOutput: [{ res: 1 }, { res: 0 }],
    initialQuery: '=ÉNUM(A:A)'
  },

  // EXCEL - INDEX/MATCH (Completando 5)
  {
    id: 'excel-i-im-2',
    track: 'excel',
    rank: 'Analyst',
    title: 'Buscar Cargo por Nome',
    difficulty: 'Intermediário',
    category: 'INDEX',
    description: "Use ÍNDICE/CORRESP para buscar o cargo (E) do funcionário (A).",
    hint: "=ÍNDICE(E:E; CORRESP(A:A; D:D; 0))",
    tableSetup: ["CREATE TABLE f_req (n TEXT);", "CREATE TABLE f_ref (nome TEXT, cargo TEXT);", "INSERT INTO f_req VALUES ('Ana');", "INSERT INTO f_ref VALUES ('Ana', 'Dev');"],
    expectedOutput: [{ res: 'Dev' }],
    initialQuery: "=ÍNDICE(E:E; CORRESP(A:A; D:D; 0))"
  },
  {
    id: 'excel-i-im-3',
    track: 'excel',
    rank: 'Analyst',
    title: 'Buscar Estoque Alternativo',
    difficulty: 'Intermediário',
    category: 'INDEX',
    description: "Busque a quantidade em estoque do item na coluna A.",
    hint: "=ÍNDICE(E:E; CORRESP(A:A; D:D; 0))",
    tableSetup: ["CREATE TABLE i_req (i TEXT);", "CREATE TABLE i_ref (item TEXT, q INTEGER);", "INSERT INTO i_req VALUES ('Pá');", "INSERT INTO i_ref VALUES ('Pá', 50);"],
    expectedOutput: [{ res: 50 }],
    initialQuery: "=ÍNDICE(E:E; CORRESP(A:A; D:D; 0))"
  },
  {
    id: 'excel-i-im-4',
    track: 'excel',
    rank: 'Analyst',
    title: 'Buscar Nível de Acesso',
    difficulty: 'Intermediário',
    category: 'INDEX',
    description: "Encontre o nível de acesso do usuário logado.",
    hint: "=ÍNDICE(E:E; CORRESP(A:A; D:D; 0))",
    tableSetup: ["CREATE TABLE u_req (u TEXT);", "CREATE TABLE u_ref (user TEXT, nvl TEXT);", "INSERT INTO u_req VALUES ('Admin');", "INSERT INTO u_ref VALUES ('Admin', 'Total');"],
    expectedOutput: [{ res: 'Total' }],
    initialQuery: "=ÍNDICE(E:E; CORRESP(A:A; D:D; 0))"
  },
  {
    id: 'excel-i-im-5',
    track: 'excel',
    rank: 'Analyst',
    title: 'Buscar Código de Rastreio',
    difficulty: 'Intermediário',
    category: 'INDEX',
    description: "Obtenha o código de rastreio para o pedido (A).",
    hint: "=ÍNDICE(E:E; CORRESP(A:A; D:D; 0))",
    tableSetup: ["CREATE TABLE p_req (id INTEGER);", "CREATE TABLE p_ref (id INTEGER, track TEXT);", "INSERT INTO p_req VALUES (101);", "INSERT INTO p_ref VALUES (101, 'BR123');"],
    expectedOutput: [{ res: 'BR123' }],
    initialQuery: "=ÍNDICE(E:E; CORRESP(A:A; D:D; 0))"
  },

  // EXCEL - DATE (Completando 5)
  {
    id: 'excel-i-date-2',
    track: 'excel',
    rank: 'Analyst',
    title: 'Diferença de Dias Úteis (Simulado)',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Calcule os dias entre a data A e B.",
    hint: "=B:B - A:A",
    tableSetup: ["CREATE TABLE date_diff (a TEXT, b TEXT);", "INSERT INTO date_diff VALUES ('2023-01-01', '2023-01-10');"],
    expectedOutput: [{ res: 9 }],
    initialQuery: "=B:B - A:A"
  },
  {
    id: 'excel-i-date-3',
    track: 'excel',
    rank: 'Analyst',
    title: 'Adicionar Dias a uma Data',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Some 30 dias à data na coluna A.",
    hint: "=A:A + 30",
    tableSetup: ["CREATE TABLE date_add (a TEXT);", "INSERT INTO date_add VALUES ('2023-01-01');"],
    expectedOutput: [{ res: '2023-01-31' }],
    initialQuery: "=A:A + 30"
  },
  {
    id: 'excel-i-date-4',
    track: 'excel',
    rank: 'Analyst',
    title: 'Verificar Atraso',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Se hoje (2024-04-20) for maior que o prazo (A), mostre 'Atrasado'.",
    hint: "=SE('2024-04-20' > A:A; 'Atrasado'; 'No Prazo')",
    tableSetup: ["CREATE TABLE deadlines (a TEXT);", "INSERT INTO deadlines VALUES ('2024-04-15'), ('2024-04-25');"],
    expectedOutput: [{ res: 'Atrasado' }, { res: 'No Prazo' }],
    initialQuery: "=SE('2024-04-20' > A:A; 'Atrasado'; 'No Prazo')"
  },
  {
    id: 'excel-i-date-5',
    track: 'excel',
    rank: 'Analyst',
    title: 'Contar Dias para o Fim do Ano',
    difficulty: 'Intermediário',
    category: 'DATE',
    description: "Diferença entre '2024-12-31' e a data na coluna A.",
    hint: "='2024-12-31' - A:A",
    tableSetup: ["CREATE TABLE year_end (a TEXT);", "INSERT INTO year_end VALUES ('2024-12-25');"],
    expectedOutput: [{ res: 6 }],
    initialQuery: "='2024-12-31' - A:A"
  },

  // ==========================================
  // PYTHON EXPANSION (Min 5 per Category)
  // ==========================================

  // PYTHON - BASICS (Completando 5)
  {
    id: 'py-b-bas-2',
    track: 'python',
    rank: 'Junior',
    title: 'Visualizar Primeiras Linhas',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df.head(2)`. Retorne as 2 primeiras linhas da tabela.",
    hint: "LIMIT 2",
    tableSetup: ["CREATE TABLE df (id INTEGER, val TEXT);", "INSERT INTO df VALUES (1, 'A'), (2, 'B'), (3, 'C');"],
    expectedOutput: [{ id: 1, val: 'A' }, { id: 2, val: 'B' }],
    initialQuery: 'df.head(2)',
    orderSensitive: true
  },
  {
    id: 'py-b-bas-3',
    track: 'python',
    rank: 'Junior',
    title: 'Visualizar Últimas Linhas',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df.tail(1)`. Retorne a última linha.",
    hint: "ORDER BY id DESC LIMIT 1",
    tableSetup: ["CREATE TABLE df (id INTEGER, val TEXT);", "INSERT INTO df VALUES (1, 'A'), (2, 'B');"],
    expectedOutput: [{ id: 2, val: 'B' }],
    initialQuery: 'df.tail(1)'
  },
  {
    id: 'py-b-bas-4',
    track: 'python',
    rank: 'Junior',
    title: 'Seleção de Coluna Única',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df['nome']`. Selecione apenas a coluna nome.",
    hint: "SELECT nome FROM df",
    tableSetup: ["CREATE TABLE df (id INTEGER, nome TEXT);", "INSERT INTO df VALUES (1, 'Ana'), (2, 'Bob');"],
    expectedOutput: [{ nome: 'Ana' }, { nome: 'Bob' }],
    initialQuery: "df['nome']"
  },
  {
    id: 'py-b-bas-5',
    track: 'python',
    rank: 'Junior',
    title: 'Seleção de Múltiplas Colunas',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df[['id', 'valor']]`. Selecione as colunas id e valor.",
    hint: "SELECT id, valor FROM df",
    tableSetup: ["CREATE TABLE df (id INTEGER, nome TEXT, valor REAL);", "INSERT INTO df VALUES (1, 'A', 10.5);"],
    expectedOutput: [{ id: 1, valor: 10.5 }],
    initialQuery: "df[['id', 'valor']]"
  },

  // PYTHON - FILTER (Completando 5)
  {
    id: 'py-b-filt-2',
    track: 'python',
    rank: 'Junior',
    title: 'Filtrar por Valor Numérico',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[df['idade'] > 18]`. Filtre maiores de 18.",
    hint: "WHERE idade > 18",
    tableSetup: ["CREATE TABLE df (nome TEXT, idade INTEGER);", "INSERT INTO df VALUES ('Ana', 20), ('Bia', 15);"],
    expectedOutput: [{ nome: 'Ana', idade: 20 }],
    initialQuery: "df[df['idade'] > 18]"
  },
  {
    id: 'py-b-filt-3',
    track: 'python',
    rank: 'Junior',
    title: 'Filtrar com Múltiplas Condições',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[(df['cat'] == 'A') & (df['val'] > 10)]`.",
    hint: "WHERE cat = 'A' AND val > 10",
    tableSetup: ["CREATE TABLE df (cat TEXT, val REAL);", "INSERT INTO df VALUES ('A', 5), ('A', 15), ('B', 20);"],
    expectedOutput: [{ cat: 'A', val: 15 }],
    initialQuery: "df[(df['cat'] == 'A') & (df['val'] > 10)]"
  },
  {
    id: 'py-b-filt-4',
    track: 'python',
    rank: 'Junior',
    title: 'Método Query',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df.query('status == \"Ativo\"')`.",
    hint: "WHERE status = 'Ativo'",
    tableSetup: ["CREATE TABLE df (id INTEGER, status TEXT);", "INSERT INTO df VALUES (1, 'Ativo'), (2, 'Inativo');"],
    expectedOutput: [{ id: 1, status: 'Ativo' }],
    initialQuery: "df.query('status == \"Ativo\"')"
  },
  {
    id: 'py-b-filt-5',
    track: 'python',
    rank: 'Junior',
    title: 'Filtrar por Lista (isin)',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[df['uf'].isin(['SP', 'RJ'])]`.",
    hint: "WHERE uf IN ('SP', 'RJ')",
    tableSetup: ["CREATE TABLE df (cidade TEXT, uf TEXT);", "INSERT INTO df VALUES ('Sampa', 'SP'), ('Rio', 'RJ'), ('Curitiba', 'PR');"],
    expectedOutput: [{ cidade: 'Sampa', uf: 'SP' }, { cidade: 'Rio', uf: 'RJ' }],
    initialQuery: "df[df['uf'].isin(['SP', 'RJ'])]"
  },

  // PYTHON - CLEANING (Completando 5)
  {
    id: 'py-i-cle-6',
    track: 'python',
    rank: 'Analyst',
    title: 'Remover Linhas Nulas',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df.dropna()`. Remova linhas onde `valor` é nulo.",
    hint: "WHERE valor IS NOT NULL",
    tableSetup: ["CREATE TABLE df (id INTEGER, valor REAL);", "INSERT INTO df VALUES (1, 10.5), (2, NULL), (3, 20.0);"],
    expectedOutput: [{ id: 1, valor: 10.5 }, { id: 3, valor: 20.0 }],
    initialQuery: 'df.dropna()'
  },
  {
    id: 'py-i-cle-7',
    track: 'python',
    rank: 'Analyst',
    title: 'Preencher Valores Nulos',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df.fillna(0)`. Substitua nulos na coluna `qtd` por 0.",
    hint: "COALESCE(qtd, 0)",
    tableSetup: ["CREATE TABLE df (item TEXT, qtd INTEGER);", "INSERT INTO df VALUES ('A', 5), ('B', NULL);"],
    expectedOutput: [{ item: 'A', res: 5 }, { item: 'B', res: 0 }],
    initialQuery: 'df.fillna(0)'
  },
  {
    id: 'py-i-cle-8',
    track: 'python',
    rank: 'Analyst',
    title: 'Remover Duplicatas',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df.drop_duplicates()`. Remova linhas idênticas.",
    hint: "DISTINCT",
    tableSetup: ["CREATE TABLE df (val TEXT);", "INSERT INTO df VALUES ('A'), ('A'), ('B');"],
    expectedOutput: [{ val: 'A' }, { val: 'B' }],
    initialQuery: 'df.drop_duplicates()'
  },

  // PYTHON - AGGREGATE (Completando 5)
  {
    id: 'py-i-agg-6',
    track: 'python',
    rank: 'Analyst',
    title: 'Contagem de Valores Únicos',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df['cat'].nunique()`. Conte quantas categorias distintas existem.",
    hint: "SELECT COUNT(DISTINCT cat) FROM df",
    tableSetup: ["CREATE TABLE df (cat TEXT);", "INSERT INTO df VALUES ('A'), ('A'), ('B'), ('C');"],
    expectedOutput: [{ res: 3 }],
    initialQuery: "df['cat'].nunique()"
  },
  {
    id: 'py-i-agg-7',
    track: 'python',
    rank: 'Analyst',
    title: 'Contagem por Categoria',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df['status'].value_counts()`. Conte a frequência de cada status.",
    hint: "SELECT status, COUNT(*) as count FROM df GROUP BY status",
    tableSetup: ["CREATE TABLE df (status TEXT);", "INSERT INTO df VALUES ('Ativo'), ('Ativo'), ('Inativo');"],
    expectedOutput: [{ status: 'Ativo', count: 2 }, { status: 'Inativo', count: 1 }],
    initialQuery: "df['status'].value_counts()"
  },

  // PYTHON - SORT (Novo - Completando 5)
  {
    id: 'py-b-sort-1',
    track: 'python',
    rank: 'Junior',
    title: 'Ordenar por Uma Coluna',
    difficulty: 'Básico',
    category: 'SORT',
    description: "Simule `df.sort_values(by='preco')`. Ordene os produtos pelo preço (crescente).",
    hint: "ORDER BY preco ASC",
    tableSetup: ["CREATE TABLE df (item TEXT, preco REAL);", "INSERT INTO df VALUES ('A', 50), ('B', 10), ('C', 30);"],
    expectedOutput: [{ item: 'B', preco: 10 }, { item: 'C', preco: 30 }, { item: 'A', preco: 50 }],
    initialQuery: "df.sort_values(by='preco')",
    orderSensitive: true
  },
  {
    id: 'py-b-sort-2',
    track: 'python',
    rank: 'Junior',
    title: 'Ordenar Decrescente',
    difficulty: 'Básico',
    category: 'SORT',
    description: "Simule `df.sort_values(by='valor', ascending=False)`. Ordene do maior para o menor.",
    hint: "ORDER BY valor DESC",
    tableSetup: ["CREATE TABLE df (id INTEGER, valor REAL);", "INSERT INTO df VALUES (1, 100), (2, 500);"],
    expectedOutput: [{ id: 2, valor: 500 }, { id: 1, valor: 100 }],
    initialQuery: "df.sort_values(by='valor', ascending=False)",
    orderSensitive: true
  },
  {
    id: 'py-b-sort-3',
    track: 'python',
    rank: 'Junior',
    title: 'Ordenar Alfabeticamente',
    difficulty: 'Básico',
    category: 'SORT',
    description: "Simule `df.sort_values(by='nome')`.",
    hint: "ORDER BY nome",
    tableSetup: ["CREATE TABLE df (nome TEXT);", "INSERT INTO df VALUES ('Zeca'), ('Ana'), ('Beto');"],
    expectedOutput: [{ nome: 'Ana' }, { nome: 'Beto' }, { nome: 'Zeca' }],
    initialQuery: "df.sort_values(by='nome')",
    orderSensitive: true
  },
  {
    id: 'py-b-sort-4',
    track: 'python',
    rank: 'Junior',
    title: 'Ordenar por Data',
    difficulty: 'Básico',
    category: 'SORT',
    description: "Simule `df.sort_values(by='data')`.",
    hint: "ORDER BY data",
    tableSetup: ["CREATE TABLE df (id INTEGER, data TEXT);", "INSERT INTO df VALUES (1, '2023-12-01'), (2, '2023-01-01');"],
    expectedOutput: [{ id: 2, data: '2023-01-01' }, { id: 1, data: '2023-12-01' }],
    initialQuery: "df.sort_values(by='data')",
    orderSensitive: true
  },
  {
    id: 'py-b-sort-5',
    track: 'python',
    rank: 'Junior',
    title: 'Ordenar Múltiplas Colunas',
    difficulty: 'Básico',
    category: 'SORT',
    description: "Simule `df.sort_values(by=['cat', 'val'])`.",
    hint: "ORDER BY cat, val",
    tableSetup: ["CREATE TABLE df (cat TEXT, val REAL);", "INSERT INTO df VALUES ('B', 10), ('A', 50), ('A', 20);"],
    expectedOutput: [{ cat: 'A', val: 20 }, { cat: 'A', val: 50 }, { cat: 'B', val: 10 }],
    initialQuery: "df.sort_values(by=['cat', 'val'])",
    orderSensitive: true
  },

  // PYTHON - LAMBDA (Novo - Completando 5)
  {
    id: 'py-i-lam-1',
    track: 'python',
    rank: 'Analyst',
    title: 'Aplicar Função Simples',
    difficulty: 'Intermediário',
    category: 'LAMBDA',
    description: "Simule `df['val'].apply(lambda x: x * 2)`. Multiplique os valores por 2.",
    hint: "SELECT val * 2 as res FROM df",
    tableSetup: ["CREATE TABLE df (val REAL);", "INSERT INTO df VALUES (10), (20);"],
    expectedOutput: [{ res: 20 }, { res: 40 }],
    initialQuery: "df['val'].apply(lambda x: x * 2)"
  },
  {
    id: 'py-i-lam-2',
    track: 'python',
    rank: 'Analyst',
    title: 'Mapeamento de Valores',
    difficulty: 'Intermediário',
    category: 'LAMBDA',
    description: "Simule `df['id'].map({1: 'Sim', 0: 'Não'})`.",
    hint: "CASE WHEN id=1 THEN 'Sim' ELSE 'Não' END",
    tableSetup: ["CREATE TABLE df (id INTEGER);", "INSERT INTO df VALUES (1), (0), (1);"],
    expectedOutput: [{ res: 'Sim' }, { res: 'Não' }, { res: 'Sim' }],
    initialQuery: "df['id'].map({1: 'Sim', 0: 'Não'})"
  },
  {
    id: 'py-i-lam-3',
    track: 'python',
    rank: 'Analyst',
    title: 'Condicional com Lambda',
    difficulty: 'Intermediário',
    category: 'LAMBDA',
    description: "Simule `df['val'].apply(lambda x: 'Alto' if x > 50 else 'Baixo')`.",
    hint: "CASE WHEN val > 50 THEN 'Alto' ELSE 'Baixo' END",
    tableSetup: ["CREATE TABLE df (val REAL);", "INSERT INTO df VALUES (40), (60);"],
    expectedOutput: [{ res: 'Baixo' }, { res: 'Alto' }],
    initialQuery: "df['val'].apply(lambda x: 'Alto' if x > 50 else 'Baixo')"
  },
  {
    id: 'py-i-lam-4',
    track: 'python',
    rank: 'Analyst',
    title: 'Comprimento de Strings',
    difficulty: 'Intermediário',
    category: 'LAMBDA',
    description: "Simule `df['txt'].apply(len)`. Conte os caracteres de cada string.",
    hint: "LENGTH(txt)",
    tableSetup: ["CREATE TABLE df (txt TEXT);", "INSERT INTO df VALUES ('Python'), ('Data');"],
    expectedOutput: [{ res: 6 }, { res: 4 }],
    initialQuery: "df['txt'].apply(len)"
  },
  {
    id: 'py-i-lam-5',
    track: 'python',
    rank: 'Analyst',
    title: 'Converter para Minúsculo',
    difficulty: 'Intermediário',
    category: 'LAMBDA',
    description: "Simule `df['txt'].str.lower()`. Converta tudo para minúsculo.",
    hint: "LOWER(txt)",
    tableSetup: ["CREATE TABLE df (txt TEXT);", "INSERT INTO df VALUES ('SQL'), ('Pandas');"],
    expectedOutput: [{ res: 'sql' }, { res: 'pandas' }],
    initialQuery: "df['txt'].str.lower()"
  },

  // PYTHON - MERGE (Completando 5)
  {
    id: 'py-i-mer-6',
    track: 'python',
    rank: 'Analyst',
    title: 'Concatenação de DataFrames',
    difficulty: 'Intermediário',
    category: 'MERGE',
    description: "Simule `pd.concat([df1, df2])`. Una as tabelas verticalmente.",
    hint: "UNION ALL",
    tableSetup: ["CREATE TABLE df1 (n TEXT);", "CREATE TABLE df2 (n TEXT);", "INSERT INTO df1 VALUES ('A');", "INSERT INTO df2 VALUES ('B');"],
    expectedOutput: [{ n: 'A' }, { n: 'B' }],
    initialQuery: 'pd.concat([df1, df2])'
  },

  // PYTHON - BASICS (Expensão)
  {
    id: 'py-b-bas-6',
    track: 'python',
    rank: 'Junior',
    title: 'Verificar Tipos de Dados',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df.dtypes`. Traga o nome da coluna e o tipo (simulado como texto).",
    hint: "SELECT 'id' as col, 'int64' as type",
    tableSetup: ["CREATE TABLE df (id INTEGER, val TEXT);"],
    expectedOutput: [{ col: 'id', type: 'int64' }, { col: 'val', type: 'object' }],
    initialQuery: 'df.dtypes'
  },
  {
    id: 'py-b-bas-7',
    track: 'python',
    rank: 'Junior',
    title: 'Listar Colunas',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df.columns`. Retorne os nomes das colunas.",
    hint: "SELECT 'nome' as columns",
    tableSetup: ["CREATE TABLE df (nome TEXT, idade INTEGER);"],
    expectedOutput: [{ columns: 'nome' }, { columns: 'idade' }],
    initialQuery: 'df.columns'
  },
  {
    id: 'py-b-bas-8',
    track: 'python',
    rank: 'Junior',
    title: 'Formato do DataFrame',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df.shape`. Retorne o número de linhas e colunas.",
    hint: "SELECT COUNT(*) as rows, 2 as cols FROM df",
    tableSetup: ["CREATE TABLE df (a INTEGER, b INTEGER);", "INSERT INTO df VALUES (1, 2), (3, 4), (5, 6);"],
    expectedOutput: [{ rows: 3, cols: 2 }],
    initialQuery: 'df.shape'
  },

  // PYTHON - FILTER (Expansão)
  {
    id: 'py-b-filt-6',
    track: 'python',
    rank: 'Junior',
    title: 'Filtrar com Entre (between)',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[df['valor'].between(10, 20)]`.",
    hint: "WHERE valor BETWEEN 10 AND 20",
    tableSetup: ["CREATE TABLE df (id INTEGER, valor REAL);", "INSERT INTO df VALUES (1, 5), (2, 15), (3, 25);"],
    expectedOutput: [{ id: 2, valor: 15 }],
    initialQuery: "df[df['valor'].between(10, 20)]"
  },
  {
    id: 'py-b-filt-7',
    track: 'python',
    rank: 'Junior',
    title: 'Filtrar Negativo (~)',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[~df['cat'].isin(['A'])]`. Filtre tudo que NÃO é da categoria A.",
    hint: "WHERE cat != 'A'",
    tableSetup: ["CREATE TABLE df (id INTEGER, cat TEXT);", "INSERT INTO df VALUES (1, 'A'), (2, 'B'), (3, 'C');"],
    expectedOutput: [{ id: 2, cat: 'B' }, { id: 3, cat: 'C' }],
    initialQuery: "df[~df['cat'].isin(['A'])]"
  },
  {
    id: 'py-b-filt-8',
    track: 'python',
    rank: 'Junior',
    title: 'Filtrar Texto que Contém',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[df['email'].str.contains('@gmail')]`.",
    hint: "WHERE email LIKE '%@gmail%'",
    tableSetup: ["CREATE TABLE df (email TEXT);", "INSERT INTO df VALUES ('ana@gmail.com'), ('bob@outlook.com');"],
    expectedOutput: [{ email: 'ana@gmail.com' }],
    initialQuery: "df[df['email'].str.contains('@gmail')]"
  },

  // PYTHON - CLEANING (Expansão)
  {
    id: 'py-i-cle-9',
    track: 'python',
    rank: 'Analyst',
    title: 'Renomear Colunas',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df.rename(columns={'old': 'new'})`. Renomeie 'v' para 'vendas'.",
    hint: "SELECT v as vendas FROM df",
    tableSetup: ["CREATE TABLE df (id INTEGER, v REAL);", "INSERT INTO df VALUES (1, 100);"],
    expectedOutput: [{ vendas: 100 }],
    initialQuery: "df.rename(columns={'v': 'vendas'})"
  },
  {
    id: 'py-i-cle-10',
    track: 'python',
    rank: 'Analyst',
    title: 'Reshape com Melt',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df.melt(id_vars=['id'])`. Transforme colunas em linhas (unpivot).",
    hint: "Sempre que usar MELT, pense em UNPIVOT no SQL.",
    tableSetup: ["CREATE TABLE df (id INTEGER, v1 REAL, v2 REAL);", "INSERT INTO df VALUES (1, 10, 20);"],
    expectedOutput: [{ id: 1, variable: 'v1', value: 10 }, { id: 1, variable: 'v2', value: 20 }],
    initialQuery: "df.melt(id_vars=['id'])"
  },
  {
    id: 'py-i-cle-11',
    track: 'python',
    rank: 'Analyst',
    title: 'Pivot Table Simples',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df.pivot_table(index='loja', columns='mes', values='vendas')`.",
    hint: "SELECT loja, SUM(CASE WHEN mes='Jan' THEN vendas END) as Jan FROM df GROUP BY loja",
    tableSetup: ["CREATE TABLE df (loja TEXT, mes TEXT, vendas REAL);", "INSERT INTO df VALUES ('A', 'Jan', 100), ('A', 'Fev', 150), ('B', 'Jan', 200);"],
    expectedOutput: [{ loja: 'A', Jan: 100, Fev: 150 }, { loja: 'B', Jan: 200, Fev: null }],
    initialQuery: "df.pivot_table(index='loja', columns='mes', values='vendas')"
  },

  // PYTHON - AGGREGATE (Expansão)
  {
    id: 'py-i-agg-8',
    track: 'python',
    rank: 'Analyst',
    title: 'Média Móvel (Rolling)',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df['v'].rolling(window=2).mean()`. Calcule a média entre a linha atual e a anterior.",
    hint: "AVG(v) OVER (ORDER BY id ROWS BETWEEN 1 PRECEDING AND CURRENT ROW)",
    tableSetup: ["CREATE TABLE df (id INTEGER, v REAL);", "INSERT INTO df VALUES (1, 10), (2, 20), (3, 30);"],
    expectedOutput: [{ v: 10, res: 10 }, { v: 20, res: 15 }, { v: 30, res: 25 }],
    initialQuery: "df['v'].rolling(window=2).mean()"
  },
  {
    id: 'py-i-agg-9',
    track: 'python',
    rank: 'Analyst',
    title: 'Ranking de Vendas',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df['rank'] = df['vendas'].rank(ascending=False)`. Crie um ranking por valor.",
    hint: "RANK() OVER (ORDER BY vendas DESC)",
    tableSetup: ["CREATE TABLE df (nome TEXT, vendas REAL);", "INSERT INTO df VALUES ('Ana', 100), ('Bob', 500), ('Caio', 300);"],
    expectedOutput: [{ nome: 'Bob', vendas: 500, rank: 1 }, { nome: 'Caio', vendas: 300, rank: 2 }, { nome: 'Ana', vendas: 100, rank: 3 }],
    initialQuery: "df['vendas'].rank(ascending=False)",
    orderSensitive: true
  },

  // PYTHON - TIME SERIES (Novo - Completando 5)
  {
    id: 'py-i-ts-1',
    track: 'python',
    rank: 'Analyst',
    title: 'Extrair Ano da Data',
    difficulty: 'Intermediário',
    category: 'TIME SERIES',
    description: "Simule `df['data'].dt.year`. Extraia o ano de uma coluna datetime.",
    hint: "STRFTIME('%Y', data)",
    tableSetup: ["CREATE TABLE df (data TEXT);", "INSERT INTO df VALUES ('2023-01-01'), ('2024-05-10');"],
    expectedOutput: [{ res: '2023' }, { res: '2024' }],
    initialQuery: "df['data'].dt.year"
  },
  {
    id: 'py-i-ts-2',
    track: 'python',
    rank: 'Analyst',
    title: 'Extrair Mês da Data',
    difficulty: 'Intermediário',
    category: 'TIME SERIES',
    description: "Simule `df['data'].dt.month`. Extraia o mês numérico.",
    hint: "STRFTIME('%m', data)",
    tableSetup: ["CREATE TABLE df (data TEXT);", "INSERT INTO df VALUES ('2023-12-01'), ('2023-01-20');"],
    expectedOutput: [{ res: '12' }, { res: '01' }],
    initialQuery: "df['data'].dt.month"
  },
  {
    id: 'py-i-ts-3',
    track: 'python',
    rank: 'Analyst',
    title: 'Filtrar por Período',
    difficulty: 'Intermediário',
    category: 'TIME SERIES',
    description: "Simule `df[df['data'].dt.year == 2023]`. Filtre apenas registros de 2023.",
    hint: "WHERE STRFTIME('%Y', data) = '2023'",
    tableSetup: ["CREATE TABLE df (id INTEGER, data TEXT);", "INSERT INTO df VALUES (1, '2023-05-05'), (2, '2022-10-10');"],
    expectedOutput: [{ id: 1, data: '2023-05-05' }],
    initialQuery: "df[df['data'].dt.year == 2023]"
  },
  {
    id: 'py-i-ts-4',
    track: 'python',
    rank: 'Analyst',
    title: 'Diferença entre Datas',
    difficulty: 'Intermediário',
    category: 'TIME SERIES',
    description: "Simule `(df['data1'] - df['data2']).dt.days`. Calcule o atraso em dias.",
    hint: "JULIANDAY(data1) - JULIANDAY(data2)",
    tableSetup: ["CREATE TABLE df (data1 TEXT, data2 TEXT);", "INSERT INTO df VALUES ('2023-01-10', '2023-01-01');"],
    expectedOutput: [{ res: 9 }],
    initialQuery: "(df['data1'] - df['data2']).dt.days"
  },
  {
    id: 'py-i-ts-5',
    track: 'python',
    rank: 'Analyst',
    title: 'Data Atual (Today)',
    difficulty: 'Intermediário',
    category: 'TIME SERIES',
    description: "Simule `pd.to_datetime('today')`. Traga a data atual (do sistema simulado: 2024-04-20).",
    hint: "SELECT '2024-04-20' as hoje",
    tableSetup: ["CREATE TABLE df (id INTEGER);", "INSERT INTO df VALUES (1);"],
    expectedOutput: [{ hoje: '2024-04-20' }],
    initialQuery: "pd.to_datetime('today')"
  },

  // PYTHON - MERGE (Expansão)
  {
    id: 'py-i-mer-7',
    track: 'python',
    rank: 'Analyst',
    title: 'Join com Chaves Diferentes',
    difficulty: 'Intermediário',
    category: 'MERGE',
    description: "Simule `pd.merge(df1, df2, left_on='id1', right_on='id2')`.",
    hint: "JOIN df2 ON df1.id1 = df2.id2",
    tableSetup: ["CREATE TABLE df1 (id1 INTEGER, n1 TEXT);", "CREATE TABLE df2 (id2 INTEGER, n2 TEXT);", "INSERT INTO df1 VALUES (1, 'A');", "INSERT INTO df2 VALUES (1, 'X');"],
    expectedOutput: [{ n1: 'A', n2: 'X' }],
    initialQuery: "pd.merge(df1, df2, left_on='id1', right_on='id2')"
  },
  {
    id: 'py-i-mer-8',
    track: 'python',
    rank: 'Analyst',
    title: 'Outer Join',
    difficulty: 'Intermediário',
    category: 'MERGE',
    description: "Simule `pd.merge(df1, df2, how='outer')`. Traga tudo de ambos os lados.",
    hint: "FULL OUTER JOIN (Ou simulação por UNION)",
    tableSetup: ["CREATE TABLE df1 (id INTEGER, val TEXT);", "CREATE TABLE df2 (id INTEGER, val TEXT);", "INSERT INTO df1 VALUES (1, 'A');", "INSERT INTO df2 VALUES (2, 'B');"],
    expectedOutput: [{ id: 1, val: 'A' }, { id: 2, val: 'B' }],
    initialQuery: "pd.merge(df1, df2, how='outer')"
  },

  // PYTHON - AVANÇADO (Expert)
  {
    id: 'py-a-adv-1',
    track: 'python',
    rank: 'Expert',
    title: 'Criação de Feature (Bins)',
    difficulty: 'Avançado',
    category: 'ADVANCED',
    description: "Simule `pd.cut(df['valor'], bins=[0, 100, 500], labels=['P', 'G'])`. Categorize os preços.",
    hint: "CASE WHEN valor BETWEEN 0 AND 100 THEN 'P' WHEN valor <= 500 THEN 'G' END",
    tableSetup: ["CREATE TABLE df (id INTEGER, valor REAL);", "INSERT INTO df VALUES (1, 50), (2, 300);"],
    expectedOutput: [{ id: 1, cat: 'P' }, { id: 2, cat: 'G' }],
    initialQuery: "pd.cut(df['valor'], bins=[0, 100, 500], labels=['P', 'G'])"
  },
  {
    id: 'py-a-adv-2',
    track: 'python',
    rank: 'Expert',
    title: 'Cumulative Sum (Expanding)',
    difficulty: 'Avançado',
    category: 'ADVANCED',
    description: "Simule `df['v'].expanding().sum()`. Calcule o total acumulado até o momento.",
    hint: "SUM(v) OVER (ORDER BY id ROWS UNBOUNDED PRECEDING)",
    tableSetup: ["CREATE TABLE df (id INTEGER, v REAL);", "INSERT INTO df VALUES (1, 100), (2, 50), (3, 200);"],
    expectedOutput: [{ id: 1, acc: 100 }, { id: 2, acc: 150 }, { id: 3, acc: 350 }],
    initialQuery: "df['v'].expanding().sum()",
    orderSensitive: true
  },
  {
    id: 'py-a-adv-3',
    track: 'python',
    rank: 'Expert',
    title: 'Localizar Valores Específicos (loc)',
    difficulty: 'Avançado',
    category: 'ADVANCED',
    description: "Simule `df.loc[df['val'] > 100, 'nome']`. Selecione o nome onde o valor supera 100.",
    hint: "SELECT nome FROM df WHERE val > 100",
    tableSetup: ["CREATE TABLE df (nome TEXT, val REAL);", "INSERT INTO df VALUES ('Prod A', 50), ('Prod B', 150);"],
    expectedOutput: [{ nome: 'Prod B' }],
    initialQuery: "df.loc[df['val'] > 100, 'nome']"
  },
  {
    id: 'py-a-adv-4',
    track: 'python',
    rank: 'Expert',
    title: 'Diferença de Linhas (pct_change)',
    difficulty: 'Avançado',
    category: 'ADVANCED',
    description: "Simule `df['v'].pct_change()`. Calcule o percentual de variação entre as linhas.",
    hint: "((v - LAG(v) OVER ()) / LAG(v) OVER ()) * 100",
    tableSetup: ["CREATE TABLE df (id INTEGER, v REAL);", "INSERT INTO df VALUES (1, 100), (2, 110), (3, 121);"],
    expectedOutput: [{ id: 1, p: null }, { id: 2, p: 10 }, { id: 3, p: 10 }],
    initialQuery: "df['v'].pct_change()",
    orderSensitive: true
  },
  {
    id: 'py-a-adv-5',
    track: 'python',
    rank: 'Expert',
    title: 'Remoção de Outliers (Z-Score)',
    difficulty: 'Avançado',
    category: 'ADVANCED',
    description: "Simule remover valores fora de 1 desvio padrão (muito simplificado: retire o maior e o menor valor de uma lista de 5).",
    hint: "WHERE v NOT IN (SELECT MIN(v) FROM df) AND v NOT IN (SELECT MAX(v) FROM df)",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (1), (10), (12), (15), (100);"],
    expectedOutput: [{ v: 10 }, { v: 12 }, { v: 15 }],
    initialQuery: "df[~df['v'].isin([df['v'].min(), df['v'].max()])]"
  },

  // PYTHON - MAIS DESAFIOS (Completando 100+)
  {
    id: 'py-b-adv-6',
    track: 'python',
    rank: 'Junior',
    title: 'Top N Maiores Valores',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df.nlargest(2, 'vendas')`. Pegue os 2 maiores valores.",
    hint: "ORDER BY vendas DESC LIMIT 2",
    tableSetup: ["CREATE TABLE df (id INTEGER, vendas REAL);", "INSERT INTO df VALUES (1, 10), (2, 50), (3, 30);"],
    expectedOutput: [{ id: 2, vendas: 50 }, { id: 3, vendas: 30 }],
    initialQuery: "df.nlargest(2, 'vendas')",
    orderSensitive: true
  },
  {
    id: 'py-b-adv-7',
    track: 'python',
    rank: 'Junior',
    title: 'Top N Menores Valores',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df.nsmallest(1, 'preco')`. Pegue o item mais barato.",
    hint: "ORDER BY preco ASC LIMIT 1",
    tableSetup: ["CREATE TABLE df (item TEXT, preco REAL);", "INSERT INTO df VALUES ('A', 10), ('B', 5);"],
    expectedOutput: [{ item: 'B', preco: 5 }],
    initialQuery: "df.nsmallest(1, 'preco')"
  },
  {
    id: 'py-i-agg-10',
    track: 'python',
    rank: 'Analyst',
    title: 'Localizar Valor Máximo (idxmax)',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df['vendas'].idxmax()`. Encontre o ID correspondente ao maior valor.",
    hint: "SELECT id FROM df WHERE vendas = (SELECT MAX(vendas) FROM df)",
    tableSetup: ["CREATE TABLE df (id INTEGER, vendas REAL);", "INSERT INTO df VALUES (101, 50), (102, 150), (103, 80);"],
    expectedOutput: [{ id: 102 }],
    initialQuery: "df['vendas'].idxmax()"
  },
  {
    id: 'py-i-agg-11',
    track: 'python',
    rank: 'Analyst',
    title: 'Correlação de Pearson (Simulado)',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df[['v1', 'v2']].corr()`. (No SQL simularemos apenas a estrutura de retorno).",
    hint: "SELECT 1.0 as v1, 0.95 as v2",
    tableSetup: ["CREATE TABLE df (v1 REAL, v2 REAL);"],
    expectedOutput: [{ v1: 1.0, v2: 0.95 }],
    initialQuery: "df[['v1', 'v2']].corr()"
  },
  {
    id: 'py-i-cle-12',
    track: 'python',
    rank: 'Analyst',
    title: 'Identificar Linhas Duplicadas',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df.duplicated()`. Retorne VERDADEIRO para linhas que já apareceram antes.",
    hint: "Use lógica de contagem acumulada para simular duplicated().",
    tableSetup: ["CREATE TABLE df (v TEXT);", "INSERT INTO df VALUES ('A'), ('B'), ('A');"],
    expectedOutput: [{ v: 'A', dup: 0 }, { v: 'B', dup: 0 }, { v: 'A', dup: 1 }],
    initialQuery: 'df.duplicated()'
  },
  {
    id: 'py-i-cle-13',
    track: 'python',
    rank: 'Analyst',
    title: 'Dividir Coluna (str.split)',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df['nome'].str.split(' ', expand=True)`. Separe nome e sobrenome.",
    hint: "SUBSTR anterior e posterior ao espaço.",
    tableSetup: ["CREATE TABLE df (nome TEXT);", "INSERT INTO df VALUES ('Ana Silva'), ('Bob Santos');"],
    expectedOutput: [{ 0: 'Ana', 1: 'Silva' }, { 0: 'Bob', 1: 'Santos' }],
    initialQuery: "df['nome'].str.split(' ', expand=True)"
  },
  {
    id: 'py-i-cle-14',
    track: 'python',
    rank: 'Analyst',
    title: 'Preencher com a Média',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df['v'].fillna(df['v'].mean())`. Preencha nulos com a média da coluna.",
    hint: "COALESCE(v, (SELECT AVG(v) FROM df))",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (10), (20), (NULL);"],
    expectedOutput: [{ v: 10 }, { v: 20 }, { v: 15 }],
    initialQuery: "df['v'].fillna(df['v'].mean())"
  },
  {
    id: 'py-i-lam-6',
    track: 'python',
    rank: 'Analyst',
    title: 'Extrair Números (str.extract)',
    difficulty: 'Intermediário',
    category: 'LAMBDA',
    description: "Simule `df['txt'].str.extract('(\\d+)')`. Pegue a parte numérica de uma string.",
    hint: "Apenas simule pegando os dígitos via REPLACE de letras.",
    tableSetup: ["CREATE TABLE df (txt TEXT);", "INSERT INTO df VALUES ('ID123'), ('Lote99');"],
    expectedOutput: [{ res: '123' }, { res: '99' }],
    initialQuery: "df['txt'].str.extract('(\\d+)')"
  },
  {
    id: 'py-i-agg-12',
    track: 'python',
    rank: 'Analyst',
    title: 'Agregação por Múltiplas Colunas',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df.groupby(['ano', 'cat'])['v'].sum()`. Soma por ano e categoria.",
    hint: "GROUP BY ano, cat",
    tableSetup: ["CREATE TABLE df (ano INTEGER, cat TEXT, v REAL);", "INSERT INTO df VALUES (2023, 'A', 10), (2023, 'A', 20), (2024, 'B', 100);"],
    expectedOutput: [{ ano: 2023, cat: 'A', total: 30 }, { ano: 2024, cat: 'B', total: 100 }],
    initialQuery: "df.groupby(['ano', 'cat'])['v'].sum()"
  },
  {
    id: 'py-a-adv-6',
    track: 'python',
    rank: 'Expert',
    title: 'Normalização Min-Max',
    difficulty: 'Avançado',
    category: 'ADVANCED',
    description: "Simule `(df['v'] - df['v'].min()) / (df['v'].max() - df['v'].min())`.",
    hint: "(v - min_v) / (max_v - min_v)",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (0), (50), (100);"],
    expectedOutput: [{ norm: 0.0 }, { norm: 0.5 }, { norm: 1.0 }],
    initialQuery: 'df.normalize()'
  },
  {
    id: 'py-a-adv-7',
    track: 'python',
    rank: 'Expert',
    title: 'Percentile Rank',
    difficulty: 'Avançado',
    category: 'ADVANCED',
    description: "Simule `df['v'].rank(pct=True)`. Calcule a posição percentual de cada valor.",
    hint: "PERCENT_RANK() OVER (ORDER BY v)",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (10), (20), (30), (40);"],
    expectedOutput: [{ v: 10, p: 0.0 }, { v: 20, p: 0.333 }, { v: 30, p: 0.666 }, { v: 40, p: 1.0 }],
    initialQuery: "df['v'].rank(pct=True)"
  },
  {
    id: 'py-a-adv-8',
    track: 'python',
    rank: 'Expert',
    title: 'Cross Tabulation (crosstab)',
    difficulty: 'Avançado',
    category: 'ADVANCED',
    description: "Simule `pd.crosstab(df['A'], df['B'])`. Tabela de frequência cruzada.",
    hint: "GROUP BY A, B com contagem.",
    tableSetup: ["CREATE TABLE df (A TEXT, B TEXT);", "INSERT INTO df VALUES ('Sim', 'M'), ('Não', 'F'), ('Sim', 'F');"],
    expectedOutput: [
      { A: 'Não', F: 1, M: 0 },
      { A: 'Sim', F: 1, M: 1 }
    ],
    initialQuery: "pd.crosstab(df['A'], df['B'])"
  },
  {
    id: 'py-i-cle-15',
    track: 'python',
    rank: 'Analyst',
    title: 'Tratar Nomes (Capitalização)',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df['nome'].str.capitalize()`. Apenas a primeira letra maiúscula.",
    hint: "UPPER(SUBSTR(n, 1, 1)) || LOWER(SUBSTR(n, 2))",
    tableSetup: ["CREATE TABLE df (n TEXT);", "INSERT INTO df VALUES ('ana'), ('BOB');"],
    expectedOutput: [{ n: 'Ana' }, { n: 'Bob' }],
    initialQuery: "df['nome'].str.capitalize()"
  },
  {
    id: 'py-b-bas-9',
    track: 'python',
    rank: 'Junior',
    title: 'Reset Index',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `df.reset_index()`. Adicione uma coluna de índice sequencial.",
    hint: "ROW_NUMBER() OVER () - 1",
    tableSetup: ["CREATE TABLE df (v TEXT);", "INSERT INTO df VALUES ('A'), ('B'), ('C');"],
    expectedOutput: [{ index: 0, v: 'A' }, { index: 1, v: 'B' }, { index: 2, v: 'C' }],
    initialQuery: 'df.reset_index()'
  },
  {
    id: 'py-i-agg-13',
    track: 'python',
    rank: 'Analyst',
    title: 'Moda da Coluna (mode)',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df['val'].mode()`. Encontre o valor mais frequente.",
    hint: "GROUP BY val ORDER BY COUNT(*) DESC LIMIT 1",
    tableSetup: ["CREATE TABLE df (val TEXT);", "INSERT INTO df VALUES ('A'), ('B'), ('A'), ('C');"],
    expectedOutput: [{ res: 'A' }],
    initialQuery: "df['val'].mode()"
  },
  {
    id: 'py-i-agg-14',
    track: 'python',
    rank: 'Analyst',
    title: 'Desvio Padrão (std)',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df['v'].std()`. Calcule o desvio padrão.",
    hint: "No SQL usaremos a aproximação de variância.",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (10), (10), (10);"],
    expectedOutput: [{ res: 0.0 }],
    initialQuery: "df['v'].std()"
  },
  {
    id: 'py-a-adv-9',
    track: 'python',
    rank: 'Expert',
    title: 'Z-Score Scaling',
    difficulty: 'Avançado',
    category: 'ADVANCED',
    description: "Simule `(df['v'] - df['v'].mean()) / df['v'].std()`.",
    hint: "Padronização estatística.",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (10), (20), (30);"],
    expectedOutput: [{ v: 10, z: -1.0 }, { v: 20, z: 0.0 }, { v: 30, z: 1.0 }],
    initialQuery: 'df.standardize()'
  },
  {
    id: 'py-i-ts-6',
    track: 'python',
    rank: 'Analyst',
    title: 'Filtro por Sexta-Feira 13',
    difficulty: 'Intermediário',
    category: 'TIME SERIES',
    description: "Simule filtrar datas que são sexta-feira E dia 13.",
    hint: "strftime('%w', data) = '5' AND strftime('%d', data) = '13'",
    tableSetup: ["CREATE TABLE df (data TEXT);", "INSERT INTO df VALUES ('2023-10-13'), ('2023-10-14');"],
    expectedOutput: [{ data: '2023-10-13' }],
    initialQuery: 'df.friday_13th()'
  },
  {
    id: 'py-b-filt-9',
    track: 'python',
    rank: 'Junior',
    title: 'Filtro por Valores Nulos (isnull)',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[df['v'].isnull()]`.",
    hint: "WHERE v IS NULL",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (10), (NULL);"],
    expectedOutput: [{ v: null }],
    initialQuery: "df[df['v'].isnull()]"
  },
  {
    id: 'py-b-filt-10',
    track: 'python',
    rank: 'Junior',
    title: 'Filtro Not Null (notnull)',
    difficulty: 'Básico',
    category: 'FILTER',
    description: "Simule `df[df['v'].notnull()]`.",
    hint: "WHERE v IS NOT NULL",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (10), (NULL);"],
    expectedOutput: [{ v: 10 }],
    initialQuery: "df[df['v'].notnull()]"
  },
  {
    id: 'py-i-cle-16',
    track: 'python',
    rank: 'Analyst',
    title: 'Clip de Valores',
    difficulty: 'Intermediário',
    category: 'CLEANING',
    description: "Simule `df['v'].clip(lower=0, upper=100)`. Limite os valores entre 0 e 100.",
    hint: "CASE WHEN v < 0 THEN 0 WHEN v > 100 THEN 100 ELSE v END",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (-10), (50), (120);"],
    expectedOutput: [{ res: 0 }, { res: 50 }, { res: 100 }],
    initialQuery: "df['v'].clip(0, 100)"
  },
  {
    id: 'py-i-agg-15',
    track: 'python',
    rank: 'Analyst',
    title: 'Mediana da Coluna',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df['v'].median()`. Encontre o valor central.",
    hint: "Ordenação e pegada do meio.",
    tableSetup: ["CREATE TABLE df (v REAL);", "INSERT INTO df VALUES (10), (30), (20);"],
    expectedOutput: [{ res: 20 }],
    initialQuery: "df['v'].median()"
  },
  {
    id: 'py-i-agg-16',
    track: 'python',
    rank: 'Analyst',
    title: 'Soma Cumulativa (cumsum)',
    difficulty: 'Intermediário',
    category: 'AGGREGATE',
    description: "Simule `df['v'].cumsum()`. Soma acumulada simples.",
    hint: "SUM(v) OVER (ORDER BY id)",
    tableSetup: ["CREATE TABLE df (id INTEGER, v REAL);", "INSERT INTO df VALUES (1, 10), (2, 20), (3, 30);"],
    expectedOutput: [{ id: 1, res: 10 }, { id: 2, res: 30 }, { id: 3, res: 60 }],
    initialQuery: "df['v'].cumsum()",
    orderSensitive: true
  },
  {
    id: 'py-b-bas-10',
    track: 'python',
    rank: 'Junior',
    title: 'Contar Linhas (len)',
    difficulty: 'Básico',
    category: 'BASICS',
    description: "Simule `len(df)`. Retorne o total de registros.",
    hint: "SELECT COUNT(*) FROM df",
    tableSetup: ["CREATE TABLE df (id INTEGER);", "INSERT INTO df VALUES (1), (2), (3), (4), (5);"],
    expectedOutput: [{ res: 5 }],
    initialQuery: 'len(df)'
  }
];
