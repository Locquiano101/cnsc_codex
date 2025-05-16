import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Info,
  Award,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default function OrganizationLeaderboard() {
  const [activeTab, setActiveTab] = useState("top");
  const [expandedOrg, setExpandedOrg] = useState(null);

  // Dummy data for the leaderboard
  const topOrgs = [
    {
      id: 1,
      name: "GreenTech Solutions",
      score: 94.7,
      achievements: [
        "Reduced carbon emissions by 45%",
        "Developed 3 revolutionary clean energy technologies",
        "Established sustainability programs in 27 countries",
      ],
      growthRate: 18.3,
      category: "Environmental Impact",
    },
    {
      id: 2,
      name: "HealthBridge International",
      score: 92.3,
      achievements: [
        "Provided healthcare access to 2.4M people",
        "Launched 14 mobile health clinics",
        "Developed affordable treatment for tropical diseases",
      ],
      growthRate: 15.7,
      category: "Social Development",
    },
    {
      id: 3,
      name: "EduForward",
      score: 89.8,
      achievements: [
        "Established 132 schools in underserved communities",
        "Trained 5,700 educators",
        "Created digital learning platform with 1.2M users",
      ],
      growthRate: 21.2,
      category: "Social Development",
    },
    {
      id: 4,
      name: "TechUnity Foundation",
      score: 87.5,
      achievements: [
        "Connected 850K households to high-speed internet",
        "Distributed 230K computers to low-income students",
        "Created 17 tech hubs in rural communities",
      ],
      growthRate: 12.9,
      category: "Technological Innovation",
    },
    {
      id: 5,
      name: "BlueWave Conservation",
      score: 84.2,
      achievements: [
        "Restored 120K acres of marine habitat",
        "Removed 890 tons of ocean plastic",
        "Protected 15 endangered marine species",
      ],
      growthRate: 9.8,
      category: "Environmental Impact",
    },
  ];

  // Format score with one decimal place
  const formatScore = (score) => score.toFixed(1);

  // Format growth rate or improvement with plus sign and one decimal place
  const formatGrowth = (growth) => `+${growth.toFixed(1)}%`;

  const toggleExpand = (id) => {
    if (expandedOrg === id) {
      setExpandedOrg(null);
    } else {
      setExpandedOrg(id);
    }
  };

  return (
    <div className=" bg-white rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-4 px-6">
        <h1 className="text-2xl font-bold text-white">
          Top Organization Accomplishments Leaderboard
        </h1>
        <p className="text-blue-100">
          Last updated:{" "}
          {Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
          }).format(Date.now())}
        </p>
      </div>

      <div>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-12 text-sm font-medium text-gray-500 mb-2">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Organization</div>
            <div className="col-span-2">Score</div>
          </div>

          {topOrgs.map((org, index) => (
            <div key={org.id} className="mb-2">
              <div
                className="grid grid-cols-12 items-center bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50"
                onClick={() => toggleExpand(org.id)}
              >
                <div className="col-span-1 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full w-8 h-8">
                  {index + 1}
                </div>
                <div className="col-span-4 font-medium">{org.name}</div>
                <div className="col-span-2">
                  <span className="inline-block bg-blue-100 text-blue-800 py-1 px-2 rounded-lg font-medium">
                    {formatScore(org.score)}
                  </span>
                </div>
                <div className="col-span-3 text-gray-600">{org.category}</div>

                <div className="col-span-1 flex justify-end text-gray-400">
                  {expandedOrg === org.id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </div>

              {expandedOrg === org.id && (
                <div className="bg-gray-50 p-4 rounded-b-lg mb-2 border-t-2 border-blue-100">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Key Achievements:
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {org.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rising Stars Tab */}
    </div>
  );
}
