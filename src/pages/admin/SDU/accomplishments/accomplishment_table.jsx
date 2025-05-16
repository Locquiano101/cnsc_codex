import { useState } from "react";
import { Pencil, Star } from "lucide-react";

export default function AccomplishmentsTable() {
  const [accomplishments, setAccomplishments] = useState([
    {
      name: "Learn Tailwind CSS",
      organization: "Frontend Masters",
      score: 102,
      status: "Completed",
      target: "Implement in projects",
    },
    {
      name: "Networking",
      organization: "Tech Meetups",
      status: "In Progress",
      score: 30,
      target: "Attend 5 tech meetups",
    },
    {
      name: "React Hooks Workshop",
      organization: "React Conference",
      status: "Pending",
      score: null,
      target: "Complete all exercises",
    },
  ]);

  const getScoreColor = (score) => {
    if (score === null) return "text-red-500";
    if (score < 30) return "text-red-500";
    if (score < 70) return "text-yellow-500";
    return "text-green-500";
  };

  const getScoreDisplay = (score) => {
    return score === null ? "To be graded" : `${score}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleEdit = (index) => {
    // Edit functionality would go here
    console.log("Edit item at index:", index);
  };

  const handleScore = (index) => {
    // Score functionality would go here
    console.log("Score item at index:", index);
  };

  return (
    <div className="h-full overflow-y-auto rounded-[24px]">
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
                {item.organization}
              </td>
              <td className="py-4 px-6 text-gray-700">{item.name}</td>
              <td className="py-4 px-6">
                <span className={`font-medium ${getScoreColor(item.score)}`}>
                  {getScoreDisplay(item.score)}
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
              <td className="py-4 px-6">
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleScore(index)}
                    className="text-amber-500 hover:text-amber-700"
                    title="Score"
                  >
                    <Star size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
