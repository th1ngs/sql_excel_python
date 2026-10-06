import { Challenge } from '../types';

export const narrativeChallenges: Challenge[] = [
  // ============================================================================
  // SQL — NÍVEL BÁSICO (JUNIOR) — NARRATIVAS DESAFIADORAS (SEM FACILITAR)
  // ============================================================================
  {
    id: 'sql-narr-b-1',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'AUDITORIA DE RISCO',
    challengeType: 'narrativa',
    businessContext: 'Fintech HorizonPay · Prevenção a Fraudes em PIX Noturno',
    title: 'Operação Coruja: Transações Suspeitas na Madrugada',
    description:
      'O time de Risco da HorizonPay identificou uma onda de invasões de contas ocorrendo exclusivamente durante a madrugada. A diretoria pediu uma listagem imediata das transações que atendam simultaneamente aos seguintes critérios de alerta: (1) realizadas no turno "Madrugada", (2) com status efetivamente "Aprovada" (ignore tentativas "Negada" ou "Estornada"), (3) cujo valor seja estritamente superior a R$ 1.500,00 e (4) originadas de dispositivos NÃO confiáveis (dispositivo_confiavel = 0). Retorne o id_transacao, cliente e valor, ordenados do maior valor para o menor.',
    hint: 'Combine os quatro filtros de negócio na cláusula de filtragem e garanta a ordenação decrescente pelo valor da transação.',
    tableSetup: [
      `CREATE TABLE transacoes_pix (
        id_transacao TEXT,
        cliente TEXT,
        valor REAL,
        turno TEXT,
        status TEXT,
        dispositivo_confiavel INTEGER
      );`,
      `INSERT INTO transacoes_pix VALUES
        ('TX-901', 'Carlos Eduardo', 4200.00, 'Madrugada', 'Aprovada', 0),
        ('TX-902', 'Fernanda Lima', 8500.00, 'Madrugada', 'Negada', 0),
        ('TX-903', 'Roberto Alves', 1500.00, 'Madrugada', 'Aprovada', 0),
        ('TX-904', 'Juliana Costa', 2950.00, 'Madrugada', 'Aprovada', 1),
        ('TX-905', 'Marcos Paulo', 6100.00, 'Madrugada', 'Aprovada', 0),
        ('TX-906', 'Patricia Gomes', 3300.00, 'Noite', 'Aprovada', 0),
        ('TX-907', 'André Souza', 1890.00, 'Madrugada', 'Aprovada', 0);`
    ],
    expectedOutput: [
      { id_transacao: 'TX-905', cliente: 'Marcos Paulo', valor: 6100 },
      { id_transacao: 'TX-901', cliente: 'Carlos Eduardo', valor: 4200 },
      { id_transacao: 'TX-907', cliente: 'André Souza', valor: 1890 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-b-2',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'HIGIENIZAÇÃO DE DADOS',
    challengeType: 'narrativa',
    businessContext: 'E-commerce Veloce · Auditoria de Cadastro de Fornecedores',
    title: 'Expurgo de Contas de Teste e Fornecedores Fantasmas',
    description:
      'Durante a migração do ERP da Veloce, desenvolvedores deixaram contas de homologação misturadas aos fornecedores reais na tabela `fornecedores`. A controladoria precisa emitir os pagamentos do mês, mas exige que você filtre a base removendo: (1) qualquer fornecedor cujo `cnpj` esteja nulo, (2) qualquer registro cujo `razao_social` contenha a palavra "TESTE" (em qualquer posição), e (3) fornecedores com status "Bloqueado". Além disso, se a coluna `taxa_retencao` estiver nula, ela deve ser exibida como 0. Retorne `id_fornecedor`, `razao_social` e a taxa tratada como `taxa_final`, ordenados pelo `id_fornecedor` crescente.',
    hint: 'Atenção ao tratamento de nulos tanto no filtro do CNPJ quanto na substituição do valor de taxa_retencao, além da exclusão textual e de status.',
    tableSetup: [
      `CREATE TABLE fornecedores (
        id_fornecedor INTEGER,
        razao_social TEXT,
        cnpj TEXT,
        status TEXT,
        taxa_retencao REAL
      );`,
      `INSERT INTO fornecedores VALUES
        (10, 'Alpha Logistica S.A.', '12.345.678/0001-90', 'Ativo', 4.5),
        (11, 'Fornecedor TESTE Integracao', '99.999.999/0001-99', 'Ativo', 2.0),
        (12, 'Beta Embalagens Ltda', NULL, 'Ativo', 3.0),
        (13, 'Gama Suprimentos Industriais', '44.555.666/0001-11', 'Ativo', NULL),
        (14, 'Delta Transportes Express', '77.888.999/0001-22', 'Bloqueado', 5.0),
        (15, 'Omega Componentes Eletronicos', '33.222.111/0001-55', 'Ativo', 1.5);`
    ],
    expectedOutput: [
      { id_fornecedor: 10, razao_social: 'Alpha Logistica S.A.', taxa_final: 4.5 },
      { id_fornecedor: 13, razao_social: 'Gama Suprimentos Industriais', taxa_final: 0 },
      { id_fornecedor: 15, razao_social: 'Omega Componentes Eletronicos', taxa_final: 1.5 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-b-3',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'MARGEM COMERCIAL',
    challengeType: 'narrativa',
    businessContext: 'Varejo Farmacêutico VidaFarma · Auditoria de Preços Negativos',
    title: 'Ruptura de Margem na Black Friday',
    description:
      'Um erro na configuração de cupons acumulativos fez com que alguns medicamentos fossem vendidos abaixo do preço de custo na rede VidaFarma. A diretoria comercial quer identificar todas as vendas da categoria "Medicamentos" ou "Dermocosméticos" onde o lucro líquido unitário (`preco_venda - desconto_aplicado - custo_unitario`) ficou negativo (menor que zero). Retorne `sku`, `produto` e o valor calculado do `prejuizo_unitario` (ou seja, o próprio resultado negativo de `preco_venda - desconto_aplicado - custo_unitario`), ordenado do pior prejuízo (mais negativo) para o menos negativo.',
    hint: 'Cuidado com a precedência de operadores caso filtre duas categorias com OR combinado a uma condição matemática com AND.',
    tableSetup: [
      `CREATE TABLE vendas_promocao (
        sku TEXT,
        produto TEXT,
        categoria TEXT,
        preco_venda REAL,
        desconto_aplicado REAL,
        custo_unitario REAL
      );`,
      `INSERT INTO vendas_promocao VALUES
        ('SKU-101', 'Serum Vitamina C', 'Dermocosméticos', 120.0, 45.0, 85.0),
        ('SKU-102', 'Analgesico 500mg', 'Medicamentos', 25.0, 5.0, 12.0),
        ('SKU-103', 'Antibiotico Plus', 'Medicamentos', 90.0, 30.0, 68.0),
        ('SKU-104', 'Shampoo Neutro', 'Higiene', 30.0, 15.0, 22.0),
        ('SKU-105', 'Protetor Solar FPS70', 'Dermocosméticos', 110.0, 40.0, 70.0),
        ('SKU-106', 'Colirio Lubrificante', 'Medicamentos', 55.0, 20.0, 42.0);`
    ],
    expectedOutput: [
      { sku: 'SKU-101', produto: 'Serum Vitamina C', prejuizo_unitario: -10 },
      { sku: 'SKU-103', produto: 'Antibiotico Plus', prejuizo_unitario: -8 },
      { sku: 'SKU-106', produto: 'Colirio Lubrificante', prejuizo_unitario: -7 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-b-4',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'SLA LOGÍSTICO',
    challengeType: 'narrativa',
    businessContext: 'Operadora Logística RotaSul · Penalidades Contratuais de SLA',
    title: 'Cargas Críticas Fora da Janela de Entrega',
    description:
      'A RotaSul atende hospitais e supermercados com cláusula de multa caso uma carga refrigerada demore mais do que o tempo máximo contratado (`prazo_max_horas`). No entanto, entregas canceladas pelo cliente (`status_entrega = "Cancelada"`) não geram multa. Extraia a lista de entregas que sofreram atraso real (`horas_decorridas > prazo_max_horas`), que sejam exclusivamente de carga refrigerada (`refrigerada = 1`) e não estejam canceladas. Retorne `codigo_carga`, `destino` e a quantidade de horas excedentes (`horas_decorridas - prazo_max_horas` como `horas_excedentes`), ordenado da maior quantidade de horas excedentes para a menor.',
    hint: 'Valide os três critérios de elegibilidade antes de calcular a diferença entre as horas decorridas e o prazo contratual.',
    tableSetup: [
      `CREATE TABLE entregas_rotasul (
        codigo_carga TEXT,
        destino TEXT,
        refrigerada INTEGER,
        prazo_max_horas INTEGER,
        horas_decorridas INTEGER,
        status_entrega TEXT
      );`,
      `INSERT INTO entregas_rotasul VALUES
        ('CRG-01', 'Hospital Santa Clara', 1, 12, 19, 'Entregue'),
        ('CRG-02', 'Supermercado Central', 0, 24, 36, 'Entregue'),
        ('CRG-03', 'Laboratorio BioVida', 1, 8, 15, 'Cancelada'),
        ('CRG-04', 'Clinica Sao Lucas', 1, 10, 14, 'Em Rota'),
        ('CRG-05', 'Rede Frigorifica Sul', 1, 16, 16, 'Entregue'),
        ('CRG-06', 'Polo Farmaceutico PR', 1, 6, 15, 'Entregue');`
    ],
    expectedOutput: [
      { codigo_carga: 'CRG-06', destino: 'Polo Farmaceutico PR', horas_excedentes: 9 },
      { codigo_carga: 'CRG-01', destino: 'Hospital Santa Clara', horas_excedentes: 7 },
      { codigo_carga: 'CRG-04', destino: 'Clinica Sao Lucas', horas_excedentes: 4 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-b-5',
    track: 'sql',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'COMPLIANCE RH',
    challengeType: 'narrativa',
    businessContext: 'Indústria Metalúrgica Titan · Auditoria Trabalhista de Turnos',
    title: 'Risco de Interjornada e Horas Extras Excessivas',
    description:
      'O setor jurídico da Metalúrgica Titan precisa identificar apontamentos diários de operadores de maquinário pesado (`setor = "Usinagem"` ou `setor = "Fundicao"`) que violaram as normas de segurança do trabalho: qualquer colaborador que tenha registrado mais de 2 horas extras no dia (`horas_extras > 2`) OU cujo descanso entre jornadas tenha sido inferior a 11 horas (`descanso_horas < 11`). Exclua registros de colaboradores em cargos de gestão (`cargo = "Supervisor"`). Retorne `matricula`, `colaborador`, `setor` e `descanso_horas`, ordenados pelo menor tempo de descanso primeiro.',
    hint: 'Combine o filtro de setores permitidos, a exclusão do cargo de Supervisor e a condição composta de violação trabalhista.',
    tableSetup: [
      `CREATE TABLE ponto_diario (
        matricula TEXT,
        colaborador TEXT,
        setor TEXT,
        cargo TEXT,
        horas_extras REAL,
        descanso_horas REAL
      );`,
      `INSERT INTO ponto_diario VALUES
        ('M-101', 'Joao Batista', 'Usinagem', 'Operador', 3.5, 12.0),
        ('M-102', 'Ricardo Mendes', 'Fundicao', 'Supervisor', 4.0, 8.0),
        ('M-103', 'Sergio Vieira', 'Fundicao', 'Operador', 1.0, 9.5),
        ('M-104', 'Luciano Freitas', 'Administrativo', 'Analista', 3.0, 9.0),
        ('M-105', 'Paulo Henrique', 'Usinagem', 'Operador', 2.0, 11.5),
        ('M-106', 'Claudio Ramos', 'Fundicao', 'Operador', 2.5, 8.5);`
    ],
    expectedOutput: [
      { matricula: 'M-106', colaborador: 'Claudio Ramos', setor: 'Fundicao', descanso_horas: 8.5 },
      { matricula: 'M-103', colaborador: 'Sergio Vieira', setor: 'Fundicao', descanso_horas: 9.5 },
      { matricula: 'M-101', colaborador: 'Joao Batista', setor: 'Usinagem', descanso_horas: 12.0 }
    ],
    orderSensitive: true
  },

  // ============================================================================
  // SQL — NÍVEL INTERMEDIÁRIO (ANALYST) — NARRATIVAS DESAFIADORAS
  // ============================================================================
  {
    id: 'sql-narr-i-1',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'RECEITA LÍQUIDA & CHURN',
    challengeType: 'narrativa',
    businessContext: 'SaaS CloudMetrics · Fechamento Financeiro de Contratos Enterprise',
    title: 'Faturamento Líquido Real por Gerente de Contas (Expurgando Estornos)',
    description:
      'Na plataforma B2B CloudMetrics, cada gerente de contas (`gerentes`) possui vários clientes vinculados, e as cobranças mensais ficam na tabela `faturas`. A diretoria financeira descobriu que o relatório antigo inflava as comissões porque somava faturas "Cancelada" e ignorava os créditos de SLA (`desconto_sla`, que pode ser nulo quando não houve falha). Construa uma consulta que retorne apenas os gerentes cuja receita líquida efetiva (soma de `valor_bruto - COALESCE(desconto_sla, 0)` considerando exclusivamente faturas com `status = "Paga"`) ultrapasse R$ 15.000,00. Retorne `nome_gerente`, a quantidade de faturas pagas (`qtd_faturas`) e a `receita_liquida`, ordenados pela `receita_liquida` decrescente.',
    hint: 'Relacione gerentes e faturas, filtre apenas faturas pagas, trate os nulos de desconto_sla antes de somar e aplique o corte de R$ 15.000 no pós-agrupamento.',
    tableSetup: [
      `CREATE TABLE gerentes (
        id_gerente INTEGER,
        nome_gerente TEXT,
        regional TEXT
      );`,
      `CREATE TABLE faturas (
        id_fatura INTEGER,
        id_gerente INTEGER,
        valor_bruto REAL,
        desconto_sla REAL,
        status TEXT
      );`,
      `INSERT INTO gerentes VALUES
        (1, 'Helena Vasconcelos', 'Sudeste'),
        (2, 'Bruno Tavares', 'Sul'),
        (3, 'Camila Rocha', 'Nordeste');`,
      `INSERT INTO faturas VALUES
        (101, 1, 12000.0, 1000.0, 'Paga'),
        (102, 1, 9500.0, NULL, 'Paga'),
        (103, 1, 8000.0, 0.0, 'Cancelada'),
        (104, 2, 10000.0, 500.0, 'Paga'),
        (105, 2, 4000.0, NULL, 'Paga'),
        (106, 3, 18000.0, 1500.0, 'Paga'),
        (107, 3, 5000.0, 500.0, 'Paga');`
    ],
    expectedOutput: [
      { nome_gerente: 'Camila Rocha', qtd_faturas: 2, receita_liquida: 21000 },
      { nome_gerente: 'Helena Vasconcelos', qtd_faturas: 2, receita_liquida: 20500 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-i-2',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'AUDITORIA DE ESTOQUE',
    challengeType: 'narrativa',
    businessContext: 'Rede Atacadista MacroSul · Inventário Fantasma em Centros de Distribuição',
    title: 'SKUs Ativos com Estoque Travado e Zero Giro',
    description:
      'O diretor de Supply Chain da MacroSul suspeita que há capital de giro imobilizado em produtos do catálogo (`produtos`) que possuem saldo em estoque acima de 100 unidades, mas que não tiveram NENHUMA venda concluída (`status_pedido = "Concluido"`) registrada na tabela `itens_vendidos` no trimestre. Atenção: um produto pode aparecer na tabela `itens_vendidos` apenas em pedidos "Cancelado" — nesse caso, ele também tem zero vendas concluídas e DEVE aparecer no seu relatório! Retorne `sku`, `nome_produto` e o `capital_parado` (`estoque_atual * custo_unitario`), ordenados pelo `capital_parado` do maior para o menor.',
    hint: 'Se você filtrar status_pedido = "Concluido" no WHERE após um LEFT JOIN, eliminará justamente os produtos que só tiveram pedidos cancelados. Coloque a condição do status dentro da cláusula ON do LEFT JOIN ou use NOT EXISTS.',
    tableSetup: [
      `CREATE TABLE produtos (
        sku TEXT,
        nome_produto TEXT,
        estoque_atual INTEGER,
        custo_unitario REAL
      );`,
      `CREATE TABLE itens_vendidos (
        id_venda INTEGER,
        sku TEXT,
        qtd INTEGER,
        status_pedido TEXT
      );`,
      `INSERT INTO produtos VALUES
        ('PRD-01', 'Gerador Diesel 8kVA', 150, 2000.0),
        ('PRD-02', 'Compressor Industrial', 200, 1200.0),
        ('PRD-03', 'Soldadora Inverter', 80, 900.0),
        ('PRD-04', 'Bomba Hidraulica Tripla', 120, 1500.0),
        ('PRD-05', 'Talha Eletrica 2T', 180, 1000.0);`,
      `INSERT INTO itens_vendidos VALUES
        (1, 'PRD-01', 5, 'Cancelado'),
        (2, 'PRD-02', 12, 'Concluido'),
        (3, 'PRD-03', 2, 'Cancelado'),
        (4, 'PRD-05', 3, 'Concluido');`
    ],
    expectedOutput: [
      { sku: 'PRD-01', nome_produto: 'Gerador Diesel 8kVA', capital_parado: 300000 },
      { sku: 'PRD-04', nome_produto: 'Bomba Hidraulica Tripla', capital_parado: 180000 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-i-3',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'EFICIÊNCIA HOSPITALAR',
    challengeType: 'narrativa',
    businessContext: 'Rede Hospitalar São Camilo · Auditoria de Reinternação Precoce',
    title: 'Taxa de Reincidência Clínica por Ala Médica',
    description:
      'O comitê de qualidade médica quer identificar quais alas hospitalares apresentam problemas na alta clínica. Na tabela `atendimentos`, cada linha representa uma passagem de paciente pela ala, indicando se foi uma reinternação em menos de 30 dias (`reinternacao_30d` = 1 ou 0) e o `custo_internacao`. Calcule, para cada `ala`, o total de atendimentos (`total_casos`), o total de reinternações (`total_reinternacoes`) e a taxa percentual de reinternação arredondada em 1 casa decimal (`ROUND(SUM(reinternacao_30d) * 100.0 / COUNT(*), 1)` como `taxa_pct`). Exiba apenas as alas que tiveram pelo menos 3 atendimentos registrados e cuja `taxa_pct` seja superior a 25.0%. Ordene pela `taxa_pct` decrescente.',
    hint: 'Multiplique por 100.0 (ponto flutuante) para evitar divisão inteira no SQLite antes de arredondar, e filtre o volume mínimo e a taxa no HAVING.',
    tableSetup: [
      `CREATE TABLE atendimentos (
        id_atendimento INTEGER,
        ala TEXT,
        paciente TEXT,
        reinternacao_30d INTEGER,
        custo_internacao REAL
      );`,
      `INSERT INTO atendimentos VALUES
        (1, 'Cardiologia', 'Pac A', 1, 8000),
        (2, 'Cardiologia', 'Pac B', 0, 5000),
        (3, 'Cardiologia', 'Pac C', 1, 9200),
        (4, 'Cardiologia', 'Pac D', 0, 4500),
        (5, 'Ortopedia', 'Pac E', 0, 3200),
        (6, 'Ortopedia', 'Pac F', 0, 4100),
        (7, 'Ortopedia', 'Pac G', 1, 6000),
        (8, 'Ortopedia', 'Pac H', 0, 3800),
        (9, 'Pneumologia', 'Pac I', 1, 7000),
        (10, 'Pneumologia', 'Pac J', 1, 7500),
        (11, 'Pneumologia', 'Pac K', 0, 5200),
        (12, 'Neurologia', 'Pac L', 1, 12000),
        (13, 'Neurologia', 'Pac M', 1, 15000);`
    ],
    expectedOutput: [
      { ala: 'Pneumologia', total_casos: 3, total_reinternacoes: 2, taxa_pct: 66.7 },
      { ala: 'Cardiologia', total_casos: 4, total_reinternacoes: 2, taxa_pct: 50.0 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-i-4',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'CONCILIAÇÃO BANCÁRIA',
    challengeType: 'narrativa',
    businessContext: 'Marketplace MegaShop · Auditoria de Repasse de Gateways',
    title: 'Divergência entre Valor de Pedido e Liquidação do Gateway',
    description:
      'O time de Tesouraria da MegaShop precisa conciliar os pedidos aprovados na plataforma (`pedidos_loja`) com os repasses efetivamente liquidados pela adquirente de cartão (`repasses_gateway`). A taxa contratada da adquirente é de exatamente 5% sobre o `valor_pedido` (logo, o repasse esperado é `valor_pedido * 0.95`). Porém, para um mesmo pedido, o gateway pode ter feito múltiplos repasses parciais na tabela `repasses_gateway`. Identifique os pedidos onde a soma total liquidada pelo gateway (`SUM(valor_liquidado)`) foi MENOR do que o repasse esperado de 95% do pedido. Retorne `id_pedido`, `lojista`, `repasse_esperado` e `repasse_real`, ordenados pelo `id_pedido` crescente.',
    hint: 'Agrupe os repasses por pedido (ou faça o JOIN agrupando por id_pedido, lojista e valor_pedido) e compare a soma liquidada com valor_pedido * 0.95 no HAVING.',
    tableSetup: [
      `CREATE TABLE pedidos_loja (
        id_pedido TEXT,
        lojista TEXT,
        valor_pedido REAL
      );`,
      `CREATE TABLE repasses_gateway (
        id_repasse INTEGER,
        id_pedido TEXT,
        valor_liquidado REAL
      );`,
      `INSERT INTO pedidos_loja VALUES
        ('PED-100', 'TechStore', 1000.0),
        ('PED-200', 'CasaDecor', 2000.0),
        ('PED-300', 'EsporteMax', 3000.0),
        ('PED-400', 'ModaSul', 1500.0);`,
      `INSERT INTO repasses_gateway VALUES
        (1, 'PED-100', 500.0),
        (2, 'PED-100', 450.0),
        (3, 'PED-200', 1000.0),
        (4, 'PED-200', 780.0),
        (5, 'PED-300', 2850.0),
        (6, 'PED-400', 1350.0);`
    ],
    expectedOutput: [
      { id_pedido: 'PED-200', lojista: 'CasaDecor', repasse_esperado: 1900, repasse_real: 1780 },
      { id_pedido: 'PED-400', lojista: 'ModaSul', repasse_esperado: 1425, repasse_real: 1350 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-i-5',
    track: 'sql',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'ANÁLISE DE COORTE',
    challengeType: 'narrativa',
    businessContext: 'EdTech FuturoDev · Retenção e Engajamento de Alunos Bolsistas',
    title: 'Risco de Perda de Bolsa por Engajamento Inferior à Média da Turma',
    description:
      'A EdTech FuturoDev concede bolsas de estudo patrocinadas, mas exige que o bolsista mantenha uma nota prática acima da média geral de TODOS os alunos da sua respectiva turma. Na tabela `alunos_turma`, temos `nome_aluno`, `turma`, `bolsista` (1 para bolsista, 0 para pagante) e `nota_pratica`. Encontre todos os alunos bolsistas (`bolsista = 1`) cuja `nota_pratica` está estritamente abaixo da média da sua própria `turma` (calculada incluindo bolsistas e pagantes daquela turma). Retorne `nome_aluno`, `turma` e `nota_pratica`, ordenados pela `nota_pratica` crescente.',
    hint: 'Use uma subquery correlacionada (ou CTE com média por turma) para comparar a nota do aluno bolsista com a AVG(nota_pratica) da mesma turma.',
    tableSetup: [
      `CREATE TABLE alunos_turma (
        id_aluno INTEGER,
        nome_aluno TEXT,
        turma TEXT,
        bolsista INTEGER,
        nota_pratica REAL
      );`,
      `INSERT INTO alunos_turma VALUES
        (1, 'Lucas Moura', 'Dados-T1', 1, 6.8),
        (2, 'Mariana Silva', 'Dados-T1', 0, 8.2),
        (3, 'Pedro Rocha', 'Dados-T1', 1, 9.0),
        (4, 'Carla Dias', 'Dados-T1', 0, 8.0),
        (5, 'Rafael Nunes', 'Cloud-T2', 1, 5.5),
        (6, 'Beatriz Melo', 'Cloud-T2', 0, 7.5),
        (7, 'Thiago Neves', 'Cloud-T2', 1, 6.2),
        (8, 'Amanda Luz', 'Cloud-T2', 0, 8.8);`
    ],
    expectedOutput: [
      { nome_aluno: 'Rafael Nunes', turma: 'Cloud-T2', nota_pratica: 5.5 },
      { nome_aluno: 'Thiago Neves', turma: 'Cloud-T2', nota_pratica: 6.2 },
      { nome_aluno: 'Lucas Moura', turma: 'Dados-T1', nota_pratica: 6.8 }
    ],
    orderSensitive: true
  },

  // ============================================================================
  // SQL — NÍVEL AVANÇADO (EXPERT) — NARRATIVAS DESAFIADORAS
  // ============================================================================
  {
    id: 'sql-narr-a-1',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'WINDOW FUNCTIONS & CHURN',
    challengeType: 'narrativa',
    businessContext: 'Fintech CrediCorp · Detecção de Deterioração Acelerada de Crédito',
    title: 'Queda Consecutiva de Faturamento Antes do Default',
    description:
      'O modelo preditivo de risco corporativo da CrediCorp aponta que empresas que sofrem queda de faturamento superior a 20% em relação ao mês imediatamente anterior entram em zona de alerta vermelho. A tabela `historico_faturamento` registra o faturamento mensal (`faturamento`) de cada `empresa` ordenado pelo `mes_ref` (ex: 1, 2, 3). Utilizando funções de janela, identifique os registros em que o `faturamento` do mês atual caiu mais de 20% em relação ao mês anterior da mesma empresa (ou seja, `faturamento < faturamento_anterior * 0.80`). Retorne `empresa`, `mes_ref`, `faturamento_anterior` e `faturamento` (atual), ordenados por `empresa` e `mes_ref`.',
    hint: 'Crie uma CTE com LAG(faturamento) OVER (PARTITION BY empresa ORDER BY mes_ref) para obter o faturamento_anterior e filtre na consulta externa.',
    tableSetup: [
      `CREATE TABLE historico_faturamento (
        empresa TEXT,
        mes_ref INTEGER,
        faturamento REAL
      );`,
      `INSERT INTO historico_faturamento VALUES
        ('Construtora Vortex', 1, 500000),
        ('Construtora Vortex', 2, 460000),
        ('Construtora Vortex', 3, 320000),
        ('Textil Aurora', 1, 200000),
        ('Textil Aurora', 2, 150000),
        ('Textil Aurora', 3, 145000),
        ('Logistica Atlas', 1, 300000),
        ('Logistica Atlas', 2, 310000),
        ('Logistica Atlas', 3, 290000);`
    ],
    expectedOutput: [
      { empresa: 'Construtora Vortex', mes_ref: 3, faturamento_anterior: 460000, faturamento: 320000 },
      { empresa: 'Textil Aurora', mes_ref: 2, faturamento_anterior: 200000, faturamento: 150000 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-a-2',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'PARETO & ACUMULADO',
    challengeType: 'narrativa',
    businessContext: 'Indústria Farmacêutica BioGen · Curva ABC e Concentração de Receita',
    title: 'Classificação Dinâmica de Clientes Classe A (Até 70% da Receita Acumulada)',
    description:
      'O conselho de administração da BioGen quer saber quais distribuidores compõem o núcleo vital da receita. Dada a tabela `receita_distribuidores`, ordene os distribuidores do maior `faturamento_anual` para o menor e calcule o percentual acumulado (`pct_acumulado`) que cada distribuidor representa frente à soma total da empresa (`SUM(faturamento_anual) OVER (ORDER BY faturamento_anual DESC) * 100.0 / SUM(faturamento_anual) OVER ()`). Retorne `distribuidor`, `faturamento_anual` e o `pct_acumulado` arredondado em 1 casa decimal apenas para os distribuidores cujo percentual acumulado seja menor ou igual a 75.0%, ordenados pelo `faturamento_anual` decrescente.',
    hint: 'Calcule a soma acumulada ordenada decrescentemente dividida pela soma total global dentro de uma CTE e depois filtre onde o percentual acumulado <= 75.0.',
    tableSetup: [
      `CREATE TABLE receita_distribuidores (
        distribuidor TEXT,
        faturamento_anual REAL
      );`,
      `INSERT INTO receita_distribuidores VALUES
        ('MedSul Distribuidora', 450000),
        ('FarmaNorte Log', 270000),
        ('BioCentro Hospitalar', 180000),
        ('Rede Saude Total', 60000),
        ('Clinica Express', 40000);`
    ],
    expectedOutput: [
      { distribuidor: 'MedSul Distribuidora', faturamento_anual: 450000, pct_acumulado: 45.0 },
      { distribuidor: 'FarmaNorte Log', faturamento_anual: 270000, pct_acumulado: 72.0 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-a-3',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'RANKING PARTICIONADO',
    challengeType: 'narrativa',
    businessContext: 'Companhia Aérea AeroBrasil · Otimização de Malha e Rentabilidade',
    title: 'As 2 Rotas Mais Lucrativas de Cada Hub Aeroportuário',
    description:
      'A diretoria de Planejamento de Malha da AeroBrasil precisa cortar voos deficitários e dobrar a frequência apenas nas 2 rotas mais lucrativas de cada aeroporto de origem (`hub_origem`). Na tabela `voos_operados`, cada voo possui `receita_passageiros`, `receita_carga` e `custo_combustivel`, além do status (`Cancelado` ou `Realizado`). Considere apenas voos com status "Realizado", calcule o lucro consolidado por `hub_origem` e `rota` (`SUM(receita_passageiros + receita_carga - custo_combustivel)` como `lucro_rota`) e retorne apenas o Top 2 de cada `hub_origem` (posições 1 e 2 no ranking decrescente de lucro dentro do hub). Retorne `hub_origem`, `rota`, `lucro_rota` e `posicao`, ordenados por `hub_origem` crescente e `posicao` crescente.',
    hint: 'Primeiro agregue o lucro dos voos realizados por hub_origem e rota em uma CTE; em seguida aplique RANK() ou ROW_NUMBER() particionado por hub_origem e filtre posicao <= 2.',
    tableSetup: [
      `CREATE TABLE voos_operados (
        id_voo INTEGER,
        hub_origem TEXT,
        rota TEXT,
        receita_passageiros REAL,
        receita_carga REAL,
        custo_combustivel REAL,
        status TEXT
      );`,
      `INSERT INTO voos_operados VALUES
        (1, 'GRU', 'GRU-MIA', 180000, 40000, 90000, 'Realizado'),
        (2, 'GRU', 'GRU-LIS', 160000, 30000, 80000, 'Realizado'),
        (3, 'GRU', 'GRU-SCL', 95000, 15000, 45000, 'Realizado'),
        (4, 'GRU', 'GRU-JFK', 250000, 50000, 90000, 'Cancelado'),
        (5, 'VCP', 'VCP-ORY', 150000, 35000, 75000, 'Realizado'),
        (6, 'VCP', 'VCP-MCO', 140000, 20000, 65000, 'Realizado'),
        (7, 'VCP', 'VCP-SSA', 70000, 10000, 35000, 'Realizado');`
    ],
    expectedOutput: [
      { hub_origem: 'GRU', rota: 'GRU-MIA', lucro_rota: 130000, posicao: 1 },
      { hub_origem: 'GRU', rota: 'GRU-LIS', lucro_rota: 110000, posicao: 2 },
      { hub_origem: 'VCP', rota: 'VCP-ORY', lucro_rota: 110000, posicao: 1 },
      { hub_origem: 'VCP', rota: 'VCP-MCO', lucro_rota: 95000, posicao: 2 }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-a-4',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'DETECÇÃO DE ANOMALIAS',
    challengeType: 'narrativa',
    businessContext: 'Seguradora PortoSeguro Saúde · Auditoria Anti-Fraude de Sinistros',
    title: 'Clínicas com Sinistros Acima do Dobro da Média da Especialidade',
    description:
      'A unidade de Inteligência de Sinistros investiga clínicas credenciadas que cobram valores sistematicamente inflados em relação aos pares da mesma especialidade médica. Na tabela `sinistros_medicos`, temos `clinica`, `especialidade` e `valor_sinistro`. Primeiro, calcule o ticket médio de cada clínica dentro da sua especialidade (`media_clinica`) e compare com a média geral de todos os sinistros daquela `especialidade` (`media_especialidade`). Identifique as clínicas cujo `media_clinica` seja estritamente maior que o DOBRO da `media_especialidade` (`media_clinica > media_especialidade * 2`). Retorne `clinica`, `especialidade`, `media_clinica` e `media_especialidade`, ordenados por `media_clinica` decrescente.',
    hint: 'Use CTEs separadas: uma para a média por (clinica, especialidade) e outra para a média global por especialidade, juntando-as pela especialidade.',
    tableSetup: [
      `CREATE TABLE sinistros_medicos (
        id_sinistro INTEGER,
        clinica TEXT,
        especialidade TEXT,
        valor_sinistro REAL
      );`,
      `INSERT INTO sinistros_medicos VALUES
        (1, 'Clinica VisionMax', 'Oftalmologia', 4500),
        (2, 'Clinica VisionMax', 'Oftalmologia', 5500),
        (3, 'Centro Ocular Sul', 'Oftalmologia', 1000),
        (4, 'Instituto da Visao', 'Oftalmologia', 1000),
        (5, 'Hospital Olhos SP', 'Oftalmologia', 500),
        (6, 'OrtoPlus Center', 'Ortopedia', 2000),
        (7, 'OrtoPlus Center', 'Ortopedia', 2200),
        (8, 'TraumaCare', 'Ortopedia', 1900),
        (9, 'VidaOrto', 'Ortopedia', 1900);`
    ],
    expectedOutput: [
      {
        clinica: 'Clinica VisionMax',
        especialidade: 'Oftalmologia',
        media_clinica: 5000,
        media_especialidade: 2500
      }
    ],
    orderSensitive: true
  },
  {
    id: 'sql-narr-a-5',
    track: 'sql',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'RETENÇÃO & RECORRÊNCIA',
    challengeType: 'narrativa',
    businessContext: 'Streaming PlayFlix · Identificação de Usuários Power-Users Contínuos',
    title: 'Sequência Ininterrupta de Assinatura nos 3 Meses do Trimestre',
    description:
      'O time de Growth da PlayFlix vai premiar apenas os assinantes que mantiveram pagamentos aprovados (`status_pgto = "Aprovado"`) em TODOS os 3 meses do primeiro trimestre (`mes` 1, 2 e 3) e cujo gasto acumulado nesses 3 meses tenha superado R$ 120,00. Atenção: alguns usuários pagaram duas vezes no mesmo mês (compra de tela extra), portanto contar apenas 3 registros na tabela não garante que o usuário esteve ativo nos 3 meses distintos! Retorne `usuario`, a quantidade de meses distintos pagos (`meses_ativos`, que deve ser 3) e o `gasto_trimestre`, ordenados pelo `gasto_trimestre` decrescente.',
    hint: 'Filtre apenas pagamentos aprovados nos meses 1, 2 e 3, agrupe por usuario e use COUNT(DISTINCT mes) = 3 combinado com SUM(valor_pago) > 120 no HAVING.',
    tableSetup: [
      `CREATE TABLE pagamentos_streaming (
        id_pgto INTEGER,
        usuario TEXT,
        mes INTEGER,
        valor_pago REAL,
        status_pgto TEXT
      );`,
      `INSERT INTO pagamentos_streaming VALUES
        (1, 'ana.julia', 1, 49.90, 'Aprovado'),
        (2, 'ana.julia', 2, 49.90, 'Aprovado'),
        (3, 'ana.julia', 3, 49.90, 'Aprovado'),
        (4, 'carlos.lima', 1, 59.90, 'Aprovado'),
        (5, 'carlos.lima', 1, 30.00, 'Aprovado'),
        (6, 'carlos.lima', 2, 59.90, 'Aprovado'),
        (7, 'carlos.lima', 3, 59.90, 'Recusado'),
        (8, 'marcos.vinicius', 1, 60.00, 'Aprovado'),
        (9, 'marcos.vinicius', 2, 60.00, 'Aprovado'),
        (10, 'marcos.vinicius', 3, 60.00, 'Aprovado'),
        (11, 'leticia.souza', 1, 35.00, 'Aprovado'),
        (12, 'leticia.souza', 2, 35.00, 'Aprovado'),
        (13, 'leticia.souza', 3, 35.00, 'Aprovado');`
    ],
    expectedOutput: [
      { usuario: 'marcos.vinicius', meses_ativos: 3, gasto_trimestre: 180.0 },
      { usuario: 'ana.julia', meses_ativos: 3, gasto_trimestre: 149.7 }
    ],
    orderSensitive: true
  },

  // ============================================================================
  // EXCEL — NÍVEL BÁSICO, INTERMEDIÁRIO E AVANÇADO — NARRATIVAS DESAFIADORAS
  // ============================================================================
  {
    id: 'excel-narr-b-1',
    track: 'excel',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'AUDITORIA FINANCEIRA',
    challengeType: 'narrativa',
    businessContext: 'Fintech CrediMais · Cálculo de Receita Líquida de Antecipação',
    title: 'Liquidação de Recebíveis após Taxa de Antecipação',
    description:
      'Na mesa de operações da CrediMais, cada contrato de antecipação possui o valor bruto na Coluna B (`valor_bruto`) e o desconto de IOF/Taxa na Coluna C (`desconto_taxa`). A controladoria precisa da soma total líquida desembolsada pela mesa, mas você deve calcular diretamente a coluna resultante do valor líquido de cada linha (`B - C`). Escreva a fórmula Excel que subtrai a coluna C da coluna B para todos os contratos.',
    hint: 'Subtraia diretamente a referência da coluna C da coluna B iniciando com o sinal de igual.',
    tableSetup: [
      `CREATE TABLE recebiveis (contrato TEXT, valor_bruto REAL, desconto_taxa REAL);`,
      `INSERT INTO recebiveis VALUES
        ('CTR-01', 15000, 1200),
        ('CTR-02', 28000, 2500),
        ('CTR-03', 9500, 500);`
    ],
    expectedOutput: [{ liq: 13800 }, { liq: 25500 }, { liq: 9000 }]
  },
  {
    id: 'excel-narr-b-2',
    track: 'excel',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'HIGIENIZAÇÃO DE DADOS',
    challengeType: 'narrativa',
    businessContext: 'Logística ViaExpress · Padronização de Códigos de Rastreio',
    title: 'Extração de Prefixo de Galpão Regional em Etiquetas Ópticas',
    description:
      'Os leitores ópticos dos centros de distribuição da ViaExpress geram etiquetas na Coluna A (`etiqueta`) no formato "GLP4-SP-99812", onde os 4 primeiros caracteres identificam o código do galpão logístico. Para rotear as cargas automaticamente no painel, escreva a fórmula Excel que extrai exatamente os 4 primeiros caracteres de cada etiqueta da Coluna A.',
    hint: 'Utilize a função de extração de caracteres à esquerda referenciando a Coluna A.',
    tableSetup: [
      `CREATE TABLE etiquetas_log (etiqueta TEXT, peso REAL);`,
      `INSERT INTO etiquetas_log VALUES
        ('GLP1-SP-88210', 12.5),
        ('GLP9-PR-11402', 8.0),
        ('GLP4-MG-55390', 21.0);`
    ],
    expectedOutput: [{ galpao: 'GLP1' }, { galpao: 'GLP9' }, { galpao: 'GLP4' }]
  },
  {
    id: 'excel-narr-b-3',
    track: 'excel',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'COMPLIANCE FISCAL',
    challengeType: 'narrativa',
    businessContext: 'Contabilidade FiscalPro · Saneamento de Chaves de Notas Fiscais',
    title: 'Normalização de Protocolos Importados do Sistema Legado',
    description:
      'Ao importar os protocolos de notas fiscais do sistema mainframe antigo na Coluna A (`protocolo`), vários registros vieram com espaços em branco acidentais no início e no final do código, travando o validador da Receita Estadual. Escreva a fórmula Excel para higienizar a Coluna A removendo todos os espaços excedentes nas extremidades.',
    hint: 'Use a função de limpeza de espaços da família Texto do Excel sobre a Coluna A.',
    tableSetup: [
      `CREATE TABLE protocolos_nfe (protocolo TEXT);`,
      `INSERT INTO protocolos_nfe VALUES
        ('  NFE-2026-0091 '),
        ('NFE-2026-0092   '),
        ('   NFE-2026-0093');`
    ],
    expectedOutput: [
      { limpo: 'NFE-2026-0091' },
      { limpo: 'NFE-2026-0092' },
      { limpo: 'NFE-2026-0093' }
    ]
  },
  {
    id: 'excel-narr-b-4',
    track: 'excel',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'CRÉDITO & COBRANÇA',
    challengeType: 'narrativa',
    businessContext: 'Banco Vanguarda · Triagem Automática de Limite de Cheque Especial',
    title: 'Bloqueio Preventivo por Comprometimento de Renda',
    description:
      'Na análise diária de risco da carteira de varejo, a Coluna B (`comprometimento_pct`) mostra o percentual da renda mensal do cliente comprometido com dívidas. A política de crédito determina que se o valor na Coluna B for estritamente maior que 40, o status deve ser `"Bloqueado"`; caso contrário, `"Liberado"`. Construa a fórmula condicional no Excel para classificar cada cliente.',
    hint: 'Utilize a função condicional testando se a coluna B supera 40.',
    tableSetup: [
      `CREATE TABLE carteira_varejo (cliente TEXT, comprometimento_pct REAL);`,
      `INSERT INTO carteira_varejo VALUES
        ('Cliente Alpha', 48.5),
        ('Cliente Beta', 32.0),
        ('Cliente Gama', 40.0),
        ('Cliente Delta', 61.2);`
    ],
    expectedOutput: [
      { status: 'Bloqueado' },
      { status: 'Liberado' },
      { status: 'Liberado' },
      { status: 'Bloqueado' }
    ]
  },
  {
    id: 'excel-narr-b-5',
    track: 'excel',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'OPERACIONALCALL CENTER',
    challengeType: 'narrativa',
    businessContext: 'Telecom Conecta · Auditoria de Tempo Médio de Atendimento (TMA)',
    title: 'Teto Máximo de Espera em Fila de Retenção',
    description:
      'A Agência Nacional de Telecomunicações exigiu da Conecta o valor do maior tempo de espera (em segundos) registrado hoje na fila crítica de cancelamento, localizada na Coluna C (`segundos_espera`). Escreva a fórmula Excel que retorna o valor máximo extremo registrado na Coluna C.',
    hint: 'Aplique a função estatística de valor máximo sobre a Coluna C.',
    tableSetup: [
      `CREATE TABLE fila_retencao (protocolo TEXT, atendente TEXT, segundos_espera INTEGER);`,
      `INSERT INTO fila_retencao VALUES
        ('P-01', 'Julia', 145),
        ('P-02', 'Marcos', 412),
        ('P-03', 'Carla', 289),
        ('P-04', 'Pedro', 190);`
    ],
    expectedOutput: [{ max_espera: 412 }]
  },
  {
    id: 'excel-narr-i-1',
    track: 'excel',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'SOMA CONDICIONAL',
    challengeType: 'narrativa',
    businessContext: 'Seguradora Atlântica · Reserva Técnica para Sinistros Judiciais',
    title: 'Provisionamento Exclusivo da Carteira de Risco "Alto"',
    description:
      'O departamento atuarial da Seguradora Atlântica precisa provisionar no balanço apenas o montante financeiro dos processos classificados como `"Alto"` risco na Coluna B (`grau_risco`), somando os respectivos valores de indenização estimada na Coluna C (`valor_causa`). Construa a fórmula Excel de soma condicional para apurar essa reserva.',
    hint: 'Use SOMASE informando o intervalo de critério (Coluna B), o critério "Alto" e o intervalo de soma (Coluna C).',
    tableSetup: [
      `CREATE TABLE processos_atuariais (processo TEXT, grau_risco TEXT, valor_causa REAL);`,
      `INSERT INTO processos_atuariais VALUES
        ('PROC-10', 'Alto', 85000),
        ('PROC-11', 'Medio', 30000),
        ('PROC-12', 'Alto', 115000),
        ('PROC-13', 'Baixo', 12000),
        ('PROC-14', 'Alto', 50000);`
    ],
    expectedOutput: [{ total: 250000 }]
  },
  {
    id: 'excel-narr-i-2',
    track: 'excel',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'CONTAGEM MULTICRITÉRIO',
    challengeType: 'narrativa',
    businessContext: 'Hospital Sírio-Paulista · Auditoria de Triagem de Emergência',
    title: 'Pacientes em Protocolo Vermelho Acima de 65 Anos',
    description:
      'A coordenação da UTI precisa contar imediatamente quantos pacientes deram entrada no pronto-socorro com classificação `"Vermelho"` na Coluna B (`protocolo_manchester`) E que possuem idade superior ou igual a 65 anos na Coluna C (`idade`). Escreva a fórmula Excel de contagem multicritério.',
    hint: 'Utilize CONT.SES combinando o critério da Coluna B ("Vermelho") e o operador ">=65" na Coluna C.',
    tableSetup: [
      `CREATE TABLE pronto_socorro (paciente TEXT, protocolo_manchester TEXT, idade INTEGER);`,
      `INSERT INTO pronto_socorro VALUES
        ('Pac 1', 'Vermelho', 72),
        ('Pac 2', 'Amarelo', 68),
        ('Pac 3', 'Vermelho', 54),
        ('Pac 4', 'Vermelho', 65),
        ('Pac 5', 'Vermelho', 81);`
    ],
    expectedOutput: [{ total: 3 }]
  },
  {
    id: 'excel-narr-i-3',
    track: 'excel',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'LÓGICA COMPOSTA',
    challengeType: 'narrativa',
    businessContext: 'AgroTech TerraForte · Aprovação de Crédito Rural Safra',
    title: 'Elegibilidade Simultânea por Área Plantada e Score Ambiental',
    description:
      'Para liberar o financiamento subsidiado da Safra, o produtor rural deve cumprir DUAS exigências simultâneas: ter área produtiva na Coluna B (`hectares`) maior ou igual a 50 E possuir índice de conformidade ambiental na Coluna C (`score_car`) maior ou igual a 80. Caso atenda a ambas, retorne `"Elegivel"`; caso contrário, `"Reprovado"`. Escreva a fórmula Excel combinando lógica condicional e conjunção.',
    hint: 'Combine SE com a função lógica E(B:B>=50; C:C>=80).',
    tableSetup: [
      `CREATE TABLE credito_rural (produtor TEXT, hectares INTEGER, score_car INTEGER);`,
      `INSERT INTO credito_rural VALUES
        ('Fazenda Boa Vista', 120, 85),
        ('Sitio Sao Jose', 40, 92),
        ('Agropecuaria Sul', 80, 74),
        ('Estancia Verde', 50, 80);`
    ],
    expectedOutput: [
      { res: 'Elegivel' },
      { res: 'Reprovado' },
      { res: 'Reprovado' },
      { res: 'Elegivel' }
    ]
  },
  {
    id: 'excel-narr-i-4',
    track: 'excel',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'ENGENHARIA DE TEXTO',
    challengeType: 'narrativa',
    businessContext: 'Indústria Automotiva AutoParts · Rastreabilidade de Chassi',
    title: 'Isolamento do Código da Planta Industrial no Número de Série',
    description:
      'Todo código de peça da AutoParts na Coluna A (`num_serie`) segue a estrutura rígida "BR-SBC-2026-991", onde os 3 caracteres a partir da posição 4 representam a planta industrial (ex: "SBC", "CWB", "POA"). Escreva a fórmula Excel que extrai exatamente esses 3 caracteres centrais da Coluna A.',
    hint: 'Utilize a função de extração de texto intermediário informando posição inicial 4 e tamanho 3.',
    tableSetup: [
      `CREATE TABLE pecas_chassi (num_serie TEXT);`,
      `INSERT INTO pecas_chassi VALUES
        ('BR-SBC-2026-101'),
        ('BR-CWB-2026-205'),
        ('BR-POA-2026-309');`
    ],
    expectedOutput: [{ planta: 'SBC' }, { planta: 'CWB' }, { planta: 'POA' }]
  },
  {
    id: 'excel-narr-i-5',
    track: 'excel',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'TRATAMENTO DE NULOS',
    challengeType: 'narrativa',
    businessContext: 'Varejo Omnichannel ModaJá · Cálculo de Ticket com Cupom Opcional',
    title: 'Blindagem de Fórmula Contra Campos de Desconto Vazios',
    description:
      'Na planilha de faturamento da ModaJá, a Coluna B contém o `valor_pedido` e a Coluna C contém o `cupom_desconto` (que está nulo/vazio na maioria das vendas sem promoção). Para evitar erros ao consolidar o faturamento, escreva uma fórmula Excel que utilize `SEERRO` na Coluna C (assumindo `0` quando vazia/nula) ou calcule o desconto seguro de cada linha.',
    hint: 'Utilize =SEERRO(C:C; 0) para transformar os nulos da Coluna C em 0.',
    tableSetup: [
      `CREATE TABLE vendas_modaja (pedido TEXT, valor_pedido REAL, cupom_desconto REAL);`,
      `INSERT INTO vendas_modaja VALUES
        ('P-100', 250.0, 30.0),
        ('P-101', 180.0, NULL),
        ('P-102', 420.0, 50.0),
        ('P-103', 99.0, NULL);`
    ],
    expectedOutput: [{ desc_seguro: 30 }, { desc_seguro: 0 }, { desc_seguro: 50 }, { desc_seguro: 0 }]
  },
  {
    id: 'excel-narr-a-1',
    track: 'excel',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'SOMAS MULTICRITÉRIO',
    challengeType: 'narrativa',
    businessContext: 'Multinacional PharmaCorp · Auditoria de Bônus da Força de Vendas',
    title: 'Faturamento Elegível de Representantes Sênior na Região Sudeste',
    description:
      'O comitê de remuneração variável da PharmaCorp só paga bônus extraordinário sobre vendas que cumpram cumulativamente dois requisitos: terem sido realizadas na regional `"Sudeste"` (Coluna B, `regional`) E cujo canal de venda na Coluna C (`canal`) seja `"Hospitalar"`. O faturamento de cada contrato está na Coluna D (`faturamento`). Escreva a fórmula Excel `SOMASES` para retornar o volume total elegível.',
    hint: 'Em SOMASES, o primeiro argumento é a coluna de soma (D:D), seguido pelos pares de coluna de critério e valor do critério.',
    tableSetup: [
      `CREATE TABLE vendas_pharma (rep TEXT, regional TEXT, canal TEXT, faturamento REAL);`,
      `INSERT INTO vendas_pharma VALUES
        ('Rep 1', 'Sudeste', 'Hospitalar', 140000),
        ('Rep 2', 'Sudeste', 'Varejo', 95000),
        ('Rep 3', 'Sul', 'Hospitalar', 110000),
        ('Rep 4', 'Sudeste', 'Hospitalar', 185000),
        ('Rep 5', 'Nordeste', 'Hospitalar', 75000);`
    ],
    expectedOutput: [{ total: 325000 }]
  },
  {
    id: 'excel-narr-a-2',
    track: 'excel',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'CLASSIFICAÇÃO EM CASCATA',
    challengeType: 'narrativa',
    businessContext: 'Gestora de Fundos AlphaQuant · Rating de Liquidez de Ativos',
    title: 'Classificação Tripla de Risco de Liquidez Diária',
    description:
      'Na mesa quantitativa da AlphaQuant, cada ativo possui seu volume diário negociado (em milhões) na Coluna B (`volume_mm`). A regra de rating exige três faixas: se `B >= 100`, classifique como `"Liquidez Alta"`; senão, se `B >= 30`, classifique como `"Liquidez Media"`; caso contrário, `"Liquidez Baixa"`. Construa a fórmula de `SE` aninhado para classificar toda a carteira.',
    hint: 'Aninhe um segundo SE dentro do terceiro argumento (SENÃO) do primeiro SE.',
    tableSetup: [
      `CREATE TABLE ativos_fundo (ticker TEXT, volume_mm REAL);`,
      `INSERT INTO ativos_fundo VALUES
        ('VALE3', 145.0),
        ('SMAL11', 52.0),
        ('MICRO4', 12.5),
        ('PETR4', 100.0);`
    ],
    expectedOutput: [
      { rating: 'Liquidez Alta' },
      { rating: 'Liquidez Media' },
      { rating: 'Liquidez Baixa' },
      { rating: 'Liquidez Alta' }
    ]
  },
  {
    id: 'excel-narr-a-3',
    track: 'excel',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'MÉDIA MULTICRITÉRIO',
    challengeType: 'narrativa',
    businessContext: 'Rede de Energia EletroSul · Monitoramento de Subestações Críticas',
    title: 'Temperatura Média de Transformadores de Alta Tensão em Horário de Ponta',
    description:
      'A engenharia de manutenção da EletroSul precisa apurar a temperatura média (Coluna D, `temp_celsius`) exclusivamente dos transformadores do tipo `"Alta Tensao"` (Coluna B, `tipo_equipamento`) que operaram durante o turno `"Ponta"` (Coluna C, `turno`). Escreva a fórmula Excel `MÉDIASES` para calcular essa métrica exata.',
    hint: 'Em MÉDIASES, passe primeiro o intervalo da média (D:D) e em seguida os dois pares de intervalos e critérios (B:B e C:C).',
    tableSetup: [
      `CREATE TABLE telemetria_rede (subestacao TEXT, tipo_equipamento TEXT, turno TEXT, temp_celsius REAL);`,
      `INSERT INTO telemetria_rede VALUES
        ('SUB-01', 'Alta Tensao', 'Ponta', 84.0),
        ('SUB-02', 'Baixa Tensao', 'Ponta', 62.0),
        ('SUB-03', 'Alta Tensao', 'Fora Ponta', 70.0),
        ('SUB-04', 'Alta Tensao', 'Ponta', 92.0),
        ('SUB-05', 'Alta Tensao', 'Ponta', 88.0);`
    ],
    expectedOutput: [{ media: 88 }]
  },
  {
    id: 'excel-narr-a-4',
    track: 'excel',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'AUDITORIA DE VARIAÇÃO',
    challengeType: 'narrativa',
    businessContext: 'Tesouraria Corporativa GlobalFoods · Controle de Desvio Orçamentário (OBZ)',
    title: 'Desvio Absoluto entre Orçado e Realizado nas Fábricas',
    description:
      'No fechamento do Orçamento Base Zero (OBZ), desvios para mais ou para menos em relação à meta são igualmente penalizados pelo comitê de eficiência. Dada a despesa orçada na Coluna B (`orcado`) e a despesa realizada na Coluna C (`realizado`), escreva a fórmula Excel que retorna o desvio absoluto (`ABS(C:C - B:B)`) de cada planta fabril.',
    hint: 'Envolva a subtração entre realizado e orçado dentro da função matemática de valor absoluto.',
    tableSetup: [
      `CREATE TABLE obz_fabricas (planta TEXT, orcado REAL, realizado REAL);`,
      `INSERT INTO obz_fabricas VALUES
        ('Planta Campinas', 500000, 545000),
        ('Planta Joinville', 320000, 290000),
        ('Planta Recife', 410000, 410000);`
    ],
    expectedOutput: [{ desvio_abs: 45000 }, { desvio_abs: 30000 }, { desvio_abs: 0 }]
  },
  {
    id: 'excel-narr-a-5',
    track: 'excel',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'HIGIENIZAÇÃO AVANÇADA',
    challengeType: 'narrativa',
    businessContext: 'Fintech OpenBank · Padronização de Chaves PIX Internacionais',
    title: 'Saneamento e Padronização em Caixa Alta de Identificadores SWIFT',
    description:
      'Os códigos bancários internacionais na Coluna A (`codigo_swift`) vieram com letras minúsculas e espaços laterais sujos. O motor de mensageria BACEN exige que o código esteja simultaneamente sem espaços nas bordas E inteiramente em letras maiúsculas. Combine as duas funções do Excel em uma única fórmula aninhada sobre a Coluna A.',
    hint: 'Aninhe ARRUMAR(A:A) dentro de MAIÚSCULA(...) ou vice-versa.',
    tableSetup: [
      `CREATE TABLE swift_codes (codigo_swift TEXT);`,
      `INSERT INTO swift_codes VALUES
        ('  brspbrcf '),
        (' itaubrsp   '),
        ('   bbasbrrj ');`
    ],
    expectedOutput: [
      { swift_ok: 'BRSPBRCF' },
      { swift_ok: 'ITAUBRSP' },
      { swift_ok: 'BBASBRRJ' }
    ]
  },

  // ============================================================================
  // PYTHON (PANDAS) — NÍVEL BÁSICO, INTERMEDIÁRIO E AVANÇADO — NARRATIVAS DESAFIADORAS
  // ============================================================================
  {
    id: 'py-narr-b-1',
    track: 'python',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'ENGENHARIA DE DADOS',
    challengeType: 'narrativa',
    businessContext: 'Fintech CreditoJusto · Triagem de Propostas de Empréstimo Pessoal',
    title: 'Filtro Composto de Risco de Inadimplência no DataFrame',
    description:
      'O pipeline de crédito carregou as propostas do dia no DataFrame `df`. A política de aprovação automática exige filtrar apenas os proponentes cujo `score` seja estritamente maior que 700 E cuja `renda_mensal` seja maior ou igual a 5000. Escreva a expressão Pandas (usando indexação booleana ou `.query()`) que retorna os registros aprovados.',
    hint: 'Em Pandas, ao combinar duas condições com & dentro de df[...], envolva cada condição entre parênteses ou use df.query().',
    tableSetup: [
      `CREATE TABLE df (proponente TEXT, score INTEGER, renda_mensal REAL);`,
      `INSERT INTO df VALUES
        ('Ana Paula', 780, 6200),
        ('Carlos Eduardo', 690, 8000),
        ('Marcos Vinicius', 740, 4300),
        ('Juliana Mendes', 815, 5000);`
    ],
    expectedOutput: [
      { proponente: 'Ana Paula', score: 780, renda_mensal: 6200 },
      { proponente: 'Juliana Mendes', score: 815, renda_mensal: 5000 }
    ]
  },
  {
    id: 'py-narr-b-2',
    track: 'python',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'MONITORAMENTO DE INFRA',
    challengeType: 'narrativa',
    businessContext: 'CloudOps DataCenter · Triagem de Servidores Sobrecarregados',
    title: 'Os 3 Clusters com Maior Consumo de Memória RAM',
    description:
      'Durante um pico de tráfego na Black Friday, o time de SRE precisa identificar imediatamente os 3 servidores do DataFrame `df` que apresentam o maior percentual na coluna `uso_ram_pct`, ordenados do maior para o menor. Escreva a expressão Pandas que retorna exatamente esses 3 registros críticos.',
    hint: 'Você pode usar df.nlargest(3, "uso_ram_pct") ou ordenar decrescentemente por uso_ram_pct seguido de .head(3).',
    tableSetup: [
      `CREATE TABLE df (servidor TEXT, uso_ram_pct REAL, regiao TEXT);`,
      `INSERT INTO df VALUES
        ('srv-auth-01', 78.4, 'us-east'),
        ('srv-pay-02', 96.2, 'sa-east'),
        ('srv-db-01', 91.8, 'sa-east'),
        ('srv-cache-04', 64.0, 'us-west'),
        ('srv-search-03', 89.5, 'sa-east');`
    ],
    expectedOutput: [
      { servidor: 'srv-pay-02', uso_ram_pct: 96.2, regiao: 'sa-east' },
      { servidor: 'srv-db-01', uso_ram_pct: 91.8, regiao: 'sa-east' },
      { servidor: 'srv-search-03', uso_ram_pct: 89.5, regiao: 'sa-east' }
    ],
    orderSensitive: true
  },
  {
    id: 'py-narr-b-3',
    track: 'python',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'LOGÍSTICA REVERSA',
    challengeType: 'narrativa',
    businessContext: 'E-commerce EletroShop · Exclusão de Regiões com Bloqueio Sanitário',
    title: 'Roteamento Excluindo Estados com Malha Suspensa',
    description:
      'Devido a fortes chuvas e interdição de rodovias, os estados `"RS"` e `"SC"` estão temporariamente com expedição suspensa. A partir do DataFrame `df`, filtre todos os pedidos cuja coluna `uf` NÃO pertença à lista `["RS", "SC"]`.',
    hint: 'Use o operador de negação ~ combinado com .isin(["RS", "SC"]) sobre a coluna uf.',
    tableSetup: [
      `CREATE TABLE df (pedido TEXT, uf TEXT, valor REAL);`,
      `INSERT INTO df VALUES
        ('PED-01', 'SP', 450),
        ('PED-02', 'RS', 890),
        ('PED-03', 'PR', 320),
        ('PED-04', 'SC', 510),
        ('PED-05', 'MG', 670);`
    ],
    expectedOutput: [
      { pedido: 'PED-01', uf: 'SP', valor: 450 },
      { pedido: 'PED-03', uf: 'PR', valor: 320 },
      { pedido: 'PED-05', uf: 'MG', valor: 670 }
    ]
  },
  {
    id: 'py-narr-b-4',
    track: 'python',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'QUALIDADE DE DADOS',
    challengeType: 'narrativa',
    businessContext: 'Healthtech LabExame · Auditoria de Amostras sem Resultado Laboratorial',
    title: 'Identificação de Coletas Pendentes de Processamento (Valores Nulos)',
    description:
      'O laboratório central precisa listar apenas as coletas de sangue do DataFrame `df` que ainda não receberam laudo técnico — ou seja, onde a coluna `hemoglobina` está nula (`NaN` / `NULL`). Escreva a expressão Pandas que filtra apenas os registros com `hemoglobina` nula.',
    hint: 'Filtre o DataFrame usando o método booleano de detecção de nulos na coluna hemoglobina.',
    tableSetup: [
      `CREATE TABLE df (amostra TEXT, paciente TEXT, hemoglobina REAL);`,
      `INSERT INTO df VALUES
        ('AM-101', 'Roberto', 14.2),
        ('AM-102', 'Simone', NULL),
        ('AM-103', 'Fernando', 13.8),
        ('AM-104', 'Patricia', NULL);`
    ],
    expectedOutput: [
      { amostra: 'AM-102', paciente: 'Simone', hemoglobina: null },
      { amostra: 'AM-104', paciente: 'Patricia', hemoglobina: null }
    ]
  },
  {
    id: 'py-narr-b-5',
    track: 'python',
    rank: 'Junior',
    difficulty: 'Básico',
    category: 'SEGURANÇA DA INFORMAÇÃO',
    challengeType: 'narrativa',
    businessContext: 'CyberSec Corp · Caça a Credenciais Corporativas Vazadas',
    title: 'Detecção de Acessos de Domínio Administrativo nos Logs',
    description:
      'O time de Resposta a Incidentes está auditando o DataFrame `df` de tentativas de login e precisa isolar todos os registros em que a coluna `email` contenha a substring `"@admin.corp"`. Escreva a expressão Pandas para filtrar esses acessos privilegiados.',
    hint: 'Utilize o acessor de strings .str.contains() sobre a coluna email dentro do filtro do DataFrame.',
    tableSetup: [
      `CREATE TABLE df (ip TEXT, email TEXT, tentativas INTEGER);`,
      `INSERT INTO df VALUES
        ('10.0.0.12', 'root@admin.corp', 5),
        ('10.0.0.45', 'vendas@empresa.com', 1),
        ('10.0.0.88', 'secops@admin.corp', 12),
        ('10.0.0.99', 'suporte@clientes.org', 2);`
    ],
    expectedOutput: [
      { ip: '10.0.0.12', email: 'root@admin.corp', tentativas: 5 },
      { ip: '10.0.0.88', email: 'secops@admin.corp', tentativas: 12 }
    ]
  },
  {
    id: 'py-narr-i-1',
    track: 'python',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'AGREGAÇÃO DE NEGÓCIOS',
    challengeType: 'narrativa',
    businessContext: 'Rede de Franquias CaféBrasil · Fechamento de Royalties por Regional',
    title: 'Consolidação de Faturamento Total por Diretoria Regional',
    description:
      'A matriz da CaféBrasil precisa consolidar o faturamento bruto (`faturamento`) somado por cada `regional` no DataFrame `df`. Escreva a expressão Pandas com `groupby` que agrupa por `regional` e calcula a soma da coluna `faturamento`.',
    hint: 'Agrupe o DataFrame pela coluna regional, selecione a série faturamento e aplique a função de soma.',
    tableSetup: [
      `CREATE TABLE df (loja TEXT, regional TEXT, faturamento REAL);`,
      `INSERT INTO df VALUES
        ('Loja Paulista', 'Sudeste', 85000),
        ('Loja Savassi', 'Sudeste', 65000),
        ('Loja Batel', 'Sul', 72000),
        ('Loja Moinhos', 'Sul', 58000),
        ('Loja Boa Viagem', 'Nordeste', 91000);`
    ],
    expectedOutput: [
      { regional: 'Nordeste', faturamento: 91000 },
      { regional: 'Sudeste', faturamento: 150000 },
      { regional: 'Sul', faturamento: 130000 }
    ]
  },
  {
    id: 'py-narr-i-2',
    track: 'python',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'ANÁLISE DE FREQUÊNCIA',
    challengeType: 'narrativa',
    businessContext: 'Fintech PagRápido · Diagnóstico de Motivos de Recusa no Checkout',
    title: 'Distribuição de Frequência de Códigos de Erro de Cartão',
    description:
      'A taxa de conversão do checkout caiu 8% hoje. O gerente de produto quer ver a contagem de ocorrências de cada motivo de falha registrado na coluna `motivo_recusa` do DataFrame `df`, ordenada da falha mais frequente para a menos frequente. Escreva a expressão Pandas idiomática para gerar essa contagem.',
    hint: 'Aplique o método de contagem de valores únicos diretamente sobre a série motivo_recusa.',
    tableSetup: [
      `CREATE TABLE df (id_tx INTEGER, motivo_recusa TEXT);`,
      `INSERT INTO df VALUES
        (1, 'Saldo Insuficiente'),
        (2, 'Suspeita Fraude'),
        (3, 'Saldo Insuficiente'),
        (4, 'Cartao Vencido'),
        (5, 'Saldo Insuficiente'),
        (6, 'Suspeita Fraude');`
    ],
    expectedOutput: [
      { motivo_recusa: 'Saldo Insuficiente', count: 3 },
      { motivo_recusa: 'Suspeita Fraude', count: 2 },
      { motivo_recusa: 'Cartao Vencido', count: 1 }
    ],
    orderSensitive: true
  },
  {
    id: 'py-narr-i-3',
    track: 'python',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'AGRUPAMENTO MULTIDIMENSIONAL',
    challengeType: 'narrativa',
    businessContext: 'Seguradora AutoProtege · Sinistralidade Média por Estado e Categoria',
    title: 'Custo Médio de Reparo por UF e Categoria de Veículo',
    description:
      'O time de precificação da AutoProtege precisa recalibrar o prêmio do seguro analisando a média da coluna `custo_reparo` agrupada simultaneamente por `uf` e `categoria` no DataFrame `df`. Escreva a expressão Pandas que realiza esse agrupamento duplo e calcula a média.',
    hint: 'Passe a lista ["uf", "categoria"] para o método groupby(), selecione a coluna custo_reparo e calcule a média.',
    tableSetup: [
      `CREATE TABLE df (uf TEXT, categoria TEXT, custo_reparo REAL);`,
      `INSERT INTO df VALUES
        ('SP', 'SUV', 12000),
        ('SP', 'SUV', 16000),
        ('SP', 'Hatch', 6000),
        ('RJ', 'SUV', 18000),
        ('RJ', 'SUV', 14000);`
    ],
    expectedOutput: [
      { uf: 'RJ', categoria: 'SUV', custo_reparo: 16000 },
      { uf: 'SP', categoria: 'Hatch', custo_reparo: 6000 },
      { uf: 'SP', categoria: 'SUV', custo_reparo: 14000 }
    ]
  },
  {
    id: 'py-narr-i-4',
    track: 'python',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'DEDUPLICAÇÃO DE EVENTOS',
    challengeType: 'narrativa',
    businessContext: 'AdTech ClickStream · Auditoria de Cliques Duplicados por Bot',
    title: 'Expurgo de Eventos Idênticos de Telemetria Publicitária',
    description:
      'Uma falha no SDK mobile disparou eventos repetidos idênticos no DataFrame `df`, inflando o custo cobrado dos anunciantes. Remova todas as linhas duplicadas do DataFrame mantendo apenas registros únicos.',
    hint: 'Utilize o método nativo de remoção de duplicatas do DataFrame Pandas.',
    tableSetup: [
      `CREATE TABLE df (campanha TEXT, usuario_id TEXT, custo_clique REAL);`,
      `INSERT INTO df VALUES
        ('BlackFriday', 'U-10', 1.50),
        ('BlackFriday', 'U-10', 1.50),
        ('Natal2026', 'U-22', 2.10),
        ('BlackFriday', 'U-15', 1.50),
        ('Natal2026', 'U-22', 2.10);`
    ],
    expectedOutput: [
      { campanha: 'BlackFriday', usuario_id: 'U-10', custo_clique: 1.5 },
      { campanha: 'Natal2026', usuario_id: 'U-22', custo_clique: 2.1 },
      { campanha: 'BlackFriday', usuario_id: 'U-15', custo_clique: 1.5 }
    ]
  },
  {
    id: 'py-narr-i-5',
    track: 'python',
    rank: 'Analyst',
    difficulty: 'Intermediário',
    category: 'BENCHMARK DE FORNECEDORES',
    challengeType: 'narrativa',
    businessContext: 'Construtora Horizonte · Licitação de Insumos Estruturais',
    title: 'Seleção das 2 Propostas de Menor Custo por Tonelada de Aço',
    description:
      'No portal de compras da Construtora Horizonte, 5 siderúrgicas enviaram cotações no DataFrame `df`. O comitê de suprimentos precisa selecionar apenas as 2 propostas com o menor valor na coluna `preco_tonelada`, ordenadas da mais barata para a segunda mais barata.',
    hint: 'Utilize o método .nsmallest(2, "preco_tonelada") ou ordene de forma crescente com .head(2).',
    tableSetup: [
      `CREATE TABLE df (fornecedor TEXT, preco_tonelada REAL, prazo_dias INTEGER);`,
      `INSERT INTO df VALUES
        ('Siderurgica Nacional', 4850.0, 10),
        ('AcoMinas Forte', 4420.0, 12),
        ('MetalSul S.A.', 5100.0, 7),
        ('Usina Paulista', 4590.0, 9),
        ('FerroBras', 4900.0, 14);`
    ],
    expectedOutput: [
      { fornecedor: 'AcoMinas Forte', preco_tonelada: 4420, prazo_dias: 12 },
      { fornecedor: 'Usina Paulista', preco_tonelada: 4590, prazo_dias: 9 }
    ],
    orderSensitive: true
  },
  {
    id: 'py-narr-a-1',
    track: 'python',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'QUERY AVANÇADA PANDAS',
    challengeType: 'narrativa',
    businessContext: 'Hedge Fund QuantB3 · Filtragem Multifatorial de Ações Descontadas',
    title: 'Screening Quantitativo: Alto Dividend Yield, Baixo P/L e Liquidez',
    description:
      'O algoritmo de Value Investing da QuantB3 analisa o DataFrame `df` com indicadores fundamentalistas da bolsa. Selecione os ativos que atendam simultaneamente às três regras: `dividend_yield >= 8.0`, `pl <= 10.0` e `roe >= 15.0`. Utilize `.query()` ou indexação booleana composta para extrair os papéis escolhidos.',
    hint: 'Com df.query("dividend_yield >= 8.0 and pl <= 10.0 and roe >= 15.0") você expressa múltiplos filtros quantitativos com clareza.',
    tableSetup: [
      `CREATE TABLE df (ticker TEXT, dividend_yield REAL, pl REAL, roe REAL);`,
      `INSERT INTO df VALUES
        ('BBAS3', 9.5, 4.8, 21.0),
        ('WEGE3', 1.8, 32.0, 28.0),
        ('PETR4', 14.2, 3.9, 26.5),
        ('VALE3', 8.4, 6.2, 14.0),
        ('TAEE11', 10.1, 7.5, 18.2);`
    ],
    expectedOutput: [
      { ticker: 'BBAS3', dividend_yield: 9.5, pl: 4.8, roe: 21.0 },
      { ticker: 'PETR4', dividend_yield: 14.2, pl: 3.9, roe: 26.5 },
      { ticker: 'TAEE11', dividend_yield: 10.1, pl: 7.5, roe: 18.2 }
    ]
  },
  {
    id: 'py-narr-a-2',
    track: 'python',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'AUDITORIA DE RISCO',
    challengeType: 'narrativa',
    businessContext: 'CriptoExchange BitSafe · Detecção de Lavagem de Dinheiro (PLD/AML)',
    title: 'Carteiras Cripto em Faixa de Estruturação (Smurfing) entre US$ 9.000 e US$ 9.999',
    description:
      'Indivíduos que tentam burlar o reporte automático ao COAF costumam fracionar transferências logo abaixo do limite de US$ 10.000. No DataFrame `df`, isole todas as transferências cujo `valor_usd` esteja no intervalo fechado entre `9000` e `9999` usando o método de intervalo do Pandas.',
    hint: 'Utilize df[df["valor_usd"].between(9000, 9999)] para capturar exatamente a faixa de estruturação.',
    tableSetup: [
      `CREATE TABLE df (wallet TEXT, valor_usd REAL, rede TEXT);`,
      `INSERT INTO df VALUES
        ('0x99a1', 9850.0, 'ERC20'),
        ('0x44b2', 12500.0, 'TRC20'),
        ('0x77c3', 9120.0, 'ERC20'),
        ('0x11d4', 4500.0, 'BTC'),
        ('0x88e5', 9990.0, 'SOL');`
    ],
    expectedOutput: [
      { wallet: '0x99a1', valor_usd: 9850, rede: 'ERC20' },
      { wallet: '0x77c3', valor_usd: 9120, rede: 'ERC20' },
      { wallet: '0x88e5', valor_usd: 9990, rede: 'SOL' }
    ]
  },
  {
    id: 'py-narr-a-3',
    track: 'python',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'MÉTRICAS DE PRODUTO',
    challengeType: 'narrativa',
    businessContext: 'SuperApp UrbanoGo · Cardinalidade de Motoristas Ativos por Cidade',
    title: 'Contagem de Motoristas Únicos Distintos na Malha Metropolitana',
    description:
      'Na tabela de corridas `df`, um mesmo motorista realiza dezenas de viagens no dia. O diretor de operações não quer o total de corridas, mas sim o número exato de motoristas distintos (`id_motorista`) que operaram hoje. Escreva a expressão Pandas que retorna a contagem de valores únicos da coluna `id_motorista`.',
    hint: 'Use o método de contagem de elementos distintos (.nunique()) sobre a série id_motorista.',
    tableSetup: [
      `CREATE TABLE df (id_corrida INTEGER, id_motorista TEXT, valor REAL);`,
      `INSERT INTO df VALUES
        (1, 'MOT-01', 25.0),
        (2, 'MOT-02', 18.0),
        (3, 'MOT-01', 32.0),
        (4, 'MOT-03', 40.0),
        (5, 'MOT-02', 22.0),
        (6, 'MOT-04', 15.0);`
    ],
    expectedOutput: [{ res: 4 }]
  },
  {
    id: 'py-narr-a-4',
    track: 'python',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'TETO DE SINISTRALIDADE',
    challengeType: 'narrativa',
    businessContext: 'Resseguradora GlobalRe · Exposição Máxima por Ramo de Seguro',
    title: 'Maior Sinistro Individual Registrado em Cada Ramo Corporativo',
    description:
      'Para calibrar o contrato de excesso de danos (Stop Loss), os atuários da GlobalRe precisam saber qual foi o maior valor individual de indenização (`valor_indenizacao`) dentro de cada `ramo` no DataFrame `df`. Escreva a expressão Pandas com `groupby` que retorna o valor máximo de `valor_indenizacao` por `ramo`.',
    hint: 'Agrupe por "ramo", selecione a coluna "valor_indenizacao" e aplique .max().',
    tableSetup: [
      `CREATE TABLE df (apolice TEXT, ramo TEXT, valor_indenizacao REAL);`,
      `INSERT INTO df VALUES
        ('AP-01', 'Aeronautico', 4500000),
        ('AP-02', 'Aeronautico', 8200000),
        ('AP-03', 'Maritimo', 3100000),
        ('AP-04', 'Maritimo', 1900000),
        ('AP-05', 'Agricola', 950000);`
    ],
    expectedOutput: [
      { ramo: 'Aeronautico', valor_indenizacao: 8200000 },
      { ramo: 'Agricola', valor_indenizacao: 950000 },
      { ramo: 'Maritimo', valor_indenizacao: 3100000 }
    ]
  },
  {
    id: 'py-narr-a-5',
    track: 'python',
    rank: 'Expert',
    difficulty: 'Avançado',
    category: 'HIGIENIZAÇÃO DE PIPELINE',
    challengeType: 'narrativa',
    businessContext: 'Data Lake VarejoMax · Expurgo de Sensores IoT Corrompidos',
    title: 'Remoção Completa de Leituras com Falha de Sensor (DropNA)',
    description:
      'Os coletores de temperatura das câmaras frias enviaram pacotes corrompidos para o DataFrame `df`, gerando valores nulos na coluna `temperatura_c`. Antes de treinar o modelo preditivo de conservação de perecíveis, remova todas as linhas que possuam valor nulo usando o método padrão do Pandas.',
    hint: 'Invoque o método de descarte de valores ausentes diretamente no DataFrame df.',
    tableSetup: [
      `CREATE TABLE df (sensor_id TEXT, temperatura_c REAL);`,
      `INSERT INTO df VALUES
        ('SNS-01', -18.4),
        ('SNS-02', NULL),
        ('SNS-03', -19.1),
        ('SNS-04', NULL),
        ('SNS-05', -17.8);`
    ],
    expectedOutput: [
      { sensor_id: 'SNS-01', temperatura_c: -18.4 },
      { sensor_id: 'SNS-03', temperatura_c: -19.1 },
      { sensor_id: 'SNS-05', temperatura_c: -17.8 }
    ]
  }
];
