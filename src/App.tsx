import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FeedbackIndicator } from "./components/FeedbackIndicator";
import { SARTInstructions } from "./components/SARTInstructions";
import { SARTReadiness } from "./components/SARTReadiness";
import { SARTTest } from "./components/SARTTest";
import { Countdown } from "./components/Countdown";
import { SARTBetweenRounds } from "./components/SARTBetweenRounds";
import { useSART } from "./hooks/useSART";
import type { VideoVersion } from "./config/videos";

interface SARTTestComponentProps {
  videoVersion: VideoVersion;
}

function SARTTestComponent({ videoVersion }: SARTTestComponentProps) {
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

        {phase === "readiness" && (
          <SARTReadiness
            onStartTest={startRealTest}
            videoVersion={videoVersion}
          />
        )}

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
            videoVersion={videoVersion}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SARTTestComponent videoVersion="v1" />} />
        <Route path="/v1" element={<SARTTestComponent videoVersion="v1" />} />
        <Route path="/v2" element={<SARTTestComponent videoVersion="v2" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
