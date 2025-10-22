// --- Core AI & System Types ---

export type Analysis = {
  model: string;
  actions: string[];
  explanations: string;
  confidence: number; // 0..1
};

export type SystemContext = {
  snapshot: any | null;
  events: Array<Record<string, any>>;
};

// --- Safety & Policy Types ---

export type SafetyIssue =
  | { kind: 'toxicity'; score: number; threshold: number; details?: string }
  | { kind: 'bias'; score: number; threshold: number; dimension?: string; details?: string }
  | { kind: 'factuality'; consistency: number; threshold: number; missingEvidence?: string[]; details?: string };

export type SafetyReport = {
  ok: boolean;
  issues: SafetyIssue[];
  notes: string[];
  scores: {
    toxicity: number;
    bias: number;
    factuality: number;
  };
  thresholds: {
    toxicity: number;
    bias: number;
    factuality: number;
  };
};

// --- Telemetry Types ---

export type TelemetryLevel = 'INFO' | 'WARN' | 'ERROR';

export type TelemetryEvent = {
  id: string;
  ts: number; // timestamp
  level: TelemetryLevel;
  message: string;
};

// --- Chat Types ---
export type ChatMessage = {
  id: string;
  role: 'user' | 'model';
  content: string;
};


// --- NEW DASHBOARD TYPES (From Blueprint) ---

export interface AnalysisResult {
  id: string;
  timestamp: number;
  files: AnalyzedFile[];
  metrics: GlobalMetrics;
  predictions?: Prediction[];
  stealthActions?: StealthAction[];
  quantumMetrics?: QuantumMetrics;
  blockchainProof?: BlockchainProof;
}

export interface AnalyzedFile {
  path: string;
  language: string;
  issues: Issue[];
  metrics: FileMetrics;
  dependencies: string[];
  framework?: string;
  autoFixed?: boolean;
}

export interface Issue {
  id: string;
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  suggestion?: string;
  autoFixable?: boolean;
  autoFixed?: boolean;
  predictedImpact?: 'critical' | 'high' | 'medium' | 'low';
  timeToFix?: number;
  codePreview: string;
}

export interface FileMetrics {
  loc: number;
  sloc: number;
  complexity: number;
  maintainability: number;
  duplicates: number;
  coverage?: number;
  dependencies: number;
}

export interface GlobalMetrics {
  totalLoc: number;
  averageComplexity: number;
  totalDuplicates: number;
  technicalDebt: string;
  maintainabilityIndex: number;
  testCoverage: number;
  dependencyHealth: number;
}

export interface Prediction {
  id: string;
  type: 'crash' | 'performance-degradation' | 'security-breach' | 'bug' | 'feedback-loop';
  confidence: number;
  timeframe: string;
  location?: {
    file: string;
    line: number;
  };
  description: string;
  preventionSteps?: string[];
  autoPreventable?: boolean;
  aggressiveness?: number;
}

export interface StealthAction {
  type: 'auto-fix' | 'prediction' | 'anomaly' | 'optimization';
  timestamp: number;
  file: string;
  description: string;
  confidence: number;
  impact: 'critical' | 'high' | 'medium' | 'low';
  beforeCode?: string;
  afterCode?: string;
}

export interface QuantumMetrics {
  coherence: number;
  entanglement: number;
  superposition: number;
  simulatedStates: number;
}

export interface BlockchainProof {
  hash: string;
  timestamp: number;
  verified: boolean;
  trustScore: number;
}

export interface RealTimeTelemetry {
  cpu: { value: number, history: { time: number; value: number }[] };
  memory: { value: number, history: { time: number; value: number }[] };
  kernel: {
      processes: { value: number, history: { time: number; value: number }[] };
      contextSwitches: { value: number, history: { time: number; value: number }[] };
  };
}

// --- Static Analysis Types ---
export type StaticIssueSeverity = 'CRITICAL' | 'HIGH' | 'LOW';

export type StaticIssue = {
  line: number;
  message: string;
  severity: StaticIssueSeverity;
  ruleId: string;
};

export type StaticAnalysisReport = {
  issues: StaticIssue[];
  elapsedMs: number;
};

// --- Deployment Plan Types ---
export type DeploymentStepStatus = 'pending' | 'running' | 'completed' | 'failed';

export type DeploymentStep = {
  id: string;
  title: string;
  status: DeploymentStepStatus;
  duration?: number;
};

interface BaseDeploymentState {
  analysis: Analysis;
  steps: DeploymentStep[];
  safetyReport: SafetyReport;
}

export type DeploymentPlanState =
  | { status: 'idle' }
  | { status: 'generating'; partialAnalysis?: { explanations: string } }
  | { status: 'failed'; error: string }
  | (BaseDeploymentState & {
      status: 'awaiting_approval';
      policyNotes: string[];
    })
  | (BaseDeploymentState & {
      status: 'running';
      currentStepIndex: number;
    })
  | (BaseDeploymentState & {
      status: 'execution_failed';
      currentStepIndex: number;
      error: string;
    })
  | (BaseDeploymentState & {
      status: 'completed';
      currentStepIndex: number;
    });

export type DeploymentPlanAction =
  | { type: 'GENERATE_PLAN_START' }
  | { type: 'GENERATE_PLAN_STREAM', payload: { explanationsChunk: string } }
  | {
      type: 'GENERATE_PLAN_SUCCESS';
      payload: { analysis: Analysis; steps: DeploymentStep[]; policyResult: { requiresApproval: boolean; notes: string[]; safetyReport: SafetyReport } };
    }
  | { type: 'GENERATE_PLAN_FAILURE'; payload: { error: string } }
  | { type: 'APPROVE_AND_EXECUTE' }
  | { type: 'SET_CURRENT_STEP'; payload: { stepIndex: number } }
  | { type: 'UPDATE_STEP'; payload: { stepIndex: number; newStatus: DeploymentStepStatus; duration?: number } }
  | { type: 'EXECUTION_FAILURE'; payload: { error: string } }
  | { type: 'COMPLETE_EXECUTION' }
  | { type: 'RESET' };

// --- Meta-Hybrid Kernel Types (AUDIT UPDATE) ---
export interface AIAnalysisResult {
  intent: string;
  complexity: number;
  recommendedComponents: string[];
  potentialChallenges: string[];
}

export interface ScoringResult {
  overallScore: number;
  subscores: Record<string, number>;
}

export interface KernelMilestone {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number;
  timestamp: number;
  aiInsights?: { riskScore: number; recommendations: string[]; confidence: number };
  fibonacciWeight?: number;
  dependencies?: string[];
}

// FIX: Exporting EnhancedMilestone as an alias for KernelMilestone to fix import errors.
export type EnhancedMilestone = KernelMilestone;

export interface KernelAnalysisResult {
  milestones: KernelMilestone[];
  modularity_score: number;
  replay_fidelity: number;
  orchestration_depth: number;
  recommendations: string[];
  safetyMetrics?: { toxicity: number; bias: number; hallucination: number };
}

export interface MetaHybridResult {
  initialAnalysis: AIAnalysisResult;
  scoringResult: ScoringResult;
  refinedComponents: { name: string; code: string }[];
  kernelResult: KernelAnalysisResult;
}


export interface ScenarioFlag {}

// --- Viral Engine Types ---
export type ViralResult = {
    id: string;
    title: string;
    description: string;
    geminiScore: number;
    slavkoScore: number;
    imageUrl: string;
    engagementMetrics: {
        views: number;
        shares: number;
        likes: number;
    };
};