import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const activityData = [
  { name: "Jan", activities: 4 },
  { name: "Feb", activities: 6 },
  { name: "Mar", activities: 3 },
  { name: "Apr", activities: 5 },
];

const pointsData = [
  { month: "Jan", score: 10 },
  { month: "Feb", score: 30 },
  { month: "Mar", score: 45 },
  { month: "Apr", score: 60 },
];

const documents = [
  { name: "Accomplishment Report.pdf", status: "Approved" },
  { name: "Project Proposal.docx", status: "Pending" },
  { name: "Budget Plan.xlsx", status: "Approved" },
  { name: "Meeting Minutes.pdf", status: "Rejected" },
];

const events = [
  { title: "Outreach Program", score: 20 },
  { title: "Leadership Training", score: 15 },
  { title: "Environmental Clean-up", score: 25 },
];
export default function StudentAdminHomePage({ onBack }) {
  const [quotaUsed, setQuotaUsed] = useState(75);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Documents Section */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1 md:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>
        <ul className="space-y-2 text-sm">
          {documents.map((doc, i) => (
            <li key={i} className="flex justify-between">
              <span>{doc.name}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  doc.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : doc.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {doc.status}
              </span>
            </li>
          ))}
        </ul>
        <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition">
          Upload Document
        </button>
      </div>

      {/* Activity Graph Section */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Monthly Activities</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={activityData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="activities" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Events Section */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1 md:col-span-1">
        <h2 className="text-xl font-semibold mb-4">Events & Scores</h2>
        <ul className="space-y-2 text-sm">
          {events.map((event, index) => (
            <li key={index} className="flex justify-between">
              <span>{event.title}</span>
              <span className="font-medium">{event.score} pts</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Points Line Chart */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={pointsData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Quota Section */}
      <div className="bg-white rounded-2xl shadow p-4 col-span-1 md:col-span-3">
        <h2 className="text-xl font-semibold mb-2">Storage Quota</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${quotaUsed}%` }}
          />
        </div>
        <p className="text-sm mt-2">{quotaUsed}% of quota used</p>
      </div>
    </div>
  );
}
