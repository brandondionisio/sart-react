import type { FeedbackType } from "../types/sart";

interface FeedbackIndicatorProps {
  feedback: FeedbackType;
}

export const FeedbackIndicator = ({ feedback }: FeedbackIndicatorProps) => {
  if (!feedback) return null;

  const getFeedbackStyle = () => {
    switch (feedback) {
      case "correct":
        return "text-green-600 bg-green-100 border-green-300";
      case "commission":
        return "text-red-600 bg-red-100 border-red-300";
      case "omission":
        return "text-orange-600 bg-orange-100 border-orange-300";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  const getFeedbackText = () => {
    switch (feedback) {
      case "correct":
        return "✓ Correct!";
      case "commission":
        return "✗ Commission Error (responded to 3)";
      case "omission":
        return "⚠ Omission Error (missed non-3)";
      default:
        return "";
    }
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg border-2 font-semibold text-lg z-50 transition-all duration-300 ${getFeedbackStyle()}`}
    >
      {getFeedbackText()}
    </div>
  );
};
