import { useState } from "react";
import { Pencil, Star } from "lucide-react";

export default function AccomplishmentsTable() {
  const [accomplishments, setAccomplishments] = useState([
    {
      logo: "/general/cnsc_codex.png",
      name: "Learn Tailwind CSS",
      organization: "Frontend Masters",
      score: 102,
      status: "Completed",
      target: "Implement in projects",
    },
    {
      logo: "/general/cnsc_codex.png",
      name: "Networking",
      organization: "Tech Meetups",
      status: "In Progress",
      score: 30,
      target: "Attend 5 tech meetups",
    },
    {
      logo: "/general/cnsc_codex.png",
      name: "Networking",
      organization: "Tech Meetups",
      status: "In Progress",
      score: 30,
      target: "Attend 5 tech meetups",
    },
    {
      logo: "/general/cnsc_codex.png",
      name: "Networking",
      organization: "Tech Meetups",
      status: "In Progress",
      score: 30,
      target: "Attend 5 tech meetups",
    },
    {
      logo: "/general/cnsc_codex.png",
      name: "Networking",
      organization: "Tech Meetups",
      status: "In Progress",
      score: 30,
      target: "Attend 5 tech meetups",
    },
    {
      logo: "/general/cnsc_codex.png",
      name: "Networking",
      organization: "Tech Meetups",
      status: "In Progress",
      score: 30,
      target: "Attend 5 tech meetups",
    },
    {
      logo: "/general/cnsc_codex.png",
      name: "Networking",
      organization: "Tech Meetups",
      status: "In Progress",
      score: 30,
      target: "Attend 5 tech meetups",
    },
    {
      logo: "/general/cnsc_codex.png",
      name: "Networking",
      organization: "Tech Meetups",
      status: "In Progress",
      score: 30,
      target: "Attend 5 tech meetups",
    },
  ]);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleScore = (index) => {
    setCurrentItemIndex(index);
    setRating(0);
    setHoverRating(0);
    setShowRatingModal(true);
  };

  const handleRateSubmit = () => {
    if (currentItemIndex !== null && rating > 0) {
      const updated = [...accomplishments];
      updated[currentItemIndex].score = rating * 20; // convert 1-5 star to percentage
      setAccomplishments(updated);
    }
    setShowRatingModal(false);
  };

  const getScoreColor = (score) => {
    if (score < 30) return "text-red-500";
    if (score < 70) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="h-full overflow-y-auto rounded-[24px] relative">
      <table className="w-full bg-white table-auto">
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">
              Organization
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">
              Accomplishment Title
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">
              Progress
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">
              Status
            </th>
            <th className="py-3 px-6 text-center font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {accomplishments.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-4 px-6 text-gray-700 font-medium">
                <img
                  src={item.logo}
                  alt="Logo"
                  className="h-16 inline rounded-full shadow mr-4"
                />
                {item.organization}
              </td>
              <td className="py-4 px-6 text-gray-700">{item.name}</td>
              <td className="py-4 px-6">
                <span className={`font-medium ${getScoreColor(item.score)}`}>
                  {item.score}%
                </span>
              </td>
              <td className="py-4 px-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-4 px-6 text-center">
                <button
                  onClick={() => handleScore(index)}
                  className="text-amber-500 hover:text-amber-700"
                  title="Score"
                >
                  <span className="flex text-xl items-center justify-center gap-2">
                    Rate <Star size={20} />
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rating Modal */}
      {showRatingModal && currentItemIndex !== null && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Rate this accomplishment</h3>
            <p className="mb-6">
              How would you rate{" "}
              <strong>{accomplishments[currentItemIndex].name}</strong> from{" "}
              <strong>{accomplishments[currentItemIndex].organization}</strong>?
            </p>
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="mx-1 focus:outline-none"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "text-amber-500 fill-amber-500"
                        : "text-amber-500"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRateSubmit}
                disabled={rating === 0}
                className={`px-4 py-2 rounded-lg ${
                  rating === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
