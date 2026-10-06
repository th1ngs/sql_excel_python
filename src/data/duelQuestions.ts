import { Challenge } from '../types';

/**
 * Banco dedicado de questões para o Modo Duelo SQL (Séries de 5 Perguntas por Partida).
 * Todas as perguntas têm contexto claro, nomes de tabelas/colunas intuitivos e dados realistas.
 */
export const duelQuestions: Challenge[] = [
  // ============================================================================
  // NÍVEL BÁSICO (10 PERGUNTAS CLARAS E DIRETAS DE NEGÓCIO)
  // ============================================================================
  {
    id: 'duel-b-01',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'FILTRO & ORDENAÇÃO',
    title: 'Colaboradores Ativos de Tecnologia com Salário Acima de 7.000',
    description:
      'Na tabela `funcionarios`, selecione as colunas `nome` e `salario` apenas dos colaboradores do departamento `"Tecnologia"` que possuem `ativo = 1` e `salario > 7000`. Ordene do maior salário para o menor.',
    hint: 'Filtre departamento, ativo e salario no WHERE e ordene com ORDER BY salario DESC.',
    tableSetup: [
      `CREATE TABLE funcionarios (id INTEGER, nome TEXT, departamento TEXT, salario REAL, ativo INTEGER);`,
      `INSERT INTO funcionarios VALUES
        (1, 'Lucas Silva', 'Tecnologia', 8500, 1),
        (2, 'Marina Costa', 'Tecnologia', 6200, 1),
        (3, 'Rafael Souza', 'Tecnologia', 11200, 1),
        (4, 'Carla Dias', 'Tecnologia', 9000, 0),
        (5, 'Bruno Lima', 'Financeiro', 9500, 1),
        (6, 'Aline Rocha', 'Tecnologia', 7800, 1);`
    ],
    expectedOutput: [
      { nome: 'Rafael Souza', salario: 11200 },
      { nome: 'Lucas Silva', salario: 8500 },
      { nome: 'Aline Rocha', salario: 7800 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-02',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'ESTOQUE CRÍTICO',
    title: 'Produtos Precisando de Reposição Imediata',
    description:
      'Na tabela `produtos`, liste `produto` e `estoque_atual` de todos os itens onde o `estoque_atual` é menor que o `estoque_minimo` e que pertençam à categoria `"Eletronicos"`. Ordene pelo `estoque_atual` crescente.',
    hint: 'Compare estoque_atual < estoque_minimo combinado com categoria = "Eletronicos".',
    tableSetup: [
      `CREATE TABLE produtos (id INTEGER, produto TEXT, categoria TEXT, estoque_atual INTEGER, estoque_minimo INTEGER);`,
      `INSERT INTO produtos VALUES
        (1, 'Mouse Gamer', 'Eletronicos', 8, 15),
        (2, 'Teclado Mecanico', 'Eletronicos', 25, 20),
        (3, 'Monitor 27 Pol', 'Eletronicos', 3, 10),
        (4, 'Cadeira Escritorio', 'Moveis', 2, 10),
        (5, 'Headset USB', 'Eletronicos', 5, 12);`
    ],
    expectedOutput: [
      { produto: 'Monitor 27 Pol', estoque_atual: 3 },
      { produto: 'Headset USB', estoque_atual: 5 },
      { produto: 'Mouse Gamer', estoque_atual: 8 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-03',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'AGREGAÇÃO',
    title: 'Faturamento Total e Quantidade de Pedidos Pagos',
    description:
      'Na tabela `pedidos`, calcule a quantidade total de pedidos (`total_pedidos`) e a soma da coluna `valor` (`receita_total`) considerando apenas os pedidos com `status = "Pago"`.',
    hint: 'Use COUNT(*) e SUM(valor) filtrando WHERE status = "Pago".',
    tableSetup: [
      `CREATE TABLE pedidos (id_pedido INTEGER, cliente TEXT, valor REAL, status TEXT);`,
      `INSERT INTO pedidos VALUES
        (101, 'Ana', 350.0, 'Pago'),
        (102, 'Beto', 120.0, 'Cancelado'),
        (103, 'Caio', 650.0, 'Pago'),
        (104, 'Dani', 200.0, 'Pendente'),
        (105, 'Edu', 500.0, 'Pago');`
    ],
    expectedOutput: [{ total_pedidos: 3, receita_total: 1500 }]
  },
  {
    id: 'duel-b-04',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'CLIENTES VIP',
    title: 'Top 3 Maiores Compras no Sudeste',
    description:
      'Na tabela `vendas`, retorne `cliente`, `estado` e `valor_compra` apenas das vendas realizadas nos estados `"SP"`, `"RJ"` ou `"MG"`. Traga apenas as 3 maiores compras, ordenadas do maior `valor_compra` para o menor.',
    hint: 'Use WHERE estado IN ("SP", "RJ", "MG") com ORDER BY valor_compra DESC LIMIT 3.',
    tableSetup: [
      `CREATE TABLE vendas (id INTEGER, cliente TEXT, estado TEXT, valor_compra REAL);`,
      `INSERT INTO vendas VALUES
        (1, 'Empresa Alpha', 'SP', 4500),
        (2, 'Empresa Beta', 'PR', 9000),
        (3, 'Empresa Gama', 'RJ', 6200),
        (4, 'Empresa Delta', 'MG', 5100),
        (5, 'Empresa Omega', 'SP', 3200),
        (6, 'Empresa Sigma', 'BA', 8000);`
    ],
    expectedOutput: [
      { cliente: 'Empresa Gama', estado: 'RJ', valor_compra: 6200 },
      { cliente: 'Empresa Delta', estado: 'MG', valor_compra: 5100 },
      { cliente: 'Empresa Alpha', estado: 'SP', valor_compra: 4500 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-05',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'CÁLCULO EM COLUNA',
    title: 'Preço Final com Desconto de Atacado',
    description:
      'Na tabela `ofertas`, selecione `item` e calcule o preço líquido (`preco_bruto - desconto` como `preco_final`) apenas para os itens cujo `preco_bruto` seja maior ou igual a 100. Ordene pelo `preco_final` crescente.',
    hint: 'Projete item, (preco_bruto - desconto) AS preco_final com filtro WHERE preco_bruto >= 100.',
    tableSetup: [
      `CREATE TABLE ofertas (item TEXT, preco_bruto REAL, desconto REAL);`,
      `INSERT INTO ofertas VALUES
        ('SSD 1TB', 400, 50),
        ('Cabo HDMI', 45, 5),
        ('Memoria 16GB', 280, 30),
        ('Fonte 600W', 320, 40);`
    ],
    expectedOutput: [
      { item: 'Memoria 16GB', preco_final: 250 },
      { item: 'Fonte 600W', preco_final: 280 },
      { item: 'SSD 1TB', preco_final: 350 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-06',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'VALORES NULOS',
    title: 'Contratos Sem Gerente Responsável Alocado',
    description:
      'Na tabela `contratos`, identifique os contratos ativos (`status = "Ativo"`) que estão sem gerente preenchido (`gerente IS NULL`). Retorne `id_contrato`, `empresa` e `valor_mensal`, ordenados pelo `valor_mensal` decrescente.',
    hint: 'Combine status = "Ativo" AND gerente IS NULL no WHERE.',
    tableSetup: [
      `CREATE TABLE contratos (id_contrato TEXT, empresa TEXT, gerente TEXT, valor_mensal REAL, status TEXT);`,
      `INSERT INTO contratos VALUES
        ('CTR-10', 'LogTech', NULL, 4500, 'Ativo'),
        ('CTR-11', 'AgroMais', 'Marcos', 8000, 'Ativo'),
        ('CTR-12', 'FinCred', NULL, 9200, 'Ativo'),
        ('CTR-13', 'RetailSul', NULL, 3000, 'Cancelado');`
    ],
    expectedOutput: [
      { id_contrato: 'CTR-12', empresa: 'FinCred', valor_mensal: 9200 },
      { id_contrato: 'CTR-10', empresa: 'LogTech', valor_mensal: 4500 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-07',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'AGRUPAMENTO SIMPLES',
    title: 'Total de Chamados Abertos por Prioridade',
    description:
      'Na tabela `chamados`, conte quantos chamados existem para cada `prioridade` considerando apenas aqueles com `resolvido = 0`. Retorne `prioridade` e `qtd_chamados`, ordenados por `qtd_chamados` decrescente.',
    hint: 'Filtre resolvido = 0 no WHERE, agrupe por prioridade e ordene pela contagem decrescente.',
    tableSetup: [
      `CREATE TABLE chamados (id INTEGER, prioridade TEXT, resolvido INTEGER);`,
      `INSERT INTO chamados VALUES
        (1, 'Alta', 0),
        (2, 'Alta', 0),
        (3, 'Alta', 1),
        (4, 'Critica', 0),
        (5, 'Critica', 0),
        (6, 'Critica', 0),
        (7, 'Baixa', 0);`
    ],
    expectedOutput: [
      { prioridade: 'Critica', qtd_chamados: 3 },
      { prioridade: 'Alta', qtd_chamados: 2 },
      { prioridade: 'Baixa', qtd_chamados: 1 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-08',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'BUSCA TEXTUAL',
    title: 'Transações em Cartão Corporativo',
    description:
      'Na tabela `despesas`, liste `id_despesa`, `descricao` e `valor` de todas as despesas cuja `descricao` comece com `"CORP-"` e cujo `valor` seja maior que 500. Ordene pelo `id_despesa` crescente.',
    hint: 'Use descricao LIKE "CORP-%" AND valor > 500.',
    tableSetup: [
      `CREATE TABLE despesas (id_despesa INTEGER, descricao TEXT, valor REAL);`,
      `INSERT INTO despesas VALUES
        (1, 'CORP-Passagem Aerea', 1450),
        (2, 'CORP-Cafe Reuniao', 85),
        (3, 'REEMB-Taxi', 900),
        (4, 'CORP-Hospedagem Hotel', 820);`
    ],
    expectedOutput: [
      { id_despesa: 1, descricao: 'CORP-Passagem Aerea', valor: 1450 },
      { id_despesa: 4, descricao: 'CORP-Hospedagem Hotel', valor: 820 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-09',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'VALORES ÚNICOS',
    title: 'Cidades Distintas com Entregas no Prazo',
    description:
      'Na tabela `entregas`, retorne a lista de `cidade` sem repetição (distintas) onde houve entregas com `no_prazo = 1`, ordenadas em ordem alfabética crescente.',
    hint: 'Use SELECT DISTINCT cidade FROM entregas WHERE no_prazo = 1 ORDER BY cidade ASC.',
    tableSetup: [
      `CREATE TABLE entregas (id INTEGER, cidade TEXT, no_prazo INTEGER);`,
      `INSERT INTO entregas VALUES
        (1, 'Curitiba', 1),
        (2, 'Campinas', 1),
        (3, 'Curitiba', 1),
        (4, 'Santos', 0),
        (5, 'Belo Horizonte', 1);`
    ],
    expectedOutput: [
      { cidade: 'Belo Horizonte' },
      { cidade: 'Campinas' },
      { cidade: 'Curitiba' }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-10',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'FAIXA DE VALORES',
    title: 'Assinaturas Empresariais na Faixa Intermediária',
    description:
      'Na tabela `assinaturas`, selecione `cliente` e `mensalidade` dos planos onde a `mensalidade` está entre 500 e 1500 (inclusive) e `plano = "Enterprise"`. Ordene pela `mensalidade` decrescente.',
    hint: 'Use mensalidade BETWEEN 500 AND 1500 AND plano = "Enterprise".',
    tableSetup: [
      `CREATE TABLE assinaturas (cliente TEXT, plano TEXT, mensalidade REAL);`,
      `INSERT INTO assinaturas VALUES
        ('TechNova', 'Enterprise', 1200),
        ('StartUp X', 'Pro', 800),
        ('MegaVarejo', 'Enterprise', 2500),
        ('DataLab', 'Enterprise', 650),
        ('CloudNine', 'Enterprise', 1500);`
    ],
    expectedOutput: [
      { cliente: 'CloudNine', mensalidade: 1500 },
      { cliente: 'TechNova', mensalidade: 1200 },
      { cliente: 'DataLab', mensalidade: 650 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-11',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'FILTRO DE INADIMPLÊNCIA',
    title: 'Faturas Vencidas de Alto Valor no Contas a Receber',
    description:
      'Na tabela `faturas`, selecione `id_fatura`, `cliente` e `valor` apenas das faturas com `status = "Vencida"` e `valor >= 2000`. Ordene do maior `valor` para o menor.',
    hint: 'Filtre status = "Vencida" AND valor >= 2000 no WHERE e ordene por valor DESC.',
    tableSetup: [
      `CREATE TABLE faturas (id_fatura TEXT, cliente TEXT, valor REAL, status TEXT);`,
      `INSERT INTO faturas VALUES
        ('FAT-01', 'Construtora Rocha', 4800, 'Vencida'),
        ('FAT-02', 'Studio Design', 950, 'Vencida'),
        ('FAT-03', 'Rede Super', 7200, 'Pago'),
        ('FAT-04', 'Transportes Sul', 3100, 'Vencida'),
        ('FAT-05', 'Clinica Saude', 2000, 'Vencida');`
    ],
    expectedOutput: [
      { id_fatura: 'FAT-01', cliente: 'Construtora Rocha', valor: 4800 },
      { id_fatura: 'FAT-04', cliente: 'Transportes Sul', valor: 3100 },
      { id_fatura: 'FAT-05', cliente: 'Clinica Saude', valor: 2000 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-12',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'CONTAGEM SIMPLES',
    title: 'Quantidade de Sensores Industriais em Alerta',
    description:
      'Na tabela `sensores`, conte quantos equipamentos (`total_alerta`) estão com `temperatura > 85` e `ativo = 1`.',
    hint: 'Use COUNT(*) AS total_alerta filtrando temperatura > 85 AND ativo = 1.',
    tableSetup: [
      `CREATE TABLE sensores (id_sensor TEXT, setor TEXT, temperatura REAL, ativo INTEGER);`,
      `INSERT INTO sensores VALUES
        ('S-01', 'Caldeira', 92.5, 1),
        ('S-02', 'Refrigeração', 12.0, 1),
        ('S-03', 'Turbina', 88.0, 1),
        ('S-04', 'Turbina', 95.0, 0),
        ('S-05', 'Forno', 110.0, 1);`
    ],
    expectedOutput: [{ total_alerta: 3 }]
  },
  {
    id: 'duel-b-13',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'MÉDIA SALARIAL',
    title: 'Salário Médio e Maior Salário do Setor Comercial',
    description:
      'Na tabela `equipe`, calcule a média salarial (`AVG(salario)` como `media_salarial`) e o maior salário (`MAX(salario)` como `maior_salario`) apenas dos funcionários onde `setor = "Comercial"`.',
    hint: 'Use AVG(salario) e MAX(salario) filtrando WHERE setor = "Comercial".',
    tableSetup: [
      `CREATE TABLE equipe (nome TEXT, setor TEXT, salario REAL);`,
      `INSERT INTO equipe VALUES
        ('André', 'Comercial', 4000),
        ('Bianca', 'Comercial', 6000),
        ('Carlos', 'Comercial', 5000),
        ('Diana', 'TI', 9000);`
    ],
    expectedOutput: [{ media_salarial: 5000, maior_salario: 6000 }]
  },
  {
    id: 'duel-b-14',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'MARGEM DE LUCRO',
    title: 'Lucro Unitário dos Produtos Vendidos Online',
    description:
      'Na tabela `catalogo_loja`, retorne `produto` e o lucro unitário (`preco_venda - custo` como `lucro`) apenas para os itens com `canal = "Online"`. Ordene pelo `lucro` decrescente.',
    hint: 'Calcule preco_venda - custo AS lucro com WHERE canal = "Online" ORDER BY lucro DESC.',
    tableSetup: [
      `CREATE TABLE catalogo_loja (produto TEXT, canal TEXT, preco_venda REAL, custo REAL);`,
      `INSERT INTO catalogo_loja VALUES
        ('Notebook Pro', 'Online', 5200, 3800),
        ('Smartphone X', 'Online', 3100, 2200),
        ('Impressora Laser', 'Fisico', 1500, 900),
        ('Tablet 10', 'Online', 1800, 1300);`
    ],
    expectedOutput: [
      { produto: 'Notebook Pro', lucro: 1400 },
      { produto: 'Smartphone X', lucro: 900 },
      { produto: 'Tablet 10', lucro: 500 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-b-15',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'EXCLUSÃO DE STATUS',
    title: 'Veículos da Frota Disponíveis para Viagem',
    description:
      'Na tabela `frota`, selecione `placa`, `modelo` e `km_atual` dos veículos cujo `status` seja diferente de `"Manutencao"` e que tenham `km_atual < 50000`. Ordene por `km_atual` crescente.',
    hint: 'Use status != "Manutencao" AND km_atual < 50000 ORDER BY km_atual ASC.',
    tableSetup: [
      `CREATE TABLE frota (placa TEXT, modelo TEXT, km_atual INTEGER, status TEXT);`,
      `INSERT INTO frota VALUES
        ('ABC-1010', 'Fiorino', 32000, 'Livre'),
        ('DEF-2020', 'Sprinter', 65000, 'Livre'),
        ('GHI-3030', 'Master', 28000, 'Manutencao'),
        ('JKL-4040', 'Kangoo', 19500, 'Livre');`
    ],
    expectedOutput: [
      { placa: 'JKL-4040', modelo: 'Kangoo', km_atual: 19500 },
      { placa: 'ABC-1010', modelo: 'Fiorino', km_atual: 32000 }
    ],
    orderSensitive: true
  },

  // ============================================================================
  // NÍVEL INTERMEDIÁRIO (10 PERGUNTAS COM JOIN, GROUP BY, HAVING, CASE)
  // ============================================================================
  {
    id: 'duel-i-01',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'GROUP BY & HAVING',
    title: 'Lojas que Superaram a Meta Trimestral de 10.000',
    description:
      'Na tabela `vendas_lojas`, calcule o faturamento total (`SUM(valor)` como `total_vendas`) por `loja`, considerando apenas vendas com `cancelada = 0`. Exiba apenas as lojas cujo `total_vendas` seja estritamente maior que 10000, ordenadas do maior total para o menor.',
    hint: 'Filtre cancelada = 0 no WHERE, agrupe por loja e filtre SUM(valor) > 10000 no HAVING.',
    tableSetup: [
      `CREATE TABLE vendas_lojas (id INTEGER, loja TEXT, valor REAL, cancelada INTEGER);`,
      `INSERT INTO vendas_lojas VALUES
        (1, 'Filial Paulista', 6500, 0),
        (2, 'Filial Paulista', 5500, 0),
        (3, 'Filial Centro', 8000, 0),
        (4, 'Filial Centro', 4000, 1),
        (5, 'Filial Sul', 7000, 0),
        (6, 'Filial Sul', 8500, 0);`
    ],
    expectedOutput: [
      { loja: 'Filial Sul', total_vendas: 15500 },
      { loja: 'Filial Paulista', total_vendas: 12000 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-02',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'INNER JOIN & AGREGAÇÃO',
    title: 'Receita Total por Categoria de Produto',
    description:
      'Relacione as tabelas `itens_pedido` e `catalogo` pelo campo `id_produto`. Calcule a receita total (`SUM(qtd * preco_unitario)` como `receita`) por `categoria`. Ordene pela `receita` decrescente.',
    hint: 'Faça JOIN entre itens_pedido e catalogo, agrupe por categoria e some qtd * preco_unitario.',
    tableSetup: [
      `CREATE TABLE catalogo (id_produto INTEGER, categoria TEXT, preco_unitario REAL);`,
      `CREATE TABLE itens_pedido (id_pedido INTEGER, id_produto INTEGER, qtd INTEGER);`,
      `INSERT INTO catalogo VALUES
        (1, 'Hardware', 500),
        (2, 'Software', 300),
        (3, 'Redes', 200);`,
      `INSERT INTO itens_pedido VALUES
        (10, 1, 4),
        (11, 1, 2),
        (12, 2, 5),
        (13, 3, 3);`
    ],
    expectedOutput: [
      { categoria: 'Hardware', receita: 3000 },
      { categoria: 'Software', receita: 1500 },
      { categoria: 'Redes', receita: 600 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-03',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'LEFT JOIN ANTI-PATTERN',
    title: 'Clientes Cadastrados Que Nunca Fizeram um Pedido',
    description:
      'Dadas as tabelas `clientes` e `pedidos`, encontre todos os clientes que não possuem nenhum pedido registrado na tabela `pedidos`. Retorne `id_cliente` e `nome_cliente`, ordenados por `id_cliente` crescente.',
    hint: 'Use LEFT JOIN pedidos ON ... WHERE pedidos.id_cliente IS NULL (ou NOT EXISTS).',
    tableSetup: [
      `CREATE TABLE clientes (id_cliente INTEGER, nome_cliente TEXT);`,
      `CREATE TABLE pedidos (id_pedido INTEGER, id_cliente INTEGER, valor REAL);`,
      `INSERT INTO clientes VALUES
        (1, 'Clinica Vida'),
        (2, 'Mercado BomPreco'),
        (3, 'Padaria Central'),
        (4, 'Farmacia Popular');`,
      `INSERT INTO pedidos VALUES
        (101, 1, 900),
        (102, 3, 450);`
    ],
    expectedOutput: [
      { id_cliente: 2, nome_cliente: 'Mercado BomPreco' },
      { id_cliente: 4, nome_cliente: 'Farmacia Popular' }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-04',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'CASE WHEN',
    title: 'Classificação de Faixa de Ticket dos Pedidos',
    description:
      'Na tabela `pedidos_b2b`, classifique cada pedido em uma coluna chamada `faixa`: se `valor >= 10000` retorne `"Enterprise"`, se `valor >= 3000` retorne `"MidMarket"`, caso contrário `"SMB"`. Retorne `id_pedido`, `valor` e `faixa`, ordenados por `id_pedido` crescente.',
    hint: 'Use CASE WHEN valor >= 10000 THEN "Enterprise" WHEN valor >= 3000 THEN "MidMarket" ELSE "SMB" END.',
    tableSetup: [
      `CREATE TABLE pedidos_b2b (id_pedido INTEGER, valor REAL);`,
      `INSERT INTO pedidos_b2b VALUES
        (1, 14500),
        (2, 4200),
        (3, 1800),
        (4, 10000);`
    ],
    expectedOutput: [
      { id_pedido: 1, valor: 14500, faixa: 'Enterprise' },
      { id_pedido: 2, valor: 4200, faixa: 'MidMarket' },
      { id_pedido: 3, valor: 1800, faixa: 'SMB' },
      { id_pedido: 4, valor: 10000, faixa: 'Enterprise' }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-05',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'SUBQUERY ESCALAR',
    title: 'Vendedores com Faturamento Acima da Média da Equipe',
    description:
      'Na tabela `performance_vendas`, retorne `vendedor` e `faturamento` apenas dos vendedores cujo `faturamento` seja estritamente maior que a média geral de `faturamento` de toda a tabela. Ordene pelo `faturamento` decrescente.',
    hint: 'Compare faturamento > (SELECT AVG(faturamento) FROM performance_vendas).',
    tableSetup: [
      `CREATE TABLE performance_vendas (vendedor TEXT, faturamento REAL);`,
      `INSERT INTO performance_vendas VALUES
        ('Gabriela', 45000),
        ('Henrique', 25000),
        ('Isabela', 55000),
        ('Joao', 15000),
        ('Kleber', 30000);`
    ],
    expectedOutput: [
      { vendedor: 'Isabela', faturamento: 55000 },
      { vendedor: 'Gabriela', faturamento: 45000 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-06',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'AGREGAÇÃO CONDICIONAL',
    title: 'Painel de Entregas no Prazo vs Atrasadas por Transportadora',
    description:
      'Na tabela `remessas`, agrupe por `transportadora` e calcule duas colunas: `no_prazo` (quantidade de entregas com `status = "No Prazo"`) e `atrasadas` (quantidade de entregas com `status = "Atrasada"`). Ordene por `transportadora` em ordem alfabética.',
    hint: 'Use SUM(CASE WHEN status = "No Prazo" THEN 1 ELSE 0 END) e o equivalente para "Atrasada".',
    tableSetup: [
      `CREATE TABLE remessas (id INTEGER, transportadora TEXT, status TEXT);`,
      `INSERT INTO remessas VALUES
        (1, 'FastLog', 'No Prazo'),
        (2, 'FastLog', 'No Prazo'),
        (3, 'FastLog', 'Atrasada'),
        (4, 'RotaSul', 'Atrasada'),
        (5, 'RotaSul', 'Atrasada'),
        (6, 'RotaSul', 'No Prazo');`
    ],
    expectedOutput: [
      { transportadora: 'FastLog', no_prazo: 2, atrasadas: 1 },
      { transportadora: 'RotaSul', no_prazo: 1, atrasadas: 2 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-07',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'TRATAMENTO COALESCE',
    title: 'Folha Total porVendedor Somando Salário Fixo e Comissão',
    description:
      'Na tabela `folha_comercial`, alguns vendedores ainda não tiveram vendas e estão com `comissao` nula (`NULL`). Retorne `vendedor` e a remuneração total (`salario_fixo + COALESCE(comissao, 0)` como `total_receber`), ordenado pelo `total_receber` decrescente.',
    hint: 'Use COALESCE(comissao, 0) ou IFNULL(comissao, 0) antes de somar ao salario_fixo.',
    tableSetup: [
      `CREATE TABLE folha_comercial (vendedor TEXT, salario_fixo REAL, comissao REAL);`,
      `INSERT INTO folha_comercial VALUES
        ('Amanda', 4000, 2500),
        ('Bernardo', 4500, NULL),
        ('Cintia', 4000, 3800);`
    ],
    expectedOutput: [
      { vendedor: 'Cintia', total_receber: 7800 },
      { vendedor: 'Amanda', total_receber: 6500 },
      { vendedor: 'Bernardo', total_receber: 4500 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-08',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'JOIN COM FILTRO',
    title: 'Total Gasto por Clientes do Plano Ouro',
    description:
      'Una as tabelas `clientes_vip` e `compras_vip` pelo campo `id_cliente`. Considerando apenas clientes cujo `nivel = "Ouro"`, retorne `nome` e a soma das compras (`SUM(valor)` como `total_gasto`), ordenados por `total_gasto` decrescente.',
    hint: 'Filtre nivel = "Ouro", agrupe por nome e some valor.',
    tableSetup: [
      `CREATE TABLE clientes_vip (id_cliente INTEGER, nome TEXT, nivel TEXT);`,
      `CREATE TABLE compras_vip (id_compra INTEGER, id_cliente INTEGER, valor REAL);`,
      `INSERT INTO clientes_vip VALUES
        (1, 'Roberto', 'Ouro'),
        (2, 'Simone', 'Prata'),
        (3, 'Tatiana', 'Ouro');`,
      `INSERT INTO compras_vip VALUES
        (10, 1, 1200),
        (11, 1, 800),
        (12, 2, 5000),
        (13, 3, 3100);`
    ],
    expectedOutput: [
      { nome: 'Tatiana', total_gasto: 3100 },
      { nome: 'Roberto', total_gasto: 2000 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-09',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'CARDINALIDADE DISTINCT',
    title: 'Departamentos que Atendem Mais de 2 Estados Distintos',
    description:
      'Na tabela `alocacao_projetos`, descubra quais áreas (`departamento`) possuem projetos em mais de 2 estados diferentes (`COUNT(DISTINCT uf) > 2`). Retorne `departamento` e `qtd_estados`, ordenados por `qtd_estados` decrescente.',
    hint: 'Agrupe por departamento e filtre COUNT(DISTINCT uf) > 2 no HAVING.',
    tableSetup: [
      `CREATE TABLE alocacao_projetos (projeto TEXT, departamento TEXT, uf TEXT);`,
      `INSERT INTO alocacao_projetos VALUES
        ('P1', 'Engenharia', 'SP'),
        ('P2', 'Engenharia', 'RJ'),
        ('P3', 'Engenharia', 'MG'),
        ('P4', 'Engenharia', 'PR'),
        ('P5', 'Auditoria', 'SP'),
        ('P6', 'Auditoria', 'SP'),
        ('P7', 'Consultoria', 'SP'),
        ('P8', 'Consultoria', 'BA'),
        ('P9', 'Consultoria', 'RS');`
    ],
    expectedOutput: [
      { departamento: 'Engenharia', qtd_estados: 4 },
      { departamento: 'Consultoria', qtd_estados: 3 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-10',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'TICKET MÉDIO',
    title: 'Ticket Médio por Canal de Venda Acima de 500',
    description:
      'Na tabela `vendas_canais`, calcule a média da coluna `valor` (`AVG(valor)` como `ticket_medio`) para cada `canal`. Retorne apenas os canais com `ticket_medio > 500`, ordenados pelo `ticket_medio` decrescente.',
    hint: 'Agrupe por canal e use HAVING AVG(valor) > 500.',
    tableSetup: [
      `CREATE TABLE vendas_canais (id INTEGER, canal TEXT, valor REAL);`,
      `INSERT INTO vendas_canais VALUES
        (1, 'App Mobile', 600),
        (2, 'App Mobile', 800),
        (3, 'Loja Fisica', 300),
        (4, 'Loja Fisica', 400),
        (5, 'Portal B2B', 1200),
        (6, 'Portal B2B', 1600);`
    ],
    expectedOutput: [
      { canal: 'Portal B2B', ticket_medio: 1400 },
      { canal: 'App Mobile', ticket_medio: 700 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-11',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'JOIN & AGRUPAMENTO',
    title: 'Folha Salarial Total por Nome de Departamento',
    description:
      'Relacione as tabelas `colaboradores` e `departamentos` pelo campo `id_depto`. Calcule a soma de `salario` (`total_folha`) e a quantidade de pessoas (`qtd_pessoas`) por `nome_depto`. Ordene por `total_folha` decrescente.',
    hint: 'Faça JOIN entre colaboradores e departamentos, agrupe por nome_depto e calcule SUM(salario) e COUNT(*).',
    tableSetup: [
      `CREATE TABLE departamentos (id_depto INTEGER, nome_depto TEXT);`,
      `CREATE TABLE colaboradores (id INTEGER, nome TEXT, id_depto INTEGER, salario REAL);`,
      `INSERT INTO departamentos VALUES (1, 'Engenharia'), (2, 'Produto'), (3, 'RH');`,
      `INSERT INTO colaboradores VALUES
        (10, 'Lucas', 1, 9000),
        (11, 'Carla', 1, 8500),
        (12, 'Pedro', 2, 11000),
        (13, 'Sofia', 3, 5500);`
    ],
    expectedOutput: [
      { nome_depto: 'Engenharia', total_folha: 17500, qtd_pessoas: 2 },
      { nome_depto: 'Produto', total_folha: 11000, qtd_pessoas: 1 },
      { nome_depto: 'RH', total_folha: 5500, qtd_pessoas: 1 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-12',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'LEFT JOIN & COALESCE',
    title: 'Estoque Total por Produto Incluindo Itens Sem Entrada no Galpão',
    description:
      'Relacione `produtos_base` com `entradas_galpao` usando `LEFT JOIN` pelo campo `id_prod`. Retorne `nome_prod` e a soma das quantidades recebidas (`COALESCE(SUM(qtd), 0)` como `estoque_total`), ordenados por `estoque_total` decrescente e `nome_prod` crescente.',
    hint: 'Use LEFT JOIN entradas_galpao ON ... e agrupe por nome_prod aplicando COALESCE(SUM(qtd), 0).',
    tableSetup: [
      `CREATE TABLE produtos_base (id_prod INTEGER, nome_prod TEXT);`,
      `CREATE TABLE entradas_galpao (id_entrada INTEGER, id_prod INTEGER, qtd INTEGER);`,
      `INSERT INTO produtos_base VALUES (1, 'Roteador Wi-Fi'), (2, 'Switch 24p'), (3, 'Patch Cord');`,
      `INSERT INTO entradas_galpao VALUES (100, 1, 30), (101, 1, 20), (102, 3, 15);`
    ],
    expectedOutput: [
      { nome_prod: 'Roteador Wi-Fi', estoque_total: 50 },
      { nome_prod: 'Patch Cord', estoque_total: 15 },
      { nome_prod: 'Switch 24p', estoque_total: 0 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-13',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'TAXA DE CONVERSÃO',
    title: 'Taxa de Aprovação de Crédito por Faixa de Renda',
    description:
      'Na tabela `propostas_credito`, agrupe por `faixa_renda` e calcule o total de propostas (`total`) e quantas foram aprovadas (`SUM(CASE WHEN aprovado = 1 THEN 1 ELSE 0 END)` como `aprovadas`). Ordene por `aprovadas` decrescente.',
    hint: 'Agrupe por faixa_renda, use COUNT(*) e SUM(CASE WHEN aprovado = 1 THEN 1 ELSE 0 END).',
    tableSetup: [
      `CREATE TABLE propostas_credito (id INTEGER, faixa_renda TEXT, aprovado INTEGER);`,
      `INSERT INTO propostas_credito VALUES
        (1, 'Alta', 1),
        (2, 'Alta', 1),
        (3, 'Alta', 1),
        (4, 'Media', 1),
        (5, 'Media', 0),
        (6, 'Baixa', 0);`
    ],
    expectedOutput: [
      { faixa_renda: 'Alta', total: 3, aprovadas: 3 },
      { faixa_renda: 'Media', total: 2, aprovadas: 1 },
      { faixa_renda: 'Baixa', total: 1, aprovadas: 0 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-14',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'HAVING COM MÚLTIPLOS CRITÉRIOS',
    title: 'Fornecedores Confiáveis com Mínimo de 2 Entregas e Média Acima de 90',
    description:
      'Na tabela `avaliacao_fornecedores`, agrupe por `fornecedor` e retorne `fornecedor`, `qtd_entregas` (`COUNT(*)`) e `nota_media` (`AVG(nota)`). Filtre apenas fornecedores com pelo menos 2 entregas e `nota_media >= 90`. Ordene por `nota_media` decrescente.',
    hint: 'Agrupe por fornecedor e filtre no HAVING COUNT(*) >= 2 AND AVG(nota) >= 90.',
    tableSetup: [
      `CREATE TABLE avaliacao_fornecedores (fornecedor TEXT, nota REAL);`,
      `INSERT INTO avaliacao_fornecedores VALUES
        ('MetalSul', 95),
        ('MetalSul', 91),
        ('PlastCorp', 100),
        ('QuimicaBR', 85),
        ('QuimicaBR', 89),
        ('AcoForte', 90),
        ('AcoForte', 92);`
    ],
    expectedOutput: [
      { fornecedor: 'MetalSul', qtd_entregas: 2, nota_media: 93 },
      { fornecedor: 'AcoForte', qtd_entregas: 2, nota_media: 91 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-i-15',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'SUBQUERY IN / EXISTS',
    title: 'Produtos do Catálogo que Tiveram Devolução Registrada',
    description:
      'Retorne `id_produto` e `nome` da tabela `produtos_venda` apenas para os produtos cujo `id_produto` aparece na tabela `devolucoes` com `motivo = "Defeito"`. Ordene por `id_produto` crescente.',
    hint: 'Use WHERE id_produto IN (SELECT id_produto FROM devolucoes WHERE motivo = "Defeito").',
    tableSetup: [
      `CREATE TABLE produtos_venda (id_produto INTEGER, nome TEXT);`,
      `CREATE TABLE devolucoes (id_dev INTEGER, id_produto INTEGER, motivo TEXT);`,
      `INSERT INTO produtos_venda VALUES (1, 'Fone Bluetooth'), (2, 'Carregador Turbo'), (3, 'Webcam HD');`,
      `INSERT INTO devolucoes VALUES (10, 1, 'Defeito'), (11, 2, 'Arrependimento'), (12, 3, 'Defeito'), (13, 1, 'Defeito');`
    ],
    expectedOutput: [
      { id_produto: 1, nome: 'Fone Bluetooth' },
      { id_produto: 3, nome: 'Webcam HD' }
    ],
    orderSensitive: true
  },

  // ============================================================================
  // NÍVEL AVANÇADO (10 PERGUNTAS COM WINDOW FUNCTIONS, CTES, RANK, LAG)
  // ============================================================================
  {
    id: 'duel-a-01',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'WINDOW RANKING',
    title: 'O Maior Salário de Cada Departamento',
    description:
      'Na tabela `quadro_salarios`, encontre o funcionário mais bem pago de cada `departamento`. Retorne `departamento`, `nome` e `salario`, ordenados por `salario` decrescente.',
    hint: 'Use ROW_NUMBER() ou RANK() OVER (PARTITION BY departamento ORDER BY salario DESC) em uma CTE e filtre a posição 1.',
    tableSetup: [
      `CREATE TABLE quadro_salarios (nome TEXT, departamento TEXT, salario REAL);`,
      `INSERT INTO quadro_salarios VALUES
        ('Helena', 'Dados', 16500),
        ('Igor', 'Dados', 13200),
        ('Julia', 'Produto', 15000),
        ('Leonardo', 'Produto', 11800),
        ('Mirella', 'Seguranca', 18000),
        ('Nelson', 'Seguranca', 14000);`
    ],
    expectedOutput: [
      { departamento: 'Seguranca', nome: 'Mirella', salario: 18000 },
      { departamento: 'Dados', nome: 'Helena', salario: 16500 },
      { departamento: 'Produto', nome: 'Julia', salario: 15000 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-02',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'RUNNING TOTAL',
    title: 'Receita Acumulada Dia a Dia no Caixa',
    description:
      'Na tabela `fluxo_diario`, retorne `dia`, `receita_dia` e a soma acumulada progressiva (`SUM(receita_dia) OVER (ORDER BY dia)` como `acumulado`), ordenados por `dia` crescente.',
    hint: 'Use SUM(receita_dia) OVER (ORDER BY dia) para calcular o acumulado móvel.',
    tableSetup: [
      `CREATE TABLE fluxo_diario (dia INTEGER, receita_dia REAL);`,
      `INSERT INTO fluxo_diario VALUES
        (1, 1500),
        (2, 2300),
        (3, 1200),
        (4, 3000);`
    ],
    expectedOutput: [
      { dia: 1, receita_dia: 1500, acumulado: 1500 },
      { dia: 2, receita_dia: 2300, acumulado: 3800 },
      { dia: 3, receita_dia: 1200, acumulado: 5000 },
      { dia: 4, receita_dia: 3000, acumulado: 8000 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-03',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'LAG & VARIAÇÃO',
    title: 'Diferença de Vendas em Relação ao Mês Anterior',
    description:
      'Na tabela `fechamento_mensal`, para cada `mes`, retorne `mes`, `receita` e a variação absoluta em relação ao mês imediatamente anterior (`receita - LAG(receita) OVER (ORDER BY mes)` como `variacao`). Ordene por `mes` crescente.',
    hint: 'Subtraia LAG(receita) OVER (ORDER BY mes) da coluna receita.',
    tableSetup: [
      `CREATE TABLE fechamento_mensal (mes INTEGER, receita REAL);`,
      `INSERT INTO fechamento_mensal VALUES
        (1, 10000),
        (2, 13500),
        (3, 12000),
        (4, 16000);`
    ],
    expectedOutput: [
      { mes: 1, receita: 10000, variacao: null },
      { mes: 2, receita: 13500, variacao: 3500 },
      { mes: 3, receita: 12000, variacao: -1500 },
      { mes: 4, receita: 16000, variacao: 4000 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-04',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'SUBQUERY CORRELACIONADA',
    title: 'Produtos Mais Caros que a Média da Sua Própria Categoria',
    description:
      'Na tabela `itens_mercado`, encontre todos os produtos cujo `preco` seja estritamente maior que o preço médio da sua respectiva `categoria`. Retorne `produto`, `categoria` e `preco`, ordenados pelo `preco` decrescente.',
    hint: 'Compare o preco do item com uma subquery correlacionada (SELECT AVG(preco) FROM itens_mercado i2 WHERE i2.categoria = i1.categoria).',
    tableSetup: [
      `CREATE TABLE itens_mercado (produto TEXT, categoria TEXT, preco REAL);`,
      `INSERT INTO itens_mercado VALUES
        ('Cafe Especial', 'Mercearia', 38),
        ('Cafe Tradicional', 'Mercearia', 18),
        ('Acucar', 'Mercearia', 10),
        ('Picanha Maturada', 'Acougue', 95),
        ('Alcatra', 'Acougue', 55),
        ('Patinho', 'Acougue', 45);`
    ],
    expectedOutput: [
      { produto: 'Picanha Maturada', categoria: 'Acougue', preco: 95 },
      { produto: 'Cafe Especial', categoria: 'Mercearia', preco: 38 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-05',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'TOP-N POR GRUPO',
    title: 'Os 2 Melhores Vendedores de Cada Regional',
    description:
      'Na tabela `ranking_regional`, atribua a posição de cada `vendedor` dentro da sua `regional` (ordenado por `vendas DESC`) e retorne apenas os 2 primeiros colocados de cada regional (`regional`, `vendedor`, `vendas`, `pos`), ordenados por `regional` crescente e `pos` crescente.',
    hint: 'Use ROW_NUMBER() OVER (PARTITION BY regional ORDER BY vendas DESC) AS pos dentro de uma CTE e filtre pos <= 2.',
    tableSetup: [
      `CREATE TABLE ranking_regional (regional TEXT, vendedor TEXT, vendas REAL);`,
      `INSERT INTO ranking_regional VALUES
        ('Norte', 'Alice', 9000),
        ('Norte', 'Breno', 7500),
        ('Norte', 'Caio', 4000),
        ('Sul', 'Diana', 12000),
        ('Sul', 'Enzo', 10500),
        ('Sul', 'Fabio', 8000);`
    ],
    expectedOutput: [
      { regional: 'Norte', vendedor: 'Alice', vendas: 9000, pos: 1 },
      { regional: 'Norte', vendedor: 'Breno', vendas: 7500, pos: 2 },
      { regional: 'Sul', vendedor: 'Diana', vendas: 12000, pos: 1 },
      { regional: 'Sul', vendedor: 'Enzo', vendas: 10500, pos: 2 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-06',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'PARTICIPAÇÃO PERCENTUAL',
    title: 'Share Percentual de Cada Filial no Faturamento Global',
    description:
      'Na tabela `receita_filiais`, retorne `filial`, `faturamento` e a participação percentual exata da filial no total da empresa (`faturamento * 100.0 / SUM(faturamento) OVER ()` como `share_pct`). Ordene por `faturamento` decrescente.',
    hint: 'Multiplique faturamento por 100.0 e divida por SUM(faturamento) OVER ().',
    tableSetup: [
      `CREATE TABLE receita_filiais (filial TEXT, faturamento REAL);`,
      `INSERT INTO receita_filiais VALUES
        ('Matriz SP', 50000),
        ('Unidade RJ', 30000),
        ('Unidade MG', 20000);`
    ],
    expectedOutput: [
      { filial: 'Matriz SP', faturamento: 50000, share_pct: 50.0 },
      { filial: 'Unidade RJ', faturamento: 30000, share_pct: 30.0 },
      { filial: 'Unidade MG', faturamento: 20000, share_pct: 20.0 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-07',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'MÉDIA MÓVEL',
    title: 'Média Móvel de 2 Períodos na Demanda de Energia',
    description:
      'Na tabela `consumo_energia`, retorne `hora`, `mw` e a média móvel considerando a linha atual e a imediatamente anterior (`AVG(mw) OVER (ORDER BY hora ROWS BETWEEN 1 PRECEDING AND CURRENT ROW)` como `media_movel`). Ordene por `hora` crescente.',
    hint: 'Use AVG(mw) OVER (ORDER BY hora ROWS BETWEEN 1 PRECEDING AND CURRENT ROW).',
    tableSetup: [
      `CREATE TABLE consumo_energia (hora INTEGER, mw REAL);`,
      `INSERT INTO consumo_energia VALUES
        (1, 100),
        (2, 140),
        (3, 160),
        (4, 200);`
    ],
    expectedOutput: [
      { hora: 1, mw: 100, media_movel: 100 },
      { hora: 2, mw: 140, media_movel: 120 },
      { hora: 3, mw: 160, media_movel: 150 },
      { hora: 4, mw: 200, media_movel: 180 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-08',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'DEDUPLICAÇÃO POR DATA',
    title: 'Último Status Registrado de Cada Pedido no Log',
    description:
      'Na tabela `historico_status`, um mesmo `id_pedido` possui múltiplos eventos ao longo do tempo (`sequencia`). Retorne apenas o registro mais recente (maior `sequencia`) de cada `id_pedido`, trazendo `id_pedido`, `status_atual` e `sequencia`, ordenados por `id_pedido` crescente.',
    hint: 'Use ROW_NUMBER() OVER (PARTITION BY id_pedido ORDER BY sequencia DESC) = 1 em uma CTE ou subquery.',
    tableSetup: [
      `CREATE TABLE historico_status (id_pedido TEXT, status_atual TEXT, sequencia INTEGER);`,
      `INSERT INTO historico_status VALUES
        ('P-01', 'Criado', 1),
        ('P-01', 'Pago', 2),
        ('P-01', 'Enviado', 3),
        ('P-02', 'Criado', 1),
        ('P-02', 'Cancelado', 2);`
    ],
    expectedOutput: [
      { id_pedido: 'P-01', status_atual: 'Enviado', sequencia: 3 },
      { id_pedido: 'P-02', status_atual: 'Cancelado', sequencia: 2 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-09',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'DENSE RANK',
    title: 'Ranking Sem Saltos de Pontuação em Torneio de Dados',
    description:
      'Na tabela `pontuacao_analistas`, classifique os participantes usando ranking denso sem pular posições em caso de empate (`DENSE_RANK() OVER (ORDER BY pontos DESC)` como `colocacao`). Retorne `analista`, `pontos` e `colocacao`, ordenados por `colocacao` crescente e `analista` crescente.',
    hint: 'Aplique DENSE_RANK() OVER (ORDER BY pontos DESC) AS colocacao.',
    tableSetup: [
      `CREATE TABLE pontuacao_analistas (analista TEXT, pontos INTEGER);`,
      `INSERT INTO pontuacao_analistas VALUES
        ('Clara', 950),
        ('Diego', 950),
        ('Elisa', 880),
        ('Fagner', 810);`
    ],
    expectedOutput: [
      { analista: 'Clara', pontos: 950, colocacao: 1 },
      { analista: 'Diego', pontos: 950, colocacao: 1 },
      { analista: 'Elisa', pontos: 880, colocacao: 2 },
      { analista: 'Fagner', pontos: 810, colocacao: 3 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-10',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'COORTE & RETENÇÃO',
    title: 'Clientes com Compras em Todos os 3 Trimestres',
    description:
      'Na tabela `compras_trimestre`, identifique os clientes que compraram nos 3 trimestres distintos (`COUNT(DISTINCT trimestre) = 3`) e cuja soma total de `valor` supere 3000. Retorne `cliente` e `total_anual`, ordenados por `total_anual` decrescente.',
    hint: 'Agrupe por cliente e use HAVING COUNT(DISTINCT trimestre) = 3 AND SUM(valor) > 3000.',
    tableSetup: [
      `CREATE TABLE compras_trimestre (cliente TEXT, trimestre INTEGER, valor REAL);`,
      `INSERT INTO compras_trimestre VALUES
        ('Grupo Alfa', 1, 1500),
        ('Grupo Alfa', 2, 1200),
        ('Grupo Alfa', 3, 1800),
        ('Grupo Beta', 1, 2000),
        ('Grupo Beta', 1, 2000),
        ('Grupo Beta', 2, 1500),
        ('Grupo Gama', 1, 900),
        ('Grupo Gama', 2, 800),
        ('Grupo Gama', 3, 1000);`
    ],
    expectedOutput: [{ cliente: 'Grupo Alfa', total_anual: 4500 }],
    orderSensitive: true
  },
  {
    id: 'duel-a-11',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'LEAD & PRÓXIMO EVENTO',
    title: 'Valor da Próxima Compra de Cada Cliente',
    description:
      'Na tabela `historico_compras`, para cada linha retorne `cliente`, `ordem_compra`, `valor` e o valor da compra seguinte do mesmo cliente (`LEAD(valor) OVER (PARTITION BY cliente ORDER BY ordem_compra)` como `proxima_compra`). Ordene por `cliente` e `ordem_compra` crescentes.',
    hint: 'Use LEAD(valor) OVER (PARTITION BY cliente ORDER BY ordem_compra) AS proxima_compra.',
    tableSetup: [
      `CREATE TABLE historico_compras (cliente TEXT, ordem_compra INTEGER, valor REAL);`,
      `INSERT INTO historico_compras VALUES
        ('Ana', 1, 200),
        ('Ana', 2, 450),
        ('Ana', 3, 300),
        ('Bruno', 1, 800),
        ('Bruno', 2, 950);`
    ],
    expectedOutput: [
      { cliente: 'Ana', ordem_compra: 1, valor: 200, proxima_compra: 450 },
      { cliente: 'Ana', ordem_compra: 2, valor: 450, proxima_compra: 300 },
      { cliente: 'Ana', ordem_compra: 3, valor: 300, proxima_compra: null },
      { cliente: 'Bruno', ordem_compra: 1, valor: 800, proxima_compra: 950 },
      { cliente: 'Bruno', ordem_compra: 2, valor: 950, proxima_compra: null }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-12',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'ACUMULADO POR PARTIÇÃO',
    title: 'Faturamento Acumulado por Vendedor ao Longo dos Meses',
    description:
      'Na tabela `metas_vendedor`, retorne `vendedor`, `mes`, `venda_mes` e o acumulado daquele vendedor até o mês (`SUM(venda_mes) OVER (PARTITION BY vendedor ORDER BY mes)` como `acumulado_vendedor`). Ordene por `vendedor` crescente e `mes` crescente.',
    hint: 'Use SUM(venda_mes) OVER (PARTITION BY vendedor ORDER BY mes) AS acumulado_vendedor.',
    tableSetup: [
      `CREATE TABLE metas_vendedor (vendedor TEXT, mes INTEGER, venda_mes REAL);`,
      `INSERT INTO metas_vendedor VALUES
        ('Lucas', 1, 10000),
        ('Lucas', 2, 15000),
        ('Marina', 1, 20000),
        ('Marina', 2, 18000);`
    ],
    expectedOutput: [
      { vendedor: 'Lucas', mes: 1, venda_mes: 10000, acumulado_vendedor: 10000 },
      { vendedor: 'Lucas', mes: 2, venda_mes: 15000, acumulado_vendedor: 25000 },
      { vendedor: 'Marina', mes: 1, venda_mes: 20000, acumulado_vendedor: 20000 },
      { vendedor: 'Marina', mes: 2, venda_mes: 18000, acumulado_vendedor: 38000 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-13',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'DIFERENÇA PARA O LÍDER',
    title: 'Distância Salarial para o Maior Salário do Departamento',
    description:
      'Na tabela `salarios_depto`, retorne `departamento`, `colaborador`, `salario` e a diferença entre o maior salário do respectivo departamento e o salário do colaborador (`MAX(salario) OVER (PARTITION BY departamento) - salario` como `gap_lider`). Ordene por `departamento` crescente e `salario` decrescente.',
    hint: 'Subtraia salario de MAX(salario) OVER (PARTITION BY departamento).',
    tableSetup: [
      `CREATE TABLE salarios_depto (departamento TEXT, colaborador TEXT, salario REAL);`,
      `INSERT INTO salarios_depto VALUES
        ('Dados', 'Nina', 15000),
        ('Dados', 'Otavio', 11500),
        ('Cloud', 'Paula', 18000),
        ('Cloud', 'Renan', 14000);`
    ],
    expectedOutput: [
      { departamento: 'Cloud', colaborador: 'Paula', salario: 18000, gap_lider: 0 },
      { departamento: 'Cloud', colaborador: 'Renan', salario: 14000, gap_lider: 4000 },
      { departamento: 'Dados', colaborador: 'Nina', salario: 15000, gap_lider: 0 },
      { departamento: 'Dados', colaborador: 'Otavio', salario: 11500, gap_lider: 3500 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-14',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'SEGUNDO MAIOR POR GRUPO',
    title: 'O Segundo Produto Mais Vendido de Cada Categoria',
    description:
      'Na tabela `vendas_produtos`, descubra qual é o 2º produto com maior `receita` dentro de cada `categoria`. Retorne `categoria`, `produto` e `receita`, ordenados por `receita` decrescente.',
    hint: 'Use ROW_NUMBER() OVER (PARTITION BY categoria ORDER BY receita DESC) AS rn em uma CTE e filtre WHERE rn = 2.',
    tableSetup: [
      `CREATE TABLE vendas_produtos (categoria TEXT, produto TEXT, receita REAL);`,
      `INSERT INTO vendas_produtos VALUES
        ('Bebidas', 'Refrigerante 2L', 9000),
        ('Bebidas', 'Suco Integral', 6500),
        ('Bebidas', 'Agua Com Gas', 3000),
        ('Laticinios', 'Queijo Prato', 12000),
        ('Laticinios', 'Iogurte Grego', 8200),
        ('Laticinios', 'Manteiga', 4100);`
    ],
    expectedOutput: [
      { categoria: 'Laticinios', produto: 'Iogurte Grego', receita: 8200 },
      { categoria: 'Bebidas', produto: 'Suco Integral', receita: 6500 }
    ],
    orderSensitive: true
  },
  {
    id: 'duel-a-15',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'CTE & FILTRO DE CRESCIMENTO',
    title: 'Filiais com Receita Acima de 80% da Média Corporativa',
    description:
      'Na tabela `unidades_negocio`, soma-se o `faturamento` de cada `unidade`. Usando uma CTE, calcule o total por `unidade` e retorne apenas as unidades cujo total seja estritamente maior que a média dos totais de todas as unidades. Retorne `unidade` e `total_unidade`, ordenados por `total_unidade` decrescente.',
    hint: 'Crie uma CTE totais AS (SELECT unidade, SUM(faturamento) AS total_unidade FROM unidades_negocio GROUP BY unidade) e filtre total_unidade > (SELECT AVG(total_unidade) FROM totais).',
    tableSetup: [
      `CREATE TABLE unidades_negocio (unidade TEXT, mes INTEGER, faturamento REAL);`,
      `INSERT INTO unidades_negocio VALUES
        ('Sudeste', 1, 30000),
        ('Sudeste', 2, 35000),
        ('Sul', 1, 20000),
        ('Sul', 2, 25000),
        ('Norte', 1, 10000),
        ('Norte', 2, 12000),
        ('Centro', 1, 12000),
        ('Centro', 2, 16000);`
    ],
    expectedOutput: [
      { unidade: 'Sudeste', total_unidade: 65000 },
      { unidade: 'Sul', total_unidade: 45000 }
    ],
    orderSensitive: true
  }
];
