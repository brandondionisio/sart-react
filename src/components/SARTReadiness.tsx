import { useState } from "react";
import Video1 from "../assets/videos/Video 1.mp4";

interface SARTReadinessProps {
  onStartTest: () => void;
}

export const SARTReadiness = ({ onStartTest }: SARTReadinessProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [videoWatched, setVideoWatched] = useState(false);

  const readinessSteps = [
    {
      title: "Practice Complete!",
      content: "You've successfully completed the practice phase. Great job!",
    },
    {
      title: "Ready for the Real Test",
      content:
        "Now you're ready for the actual test. This will consist of 50 trials following the same rules you just practiced.",
    },
    {
      title: "Test Rules Reminder",
      content: (
        <ul className="list-disc list-inside space-y-2 text-left">
          <li>Press SPACEBAR for digits 1, 2, 4, 5, 6, 7, 8, 9</li>
          <li>Do NOT press SPACEBAR for the digit 3</li>
          <li>Digits appear for 250ms, then disappear for 900ms</li>
        </ul>
      ),
    },
    {
      title: "Important Tips",
      content: (
        <>
          <p className="mb-2">Take your time and focus on accuracy.</p>
          <p>You can take breaks between trials if needed.</p>
        </>
      ),
    },
    {
      title: "Pre-Test Video",
      content: "Please watch the following video before starting the test.",
      isVideo: true,
    },
  ];

  const nextStep = () => {
    if (currentStep < readinessSteps.length - 1) {
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

  const isLastStep = currentStep === readinessSteps.length - 1;
  const isFirstStep = currentStep === 0;
  const currentStepData = readinessSteps[currentStep];
  const isVideoStep = currentStepData.isVideo;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Ready for the Test
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
              <source src={Video1} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {videoWatched && (
              <div className="mt-4 text-green-600 font-semibold">
                ✓ Video watched! You can now start the test.
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
          {readinessSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep ? "bg-green-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {isLastStep ? (
          <button
            onClick={onStartTest}
            disabled={!videoWatched}
            className={`px-4 py-2 w-28 rounded-lg font-semibold transition-colors ${
              videoWatched
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Start Test
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="bg-green-600 text-white px-6 py-2 w-28 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
