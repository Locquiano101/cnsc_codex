import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Calendar,
  Users,
  FileText,
  Award,
  Info,
  FilesIcon,
} from "lucide-react";

function InstutionalRating({ accomplishment, onClose }) {
  const ratingCategories = [
    {
      id: "ppa",
      name: "PPA",
      maxPoints: 35,
    },
    { id: "documents", name: "Quality of Required Documents", maxPoints: 10 },
    { id: "institutional", name: "Institutional Involvement", maxPoints: 15 },
  ];
}

function ExternalRating({ accomplishment, onClose }) {
  // Modified categories - separating the dropdown options from regular categories
  const regularCategories = [
    { id: "meetings", name: "Meeting and Assemblies", maxPoints: 5 },
    { id: "documents", name: "Quality of Required Documents", maxPoints: 10 },
  ];

  // Options for the dropdown
  const awardOptions = [
    {
      id: "intlAwards",
      name: "International Award and Recognition",
      maxPoints: 8,
    },
    {
      id: "natAwards",
      name: "National and Regional Awards and Recognition",
      maxPoints: 12,
    },
    {
      id: "outreach",
      name: "Outreach Program/externally initiated activities",
      maxPoints: 10,
    },
  ];

  // Initialize state for all categories
  const initialRatings = {};
  regularCategories.forEach((category) => {
    initialRatings[category.id] = { score: null, applicable: true };
  });

  // Initialize state for selected award/outreach option
  const [ratings, setRatings] = useState(initialRatings);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionScore, setSelectedOptionScore] = useState(null);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [maxPossibleScore, setMaxPossibleScore] = useState(100);

  // Calculate the total score whenever ratings or selected option changes
  useEffect(() => {
    let score = 0;
    let possibleScore = 0;

    // Calculate score for regular categories
    regularCategories.forEach((category) => {
      if (ratings[category.id].applicable) {
        possibleScore += category.maxPoints;
        if (ratings[category.id].score !== null) {
          score += ratings[category.id].score;
        }
      }
    });

    // Add score for selected option if applicable
    if (selectedOption) {
      const option = awardOptions.find((opt) => opt.id === selectedOption);
      if (option) {
        possibleScore += option.maxPoints;
        if (selectedOptionScore !== null) {
          score += selectedOptionScore;
        }
      }
    }

    setTotalScore(Math.round(score * 10) / 10); // Round to 1 decimal place
    setMaxPossibleScore(possibleScore);
  }, [ratings, selectedOption, selectedOptionScore]);

  const handleScoreChange = (categoryId, value, maxPoints) => {
    // Ensure the score is within bounds (0 to maxPoints)
    const numValue = parseFloat(value);
    let validValue = numValue;

    if (isNaN(numValue)) {
      validValue = null;
    } else if (numValue < 0) {
      validValue = 0;
    } else if (numValue > maxPoints) {
      validValue = maxPoints;
    }

    setRatings((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], score: validValue },
    }));
  };

  const handleOptionScoreChange = (value, maxPoints) => {
    // Ensure the score is within bounds (0 to maxPoints)
    const numValue = parseFloat(value);
    let validValue = numValue;

    if (isNaN(numValue)) {
      validValue = null;
    } else if (numValue < 0) {
      validValue = 0;
    } else if (numValue > maxPoints) {
      validValue = maxPoints;
    }

    setSelectedOptionScore(validValue);
  };

  const toggleApplicable = (categoryId) => {
    setRatings((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        applicable: !prev[categoryId].applicable,
        score: !prev[categoryId].applicable ? null : prev[categoryId].score,
      },
    }));
  };

  const handleSubmit = () => {
    // Here you would typically send the ratings and comments to your backend
    console.log(
      "Submitting ratings:",
      ratings,
      "Selected option:",
      selectedOption,
      "Score:",
      selectedOptionScore,
      "Comments:",
      comments
    );
    // Mock API call
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  const isSubmitDisabled = () => {
    // Check if all applicable regular categories have ratings
    for (const categoryId in ratings) {
      if (
        ratings[categoryId].applicable &&
        ratings[categoryId].score === null
      ) {
        return true;
      }
    }

    // Check if an option is selected but no score is provided
    if (selectedOption && selectedOptionScore === null) {
      return true;
    }

    return comments.trim() === "";
  };

  const renderScoreInput = (categoryId, maxPoints) => {
    const { score, applicable } = ratings[categoryId];

    if (!applicable) {
      return (
        <div className="flex items-center">
          <span className="text-gray-500 italic">Not Applicable</span>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <input
          type="number"
          min="0"
          max={maxPoints}
          step="0.1"
          value={score !== null ? score : ""}
          onChange={(e) =>
            handleScoreChange(categoryId, e.target.value, maxPoints)
          }
          className="w-20 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="ml-2 text-gray-600">/ {maxPoints}</span>
      </div>
    );
  };

  const getSelectedOptionMaxPoints = () => {
    if (!selectedOption) return 0;
    const option = awardOptions.find((opt) => opt.id === selectedOption);
    return option ? option.maxPoints : 0;
  };

  const renderActivityDetails = () => {
    if (!accomplishment) return null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
        <h3 className="font-semibold text-lg mb-2">
          {accomplishment.event_title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-blue-500" />
            <span>
              Date: {new Date(accomplishment.event_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-green-500" />
            <span>Organization: {accomplishment.organization.org_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-purple-500" />
            <span>Activity Type: {accomplishment.activity_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Info size={18} className="text-gray-500" />
            <span>Status: {accomplishment.over_all_status}</span>
          </div>
          <p className="mt-3 text-gray-600">
            {accomplishment.event_description}
          </p>
          <div className="flex items-center gap-2 underline hover:cursor-pointer">
            <FilesIcon size={18} />
            <span>View Documents</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRatingCategories = () => {
    return (
      <div className="mb-6">
        <h3 className="font-semibold mb-4">Evaluation Criteria</h3>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="grid grid-cols-12 bg-gray-100 p-3 rounded-t-lg font-medium">
            <div className="col-span-5">Category</div>
            <div className="col-span-4">Points</div>
            <div className="col-span-1 text-center">N/A</div>
          </div>

          {/* Dropdown for Awards/Outreach */}
          <div className="grid grid-cols-12 p-3 bg-gray-50 items-center">
            <div className="col-span-5">
              <label htmlFor="awardType" className="font-medium">
                Award/Recognition Type
              </label>
            </div>
            <div className="col-span-7">
              <select
                id="awardType"
                value={selectedOption || ""}
                onChange={(e) => {
                  setSelectedOption(e.target.value || null);
                  setSelectedOptionScore(null); // Reset score when option changes
                }}
                className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select an option --</option>
                {awardOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name} (Max: {option.maxPoints} pts)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Regular Categories */}
          {regularCategories.map((category, index) => (
            <div
              key={category.id}
              className={`grid grid-cols-12 p-3 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } items-center`}
            >
              <div className="col-span-5">
                <span
                  className={
                    ratings[category.id].applicable ? "" : "text-gray-400"
                  }
                >
                  {category.name}
                </span>
              </div>
              <div className="col-span-4">
                {renderScoreInput(category.id, category.maxPoints)}
              </div>
              <div className="col-span-1 flex justify-center">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer ${
                    ratings[category.id].applicable
                      ? "border border-gray-300"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => toggleApplicable(category.id)}
                >
                  {!ratings[category.id].applicable && "✓"}
                </div>
              </div>
            </div>
          ))}

          {/* Score input for selected option */}
          {selectedOption && (
            <div className="grid grid-cols-12 p-3 bg-white items-center">
              <div className="col-span-5">
                <span className="text-gray-600 pl-4">
                  Score for{" "}
                  {awardOptions.find((opt) => opt.id === selectedOption)?.name}
                </span>
              </div>
              <div className="col-span-7">
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max={getSelectedOptionMaxPoints()}
                    step="0.1"
                    value={
                      selectedOptionScore !== null ? selectedOptionScore : ""
                    }
                    onChange={(e) =>
                      handleOptionScoreChange(
                        e.target.value,
                        getSelectedOptionMaxPoints()
                      )
                    }
                    className="w-20 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="ml-2 text-gray-600">
                    / {getSelectedOptionMaxPoints()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-12 p-3 bg-blue-50 rounded-b-lg font-medium">
            <div className="col-span-5">Total Score</div>
            <div className="col-span-7 flex justify-between">
              <span className="font-bold text-blue-600">
                {totalScore} / {maxPossibleScore} points
              </span>
              <span className="font-bold text-blue-600">
                {maxPossibleScore > 0
                  ? Math.round((totalScore / maxPossibleScore) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSubmissionForm = () => {
    return (
      <div>
        {renderRatingCategories()}

        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
          className={`w-full py-2 px-4 rounded-lg font-medium ${
            isSubmitDisabled()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Submit Evaluation
        </button>
      </div>
    );
  };

  const renderSuccessMessage = () => {
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={64} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          Evaluation Submitted!
        </h3>
        <p className="text-gray-600 mb-6">
          Thank you for providing your detailed evaluation of this activity.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg inline-block mx-auto mb-6">
          <p className="font-bold text-xl text-blue-700">
            {totalScore} / {maxPossibleScore} points (
            {Math.round((totalScore / maxPossibleScore) * 100)}%)
          </p>
        </div>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex w-full items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold">Activity Evaluation</h2>
          </div>
          <hr className="border-gray-200" />
        </div>

        {renderActivityDetails()}

        {submitted ? renderSuccessMessage() : renderSubmissionForm()}
      </div>
    </div>
  );
}

function ProposedPlanRating({ accomplishment, onClose }) {
  const ratingCategories = [
    { id: "documents", name: "Quality of Required Documents", maxPoints: 10 },
    { id: "institutional", name: "Institutional Involvement", maxPoints: 15 },
    {
      id: "localAwards",
      name: "Institutional/Local Awards and Recognition",
      maxPoints: 5,
    },
  ];
}

export default function SduAccomplishmentRating({ accomplishment, onClose }) {
  const activityType = accomplishment?.activity_type;

  const renderActivityComponent = () => {
    switch (activityType) {
      case "Institutional":
        return (
          <InstutionalRating
            accomplishment={accomplishment}
            onClose={onClose}
          />
        );
      case "External":
        return (
          <ExternalRating accomplishment={accomplishment} onClose={onClose} />
        );
      case "Proposed Plan":
        return (
          <ProposedPlanRating
            accomplishment={accomplishment}
            onClose={onClose}
          />
        );
      default:
        return <div>Unknown activity type</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative z-10">
        {renderActivityComponent()}
      </div>
    </div>
  );
}
