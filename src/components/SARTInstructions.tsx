import { useState } from "react";

interface SARTInstructionsProps {
  onStartTest: () => void;
}

export const SARTInstructions = ({ onStartTest }: SARTInstructionsProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const instructions = [
    {
      title: "Welcome to the SART Test",
      content:
        "You will see digits from 1-9 appearing on the screen one at a time.",
    },
    {
      title: "Your Task",
      content: (
        <>
          <strong>
            Press the SPACEBAR for every digit EXCEPT the number 3.
          </strong>
          <br />
          When you see the number 3, do NOT press anything.
        </>
      ),
    },
    {
      title: "Timing",
      content:
        "Digits will appear for 250ms, then disappear for 900ms before the next one.",
    },
    {
      title: "Test Structure",
      content:
        "You will complete 10 practice trials followed by three rounds of 50 test trials. Before each round of test trials, you will be given a video to watch. You will need to record your scores on the Qualtrics survey after each round.",
    },
    {
      title: "Purpose",
      content:
        "This test measures sustained attention and response inhibition.",
    },
  ];

  const nextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === instructions.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        PSY 32 - SART Test
      </h1>

      <div className="mb-6 min-h-[200px] flex flex-col justify-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {instructions[currentStep].title}
        </h2>
        <div className="text-gray-700 text-lg">
          {instructions[currentStep].content}
        </div>
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
          {instructions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {isLastStep ? (
          <button
            onClick={onStartTest}
            className="bg-blue-600 text-white px-4 py-2 w-28 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Test
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-6 py-2 w-28 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};
