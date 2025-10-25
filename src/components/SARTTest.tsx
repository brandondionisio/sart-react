interface SARTTestProps {
  phase: "practice" | "test";
  currentDigit: number | null;
  trialNumber: number;
  practiceTrials: number;
  currentRound?: number;
}

export const SARTTest = ({
  phase,
  currentDigit,
  trialNumber,
  practiceTrials,
  currentRound,
}: SARTTestProps) => {
  const isPractice = phase === "practice";
  const currentTrial = isPractice ? practiceTrials + 1 : trialNumber + 1;
  const totalTrials = isPractice ? 10 : 50;
  const phaseTitle = isPractice
    ? "Practice Phase"
    : `Test Phase - Round ${currentRound || 1}`;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{phaseTitle}</h2>
      <p className="text-gray-600 mb-8">
        Trial {currentTrial} of {totalTrials}
      </p>
      <div className="text-8xl font-bold text-gray-800 min-h-[120px] flex items-center justify-center">
        {currentDigit}
      </div>
      <p className="text-gray-600 mt-8">
        Press SPACEBAR for all digits except 3
      </p>
    </div>
  );
};
