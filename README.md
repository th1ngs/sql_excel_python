# Analyst Master — SQL, Excel & Python

**Analyst Master** é uma plataforma interativa de treinamento prático para Analistas e Cientistas de Dados, com motor de execução em tempo real para **SQL**, **Excel** e **Python (Pandas)**, sistema de certificações por nível e **Modo Duelo SQL** multiplayer em tempo real.

---

## Principais Funcionalidades

- **Mais de 410 Exercícios Práticos**:
  - **SQL Master (162 desafios)**: `SELECT`, `WHERE`, `JOINs`, `GROUP BY`, `HAVING`, Subqueries, CTEs e Window Functions (`RANK`, `LAG`, `LEAD`, `NTILE`).
  - **Excel Avançado (144 desafios)**: Fórmulas condicionais (`SE`, `SOMASE`, `CONT.SE`), busca e referência (`PROCV`, `PROCX`, `ÍNDICE/CORRESP`), texto, datas e finanças.
  - **Python Data / Pandas (105 desafios)**: Seleção, filtros compostos, `groupby`, `agg`, tratamento de nulos, séries temporais, `cumsum`, `z-score` e limpeza de dados.
  - **Mínimo de 5 exercícios por categoria**, distribuídos nos níveis **Básico (Junior)**, **Intermediário (Analyst)** e **Avançado (Expert)**.
- **Modo Duelo SQL (Multiplayer em Tempo Real)**:
  - Salas ao vivo sincronizadas via **Cloud Firestore** (`onSnapshot`).
  - Dois usuários resolvem simultaneamente o mesmo desafio de SQL.
  - **Índice de Eficiência**: Avalia quem resolve no **menor tempo** (`-50 pts/s`) e com a **query mais enxuta / menos caracteres** (`-15 pts/caractere`).
  - Comparativo pós-duelo lado a lado com as queries submetidas por cada jogador.
- **Acesso Rápido Sem Senha**:
  - Login instantâneo apenas com nome de usuário ou apelido.
- **Certificados de Especialização e Master Graduate**:
  - Emissão automática de certificados ao concluir os exames finais de cada módulo.

---

## Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion
- **Motor de Execução Local**: `sql.js` (SQLite WebAssembly) + Tradutor Poliglota (SQL / Fórmulas Excel / Expressões Pandas)
- **Backend & Tempo Real**: Firebase / Cloud Firestore

---

## Como Executar Localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse `http://localhost:3000` no navegador.
