export enum GoalStatus {
  PENDING = 'PENDING',
  ANALYZING = 'ANALYZING',
  REASONING = 'REASONING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface AgentGoal {
  id: string;
  description: string;
  status: GoalStatus;
  parentId: string | null;
  reasoningTrace?: string;
  outcome?: string;
  depth: number;
  confidenceScore: number; // 0-100
  priority: number; // 1-10
}

export interface SystemParameters {
  alpha: number; // Creativity/Temperature (0-1)
  beta: number;  // Reasoning Budget (Tokens)
  gamma: number; // Retention/Context Window (Factor)
  recursionLimit: number; // Depth of sub-goals
}

export interface AgentLog {
  id: string;
  timestamp: number;
  type: 'INFO' | 'ERROR' | 'THOUGHT' | 'ACTION' | 'REASONING';
  message: string;
  details?: string;
}

export interface KnowledgeNode {
  id: string;
  concept: string;
  definition: string;
  source: 'reasoning' | 'given';
}