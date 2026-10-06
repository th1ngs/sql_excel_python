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
  challengeType?: 'explicativo' | 'narrativa';
  businessContext?: string;
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

export interface SimpleUser {
  uid: string;
  displayName: string;
  email?: string | null;
}

export interface DuelRoom {
  duelId: string;
  challengeId: string;
  difficulty: Difficulty;
  status: 'waiting' | 'in_progress' | 'completed';
  hostUid: string;
  hostName: string;
  hostCompleted: boolean;
  hostTimeMs: number;
  hostCharCount: number;
  hostQuery: string;
  hostScore: number;
  guestUid: string;
  guestName: string;
  guestCompleted: boolean;
  guestTimeMs: number;
  guestCharCount: number;
  guestQuery: string;
  guestScore: number;
  winnerUid: string;
  createdAt?: any;
  updatedAt?: any;
}

