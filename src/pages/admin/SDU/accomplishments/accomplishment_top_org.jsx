import { useState } from "react";
import { Award, ChevronUp, ChevronDown } from "lucide-react";

export default function OrganizationLeaderboard() {
  const [expandedOrg, setExpandedOrg] = useState(null);

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
      category: "Social Development",
    },
    {
      id: 3,
      name: "EduForward",
      score: 89.8,
      achievements: [
        "Provided education to 1.2M underserved students",
        "Built 87 schools in developing regions",
        "Created award-winning online learning platform",
      ],
      category: "Education",
    },
    {
      id: 4,
      name: "TechUnity Foundation",
      score: 87.5,
      achievements: [
        "Distributed technology to 500k disadvantaged communities",
        "Trained 25k individuals in digital literacy",
        "Launched 5 innovation hubs in rural areas",
      ],
      category: "Technology Access",
    },
    {
      id: 5,
      name: "BlueWave Conservation",
      score: 84.2,
      achievements: [
        "Cleaned 230 miles of coastline",
        "Protected 45 endangered marine species",
        "Established 12 marine sanctuaries",
      ],
      category: "Marine Conservation",
    },
  ];

  const toggleExpand = (id) => {
    setExpandedOrg(expandedOrg === id ? null : id);
  };

  const formatScore = (score) => score.toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-full border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-5 px-6 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Award className="text-yellow-300" size={28} />
          <h1 className="text-2xl font-bold text-white">
            Organization Impact Leaderboard
          </h1>
        </div>
        <p className="text-blue-100 mt-1">
          Recognizing excellence in social and environmental impact
        </p>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-10 px-6 py-3 bg-gray-50 border-b text-sm font-semibold text-gray-600">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5">Organization</div>
        <div className="col-span-3">Score</div>
        <div className="col-span-1"></div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-auto flex-1">
        <div className="divide-y divide-gray-100">
          {topOrgs.map((org, index) => (
            <div key={org.id} className="hover:bg-blue-50/50 transition-colors">
              <div
                onClick={() => toggleExpand(org.id)}
                className="grid grid-cols-10 items-center px-6 py-4 cursor-pointer"
                aria-expanded={expandedOrg === org.id}
              >
                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : index === 1
                        ? "bg-gray-200 text-gray-700"
                        : index === 2
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="col-span-5 font-medium text-gray-800">
                  {org.name}
                </div>
                <div className="col-span-3">
                  <span className="inline-block bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium">
                    {formatScore(org.score)}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  {expandedOrg === org.id ? (
                    <ChevronUp size={20} className="text-blue-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </div>
              </div>

              {expandedOrg === org.id && (
                <div className="bg-blue-50/70 px-6 py-4 border-t border-blue-100">
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-gray-500">
                      Category
                    </span>
                    <div className="bg-white border border-gray-200 text-gray-800 px-3 py-1 rounded-md mt-1 inline-block">
                      {org.category}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-700 mb-2">
                    Key Achievements
                  </h3>
                  <ul className="space-y-2">
                    {org.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                          <Award size={12} />
                        </div>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t px-6 py-3 text-sm text-gray-500 bg-gray-50 rounded-b-lg">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
