export type Difficulty = 'Básico' | 'Intermediário' | 'Avançado';
export type Track = 'sql' | 'excel' | 'python';

export interface Challenge {
  id: string;
  track: Track;
  title: string;
  difficulty: Difficulty;
  description: string;
  hint: string;
  tableSetup: string[]; // For SQL this is SQL, for Excel/Python this can be data setup
  expectedOutput: any[];
  initialQuery?: string;
  category: string;
  orderSensitive?: boolean;
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
