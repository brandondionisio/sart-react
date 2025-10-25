import "./App.css";
import { FeedbackIndicator } from "./components/FeedbackIndicator";
import { SARTInstructions } from "./components/SARTInstructions";
import { SARTReadiness } from "./components/SARTReadiness";
import { SARTTest } from "./components/SARTTest";
import { Countdown } from "./components/Countdown";
import { SARTBetweenRounds } from "./components/SARTBetweenRounds";
import { useSART } from "./hooks/useSART";

function App() {
  const {
    phase,
    currentDigit,
    trialNumber,
    practiceTrials,
    results,
    feedback,
    countdown,
    currentRound,
    startTest,
    startRealTest,
    startNextRound,
  } = useSART();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <FeedbackIndicator feedback={feedback} />
      <Countdown countdown={countdown} />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full mx-4">
        {phase === "instructions" && (
          <SARTInstructions onStartTest={startTest} />
        )}

        {phase === "practice" && (
          <SARTTest
            phase="practice"
            currentDigit={currentDigit}
            trialNumber={trialNumber}
            practiceTrials={practiceTrials}
          />
        )}

        {phase === "readiness" && <SARTReadiness onStartTest={startRealTest} />}

        {phase === "test" && (
          <SARTTest
            phase="test"
            currentDigit={currentDigit}
            trialNumber={trialNumber}
            practiceTrials={practiceTrials}
            currentRound={currentRound}
          />
        )}

        {phase === "betweenRounds" && (
          <SARTBetweenRounds
            roundNumber={currentRound}
            totalRounds={3}
            results={results}
            onNextRound={startNextRound}
          />
        )}
      </div>
    </div>
  );
}

export default App;
