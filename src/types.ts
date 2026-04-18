export type Difficulty = 'Básico' | 'Intermediário' | 'Avançado';
export type Rank = 'Junior' | 'Analyst' | 'Expert';
export type Track = 'sql' | 'excel' | 'python';

export interface Challenge {
  id: string;
  track: Track;
  rank: Rank;
  title: string;
  difficulty: Difficulty;
  description: string;
  hint: string;
  tableSetup: string[];
  expectedOutput: any[];
  initialQuery?: string;
  category: string;
  orderSensitive?: boolean;
  isFinalTest?: boolean;
}

export interface UserCertificate {
  rank: Rank;
  track: Track;
  issuedAt: string;
  userName: string;
}

export interface SqlResult {
  columns: string[];
  values: any[][];
}

export interface ExecutionResult {
  success: boolean;
  data?: SqlResult[];
  error?: string;
}
