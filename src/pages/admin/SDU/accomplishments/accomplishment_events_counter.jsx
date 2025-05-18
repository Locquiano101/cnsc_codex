import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Sample data
const initialData = [
  {
    category: "External",
    organization: "Partner Company A",
    value: 12,
    events: [
      "Joint research project",
      "Technology sharing agreement",
      "Co-developed product",
    ],
  },
  {
    category: "Internal",
    organization: "Partner Company B",
    value: 9,
    events: ["Market expansion", "Supply chain optimization", "Cross-training"],
  },
  {
    category: "Proposed Plans",
    organization: "Partner Company B",
    value: 9,
    events: [
      "Market expansion",
      "Supply chain optimization",
      "Supply chain optimization",
      "Supply chain optimization",
      "Supply chain optimization",
    ],
  },
  {
    category: "Internal",
    organization: "Partner Company C",
    value: 9,
    events: ["Market expansion", "Supply chain optimization", "Cross-training"],
  },
];

// Utility to generate RGB color
const generateRGB = (index) => {
  const hue = (index * 137) % 360; // spread out hues
  return `hsl(${hue}, 70%, 60%)`;
};

export default function EventsPieChart() {
  const [data] = useState(initialData);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filtered data based on selection
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (selectedCategory && selectedOrganization) {
        return (
          item.category === selectedCategory &&
          item.organization === selectedOrganization
        );
      }
      if (selectedCategory) return item.category === selectedCategory;
      if (selectedOrganization)
        return item.organization === selectedOrganization;
      return true;
    });
  }, [data, selectedCategory, selectedOrganization]);

  const handlePieClick = (item) => {
    setSelectedItem(item.payload.originalItem);
  };

  // Aggregate by category
  const categoryData = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
      if (!map[item.category])
        map[item.category] = { name: item.category, value: 0 };
      map[item.category].value += item.value;
    });
    return Object.values(map).map((item, i) => ({
      ...item,
      color: generateRGB(i),
    }));
  }, [filteredData]);

  // Aggregate by organization
  const orgData = useMemo(() => {
    const map = {};
    filteredData.forEach((item) => {
      if (!map[item.organization])
        map[item.organization] = {
          name: item.organization,
          value: 0,
          originalItem: item,
        };
      map[item.organization].value += item.value;
    });
    return Object.values(map).map((item, i) => ({
      ...item,
      color: generateRGB(i + 5),
    }));
  }, [filteredData]);

  // Flatten events
  const eventData = useMemo(() => {
    return filteredData.flatMap((item, index) =>
      item.events.map((event) => ({
        name: event,
        value: 1,
        color: generateRGB(index + 10),
        originalItem: item,
      }))
    );
  }, [filteredData]);

  const categories = [...new Set(data.map((item) => item.category))];
  const organizations = selectedCategory
    ? [
        ...new Set(
          data
            .filter((d) => d.category === selectedCategory)
            .map((d) => d.organization)
        ),
      ]
    : [...new Set(data.map((d) => d.organization))];

  return (
    <div className="flex flex-col h-full gap- bg-white rounded-2xl p-4">
      <div className="flex w-full items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold mb-48text-gray-800">
          Event Analytics Dashboard
        </h1>
        {/* Filters & Summary */}
        <div className="flex-1">
          <label className="block font-medium text-gray-700 mb-2">
            Organization
          </label>
          <select
            className="p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedOrganization || ""}
            onChange={(e) => setSelectedOrganization(e.target.value || null)}
          >
            <option value="">All Organizations</option>
            {organizations.map((org, i) => (
              <option key={i} value={org}>
                {org}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lg mb-3 text-gray-800">Summary</h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              Total Events:{" "}
              <span className="font-medium">
                {eventData.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
            </p>
            {selectedCategory && (
              <p className="text-gray-600">
                Category:{" "}
                <span className="font-medium">{selectedCategory}</span>
              </p>
            )}
            {selectedOrganization && (
              <p className="text-gray-600">
                Organization:{" "}
                <span className="font-medium">{selectedOrganization}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Charts Section */}
      <div className="flex-1">
        <div className="flex w-full">
          {/* Category Pie */}
          <div className="flex flex-col flex-1 items-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Categories
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} events`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Organization Pie */}
          <div className="flex flex-col flex-1 items-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Organizations
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orgData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    onClick={handlePieClick}
                  >
                    {orgData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} events`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Event Details */}
      {selectedItem && (
        <div className="rounded-xl shadow-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-gray-800">
              Completed Events for {selectedItem.name}
            </h3>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {selectedItem.events.map((event, i) => (
              <li key={i} className="py-2 px-1 hover:bg-gray-50">
                {event}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
