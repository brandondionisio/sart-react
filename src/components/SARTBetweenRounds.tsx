import { useState } from "react";
import { getVideoForRound } from "../config/videos";
import type { VideoVersion } from "../config/videos";

interface SARTBetweenRoundsProps {
  roundNumber: number;
  totalRounds: number;
  results: {
    totalTrials: number;
    correctResponses: number;
    commissionErrors: number;
    omissionErrors: number;
    averageRT: number;
    accuracy: number;
  };
  onNextRound: () => void;
  videoVersion: VideoVersion;
}

export const SARTBetweenRounds = ({
  roundNumber,
  totalRounds,
  results,
  onNextRound,
  videoVersion,
}: SARTBetweenRoundsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [videoWatched, setVideoWatched] = useState(false);

  const isLastRound = roundNumber === totalRounds;
  const nextRoundNumber = roundNumber + 1;

  const betweenRoundsSteps = [
    {
      title: `Round ${roundNumber} Complete!`,
      content: `You've successfully completed Round ${roundNumber} of ${totalRounds}. Great job! Please record your scores on the following page on the Qualtrics survey.`,
    },
    {
      title: "Your Performance",
      content: (
        <div className="text-left space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <strong>Accuracy:</strong> {results.accuracy.toFixed(1)}%
            </div>
            <div className="text-center">
              <strong>Avg Response Time:</strong> {results.averageRT.toFixed(0)}
              ms
            </div>
            <div className="text-center">
              <strong>Correct Responses:</strong> {results.correctResponses}
            </div>
            <div className="text-center">
              <strong>Correct Non-Responses:</strong>{" "}
              {results.totalTrials -
                results.correctResponses -
                results.commissionErrors -
                results.omissionErrors}
            </div>
            <div className="text-center">
              <strong>Commission Errors:</strong> {results.commissionErrors}
            </div>
            <div className="text-center">
              <strong>Omission Errors:</strong> {results.omissionErrors}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: isLastRound
        ? "Test Complete!"
        : `Ready for Round ${nextRoundNumber}`,
      content: isLastRound
        ? "You have completed all rounds of the SART test. Thank you for your participation!"
        : `You're now ready for Round ${nextRoundNumber}. This will be another set of 50 trials following the same rules.`,
    },
    {
      title: isLastRound ? "Final Instructions" : "Rules Reminder",
      content: isLastRound ? (
        <div>
          <p>You can safety exit out of this page.</p>
          <p>
            If you have questions, concerns, or have experienced a
            research-related injury, contact the research team.
          </p>
        </div>
      ) : (
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>Press SPACEBAR for digits 1, 2, 4, 5, 6, 7, 8, 9</li>
          <li>Do NOT press SPACEBAR for the digit 3</li>
          <li>Digits appear for 250ms, then disappear for 900ms</li>
        </ul>
      ),
    },
    ...(isLastRound
      ? []
      : [
          {
            title: "Pre-Round Video",
            content:
              "Please watch the following video before starting the next round.",
            isVideo: true,
          },
        ]),
  ];

  const nextStep = () => {
    if (currentStep < betweenRoundsSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleVideoEnd = () => {
    setVideoWatched(true);
  };

  const isLastStep = currentStep === betweenRoundsSteps.length - 1;
  const isFirstStep = currentStep === 0;
  const currentStepData = betweenRoundsSteps[currentStep];
  const isVideoStep = currentStepData.isVideo;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isLastRound ? "Test Complete!" : `Round ${roundNumber} Complete`}
      </h1>

      <div className="mb-6 min-h-[200px] flex flex-col justify-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {currentStepData.title}
        </h2>

        {isVideoStep ? (
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-gray-700 text-lg mb-4">
              {currentStepData.content}
            </div>
            <video
              className="w-full max-w-2xl mx-auto rounded-lg"
              controls
              onEnded={handleVideoEnd}
            >
              <source
                src={getVideoForRound(videoVersion, nextRoundNumber)}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            {videoWatched && (
              <div className="mt-4 text-green-600 font-semibold">
                ✓ Video watched! You can now start the next round.
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-700 text-lg">{currentStepData.content}</div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          disabled={isFirstStep}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            isFirstStep
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-600 text-white hover:bg-gray-700"
          }`}
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {betweenRoundsSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep ? "bg-purple-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {isLastStep ? (
          isLastRound ? (
            <div className="w-28"></div>
          ) : (
            <button
              onClick={onNextRound}
              disabled={!isLastRound && !videoWatched}
              className={`px-4 py-2 w-32 rounded-lg font-semibold transition-colors ${
                isLastRound || videoWatched
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next Round
            </button>
          )
        ) : (
          <button
            onClick={nextStep}
            className="bg-purple-600 text-white px-6 py-2 w-28 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
