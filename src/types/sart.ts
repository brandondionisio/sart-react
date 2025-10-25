export type TestPhase =
  | "instructions"
  | "practice"
  | "readiness"
  | "test"
  | "betweenRounds"
  | "results";

export type FeedbackType =
  | "correct"
  | "incorrect"
  | "commission"
  | "omission"
  | null;

export interface SARTResult {
  totalTrials: number;
  correctResponses: number;
  commissionErrors: number;
  omissionErrors: number;
  averageRT: number;
  accuracy: number;
}

export interface SARTRoundResult extends SARTResult {
  roundNumber: number;
}
