import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTimes } from "@fortawesome/free-solid-svg-icons";

import { API_ROUTER } from "../../../../App";
import ProcessAccreditationSection from "./edit";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AccreditationTableSection() {
  const [accreditations, setAccreditations] = useState([]);
  const [selectedAccreditation, setSelectedAccreditation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];
  const STATUS_COLORS = {
    Accredited: "#10B981",
    Pending: "#F59E0B",
    "Revision Required": "#EF4444",
  };

  useEffect(() => {
    const fetchAccreditations = async () => {
      try {
        const response = await axios.get(`${API_ROUTER}/get-accreditation`);
        console.log(response.data.accreditations);
        setAccreditations(response.data.accreditations);
      } catch (err) {
        console.error("Error fetching accreditations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccreditations();
  }, []);
  const handleView = (acc) => {
    setSelectedAccreditation(acc);
  };

  const handleBack = () => {
    setSelectedAccreditation(null);
  };
  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const prepareChartData = () => {
    // Classification breakdown (Local vs System-wide)
    const classificationData = [
      {
        name: "Local",
        value: accreditations.filter((org) => org.org_class === "Local").length,
      },
      {
        name: "System-wide",
        value: accreditations.filter((org) => org.org_class === "System-wide")
          .length,
      },
    ];

    // Status breakdown - updated to include "Revision Required"
    const statusData = [
      {
        name: "Accredited",
        value: accreditations.filter(
          (org) => org.accreditation_status?.over_all_status === "Accredited"
        ).length,
      },
      {
        name: "Pending",
        value: accreditations.filter(
          (org) => org.accreditation_status?.over_all_status === "Pending"
        ).length,
      },
      {
        name: "Revision Required",
        value: accreditations.filter(
          (org) =>
            org.accreditation_status?.over_all_status === "Revision Required"
        ).length,
      },
    ];

    // Department breakdown (for Local orgs)
    const departmentMap = {};
    accreditations
      .filter((org) => org.org_class === "Local")
      .forEach((org) => {
        if (org.org_type.Departments && org.org_type.Departments.length > 0) {
          const dept = org.org_type.Departments[0].Department;
          departmentMap[dept] = (departmentMap[dept] || 0) + 1;
        }
      });

    const departmentData = Object.keys(departmentMap).map((dept) => ({
      name: dept,
      value: departmentMap[dept],
    }));

    // Specialization breakdown (for System-wide orgs)
    const specializationMap = {};
    accreditations
      .filter((org) => org.org_class === "System-wide")
      .forEach((org) => {
        if (
          org.org_type.Fields &&
          org.org_type.Fields.length > 0 &&
          org.org_type.Fields[0].specializations &&
          org.org_type.Fields[0].specializations.length > 0
        ) {
          const spec = org.org_type.Fields[0].specializations[0];
          specializationMap[spec] = (specializationMap[spec] || 0) + 1;
        }
      });

    const specializationData = Object.keys(specializationMap).map((spec) => ({
      name: spec,
      value: specializationMap[spec],
    }));

    return {
      classificationData,
      statusData,
      departmentData,
      specializationData,
    };
  };

  const { classificationData, statusData, departmentData, specializationData } =
    prepareChartData();

  return (
    <div className="h-full w-full border-12 overflow-y-auto">
      <div className="rounded-2xl flex flex-col gap-4">
        <div className="bg-white p-4 rounded-2xl flex flex-col items-center ">
          <h1 className="text-2xl font-bold text-center">
            Student Organization Accreditation Analytics
          </h1>
          <h1 className="text-lg font-bold text-center">
            Total Organizations:
            {"\t\t"}
            {accreditations.length} | Local: {classificationData[0].value} |
            System-wide: {classificationData[1].value}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Combined Classification and Status Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Classification Breakdown */}
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Organization Classification
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={classificationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {classificationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value) => (
                          <span className="text-xs">{value}</span>
                        )}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}`, "Organizations"]}
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Accreditation Status */}
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Accreditation Status
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              STATUS_COLORS[entry.name] ||
                              COLORS[index % COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value) => (
                          <span className="text-xs">{value}</span>
                        )}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}`, "Organizations"]}
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Department and Specialization Card */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex gap-8">
              {/* Department Breakdown */}
              <div className="flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Local Organizations by Department
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 40 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 12 }}
                        domain={[0, "dataMax"]}
                        allowDecimals={false}
                      />{" "}
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={80}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        name="Organizations"
                        radius={[0, 4, 4, 0]}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(217, 91%, ${60 - index * 10}%)`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Specialization Breakdown */}
              <div className="flex flex-col flex-1">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  System-wide Organizations by Specialization
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={specializationData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 40 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 12 }}
                        domain={[0, "dataMax"]}
                        allowDecimals={false}
                      />{" "}
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={80}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                        contentStyle={{
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#10b981"
                        name="Organizations"
                        radius={[0, 4, 4, 0]}
                      >
                        {specializationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(160, 84%, ${60 - index * 10}%)`}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border bg-white shadow-2xl border-gray-200">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Organization Name</th>
                <th className="px-6 py-3 text-left">Accreditation Type</th>
                <th className="px-6 py-3 text-left">Overall Status</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {accreditations.length > 0 ? (
                accreditations.map((acc) => (
                  <tr
                    key={acc._id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">{acc.org_name}</td>
                    <td className="px-6 py-4">
                      {acc.accreditation_status?.accreditation_type || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          acc.accreditation_status?.over_all_status ===
                          "Accredited"
                            ? "bg-green-100 text-green-700"
                            : acc.accreditation_status?.over_all_status ===
                              "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : acc.accreditation_status?.over_all_status ===
                              "Revision Required"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {acc.accreditation_status?.over_all_status || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
                        onClick={() => handleView(acc)}
                        title="View Accreditation"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center px-6 py-8 text-gray-400 italic"
                  >
                    No accreditation records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal/Popup for accreditation details */}
      {selectedAccreditation && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-3/4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Accreditation Details</h2>
              <button
                onClick={handleBack}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <ProcessAccreditationSection
              selectedAccreditation={selectedAccreditation}
              goBack={handleBack}
            />
          </div>
        </div>
      )}
    </div>
  );
}
