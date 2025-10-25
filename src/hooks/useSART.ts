import { useState, useEffect, useCallback, useRef } from "react";
import type {
  TestPhase,
  FeedbackType,
  SARTResult,
  SARTRoundResult,
} from "../types/sart";

export const useSART = () => {
  const [phase, setPhase] = useState<TestPhase>("instructions");
  const [currentDigit, setCurrentDigit] = useState<number | null>(null);
  const [lastShownDigit, setLastShownDigit] = useState<number | null>(null);
  const [trialNumber, setTrialNumber] = useState(0);
  const [results, setResults] = useState<SARTResult>({
    totalTrials: 0,
    correctResponses: 0,
    commissionErrors: 0,
    omissionErrors: 0,
    averageRT: 0,
    accuracy: 0,
  });
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [isTestActive, setIsTestActive] = useState(false);
  const [practiceTrials, setPracticeTrials] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [userResponded, setUserResponded] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [roundResults, setRoundResults] = useState<SARTRoundResult[]>([]);

  const practiceTrialsRef = useRef(0);
  const trialNumberRef = useRef(0);
  const isTestActiveRef = useRef(false);
  const userRespondedRef = useRef(false);
  const lastShownDigitRef = useRef<number | null>(null);
  const trialStartTimeRef = useRef<number | null>(null);
  const correctResponsesRef = useRef(0);
  const correctNonResponsesRef = useRef(0);
  const commissionErrorsRef = useRef(0);
  const omissionErrorsRef = useRef(0);
  const practiceTimeoutRef = useRef<number | null>(null);
  const testTimeoutRef = useRef<number | null>(null);

  const generateDigit = useCallback(() => {
    const digits = [1, 2, 4, 5, 6, 7, 8, 9];
    return digits[Math.floor(Math.random() * digits.length)];
  }, []);

  const calculateOverallResults = (rounds: SARTRoundResult[]): SARTResult => {
    const totalTrials = rounds.reduce(
      (sum, round) => sum + round.totalTrials,
      0
    );
    const correctResponses = rounds.reduce(
      (sum, round) => sum + round.correctResponses,
      0
    );
    const commissionErrors = rounds.reduce(
      (sum, round) => sum + round.commissionErrors,
      0
    );
    const omissionErrors = rounds.reduce(
      (sum, round) => sum + round.omissionErrors,
      0
    );

    const accuracy =
      totalTrials > 0
        ? ((correctResponses +
            rounds.reduce(
              (sum, round) =>
                sum +
                (round.totalTrials -
                  round.correctResponses -
                  round.commissionErrors -
                  round.omissionErrors),
              0
            )) /
            totalTrials) *
          100
        : 0;

    const allResponseTimes = rounds.reduce((times, round) => {
      const roundCorrectResponses = round.correctResponses;
      const avgRT = round.averageRT;
      return [...times, ...Array(roundCorrectResponses).fill(avgRT)];
    }, [] as number[]);

    const averageRT =
      allResponseTimes.length > 0
        ? allResponseTimes.reduce((sum, rt) => sum + rt, 0) /
          allResponseTimes.length
        : 0;

    return {
      totalTrials,
      correctResponses,
      commissionErrors,
      omissionErrors,
      accuracy,
      averageRT,
    };
  };

  const generateTargetDigit = () => 3;

  const startTrial = useCallback(
    (isTarget: boolean = false) => {
      const digit = isTarget ? generateTargetDigit() : generateDigit();
      setCurrentDigit(digit);
      setLastShownDigit(digit);
      lastShownDigitRef.current = digit;
      setIsTestActive(true);
      isTestActiveRef.current = true;
      setUserResponded(false);
      userRespondedRef.current = false;
      trialStartTimeRef.current = Date.now();

      setTimeout(() => {
        setCurrentDigit(null);
      }, 250);

      setTimeout(() => {
        setIsTestActive(false);
        isTestActiveRef.current = false;
      }, 1150);
    },
    [generateDigit]
  );

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!isTestActive || event.code !== "Space" || userResponded) return;

      event.preventDefault();
      setUserResponded(true);
      userRespondedRef.current = true;

      const responseTime = trialStartTimeRef.current
        ? Date.now() - trialStartTimeRef.current
        : 0;

      if (lastShownDigit === 3) {
        setResults((prev) => ({
          ...prev,
          commissionErrors: prev.commissionErrors + 1,
        }));
        commissionErrorsRef.current += 1;
        setFeedback("commission");
      } else if (lastShownDigit !== null) {
        setResults((prev) => ({
          ...prev,
          correctResponses: prev.correctResponses + 1,
        }));
        correctResponsesRef.current += 1;
        setResponseTimes((prev) => [...prev, responseTime]);
        setFeedback("correct");
      }

      setIsTestActive(false);
      isTestActiveRef.current = false;

      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    },
    [isTestActive, lastShownDigit, userResponded]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const startCountdown = (callback: () => void) => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setCountdown(null);
          callback();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const runPractice = () => {
    setPhase("practice");
    setPracticeTrials(0);
    practiceTrialsRef.current = 0;
    if (practiceTimeoutRef.current) {
      clearTimeout(practiceTimeoutRef.current);
      practiceTimeoutRef.current = null;
    }
    startCountdown(() => {
      runNextPracticeTrial();
    });
  };

  const runNextPracticeTrial = () => {
    if (isTestActiveRef.current) {
      return;
    }

    if (practiceTrialsRef.current >= 10) {
      setPhase("readiness");
      return;
    }

    const isTarget = Math.random() < 0.2;
    startTrial(isTarget);

    setTimeout(() => {
      if (!userRespondedRef.current) {
        if (lastShownDigitRef.current === 3) {
          correctNonResponsesRef.current += 1;
          setFeedback("correct");
          setTimeout(() => {
            setFeedback(null);
          }, 1000);
        } else if (lastShownDigitRef.current !== null) {
          setResults((prev) => ({
            ...prev,
            omissionErrors: prev.omissionErrors + 1,
          }));
          omissionErrorsRef.current += 1;
          setFeedback("omission");
          setTimeout(() => {
            setFeedback(null);
          }, 1000);
        }
      }

      practiceTrialsRef.current += 1;

      if (practiceTrialsRef.current >= 10) {
        setPhase("readiness");
        return;
      }

      setPracticeTrials(practiceTrialsRef.current);
      if (practiceTimeoutRef.current) {
        clearTimeout(practiceTimeoutRef.current);
      }
      practiceTimeoutRef.current = setTimeout(runNextPracticeTrial, 900);
    }, 1150);
  };

  const runNextTestTrial = () => {
    if (isTestActiveRef.current) {
      return;
    }

    const isTarget = Math.random() < 0.2;
    startTrial(isTarget);

    setTimeout(() => {
      if (!userRespondedRef.current) {
        if (lastShownDigitRef.current === 3) {
          correctNonResponsesRef.current += 1;
          setFeedback("correct");
          setTimeout(() => {
            setFeedback(null);
          }, 1000);
        } else if (lastShownDigitRef.current !== null) {
          setResults((prev) => ({
            ...prev,
            omissionErrors: prev.omissionErrors + 1,
          }));
          omissionErrorsRef.current += 1;
          setFeedback("omission");
          setTimeout(() => {
            setFeedback(null);
          }, 1000);
        }
      }

      trialNumberRef.current += 1;
      setTrialNumber(trialNumberRef.current);
      setResults((prev) => ({
        ...prev,
        totalTrials: prev.totalTrials + 1,
      }));

      if (trialNumberRef.current >= 50) {
        const totalTrials = trialNumberRef.current;
        const correctTrials =
          correctResponsesRef.current + correctNonResponsesRef.current;
        const accuracy =
          totalTrials > 0 ? (correctTrials / totalTrials) * 100 : 0;

        const averageRT =
          responseTimes.length > 0
            ? responseTimes.reduce((sum, rt) => sum + rt, 0) /
              responseTimes.length
            : 0;

        const roundResult: SARTRoundResult = {
          roundNumber: currentRound,
          totalTrials: totalTrials,
          correctResponses: correctResponsesRef.current,
          commissionErrors: commissionErrorsRef.current,
          omissionErrors: omissionErrorsRef.current,
          accuracy,
          averageRT,
        };

        setResults((prev) => ({
          ...prev,
          totalTrials: totalTrials,
          correctResponses: correctResponsesRef.current,
          commissionErrors: commissionErrorsRef.current,
          omissionErrors: omissionErrorsRef.current,
          accuracy,
          averageRT,
        }));

        setRoundResults((prev) => [...prev, roundResult]);

        if (currentRound >= 3) {
          const overallResults = calculateOverallResults([
            ...roundResults,
            roundResult,
          ]);
          setResults(overallResults);
          setPhase("results");
        } else {
          setPhase("betweenRounds");
        }
        return;
      }

      if (testTimeoutRef.current) {
        clearTimeout(testTimeoutRef.current);
      }
      testTimeoutRef.current = setTimeout(runNextTestTrial, 900);
    }, 1150);
  };

  const startTest = () => {
    runPractice();
  };

  const startRealTest = () => {
    setPhase("test");
    setTrialNumber(0);
    trialNumberRef.current = 0;
    setResults({
      totalTrials: 0,
      correctResponses: 0,
      commissionErrors: 0,
      omissionErrors: 0,
      averageRT: 0,
      accuracy: 0,
    });
    setResponseTimes([]);
    correctResponsesRef.current = 0;
    correctNonResponsesRef.current = 0;
    commissionErrorsRef.current = 0;
    omissionErrorsRef.current = 0;
    if (testTimeoutRef.current) {
      clearTimeout(testTimeoutRef.current);
      testTimeoutRef.current = null;
    }
    startCountdown(() => {
      runNextTestTrial();
    });
  };

  const startNextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setPhase("test");
    setTrialNumber(0);
    trialNumberRef.current = 0;
    setResults({
      totalTrials: 0,
      correctResponses: 0,
      commissionErrors: 0,
      omissionErrors: 0,
      averageRT: 0,
      accuracy: 0,
    });
    setResponseTimes([]);
    correctResponsesRef.current = 0;
    correctNonResponsesRef.current = 0;
    commissionErrorsRef.current = 0;
    omissionErrorsRef.current = 0;
    if (testTimeoutRef.current) {
      clearTimeout(testTimeoutRef.current);
      testTimeoutRef.current = null;
    }
    startCountdown(() => {
      runNextTestTrial();
    });
  };

  const resetTest = () => {
    setPhase("instructions");
    setCurrentDigit(null);
    setLastShownDigit(null);
    setTrialNumber(0);
    trialNumberRef.current = 0;
    setResults({
      totalTrials: 0,
      correctResponses: 0,
      commissionErrors: 0,
      omissionErrors: 0,
      averageRT: 0,
      accuracy: 0,
    });
    setResponseTimes([]);
    setIsTestActive(false);
    setPracticeTrials(0);
    practiceTrialsRef.current = 0;
    setFeedback(null);
    setUserResponded(false);
    userRespondedRef.current = false;
    lastShownDigitRef.current = null;
    correctResponsesRef.current = 0;
    correctNonResponsesRef.current = 0;
    commissionErrorsRef.current = 0;
    omissionErrorsRef.current = 0;
    setCountdown(null);
    setCurrentRound(1);
    setRoundResults([]);
    if (practiceTimeoutRef.current) {
      clearTimeout(practiceTimeoutRef.current);
      practiceTimeoutRef.current = null;
    }
    if (testTimeoutRef.current) {
      clearTimeout(testTimeoutRef.current);
      testTimeoutRef.current = null;
    }
  };

  return {
    phase,
    currentDigit,
    trialNumber,
    practiceTrials,
    results,
    feedback,
    countdown,
    currentRound,
    roundResults,
    startTest,
    startRealTest,
    startNextRound,
    resetTest,
  };
};
