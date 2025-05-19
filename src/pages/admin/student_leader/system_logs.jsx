import { useState, useEffect } from "react";
import {
  Clock,
  Filter,
  Search,
  ChevronDown,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { API_ROUTER } from "../../../App";
import axios from "axios";

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

export default function SystemLogsUI({ user }) {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orgFilter, setOrgFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [organizations, setOrganizations] = useState([]);
  const [actionTypes, setActionTypes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_ROUTER}/logs/${user.organization._id}`
      );

      // Directly set the logs from the response data
      const logData = response.data["System Logs"] || [];
      setLogs(logData);

      // Extract unique organizations for filters
      const orgs = [
        ...new Set(logData.map((log) => log.organization.org_name)),
      ];
      setOrganizations(orgs);

      // Extract action types for filters
      const actionWords = logData.map((log) => {
        const actionParts = log.action.split(" ");
        if (actionParts.length > 2) {
          return actionParts[actionParts.length - 2];
        }
        return "";
      });

      const filteredActions = actionWords.filter((a) => a !== "");
      const uniqueActions = [...new Set(filteredActions)];
      setActionTypes(uniqueActions);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLogs();
  }, [user.organization._id]);

  // Filtered and sorted logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.organization.org_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesOrg =
      orgFilter === "" || log.organization.org_name === orgFilter;

    const matchesAction =
      actionFilter === "" || log.action.includes(actionFilter);

    return matchesSearch && matchesOrg && matchesAction;
  });

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="w-full p-4">
        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
              <div className="flex-1 min-w-[260px]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border"
                    placeholder="Search logs by organization or action..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSortBy("newest")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      sortBy === "newest"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setSortBy("oldest")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      sortBy === "oldest"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    Oldest
                  </button>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Filter size={16} />
                  <span>Filters</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="mt-3 flex flex-wrap gap-4 pt-3 border-t border-gray-200">
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={orgFilter}
                    onChange={(e) => setOrgFilter(e.target.value)}
                  >
                    <option value="">All Organizations</option>
                    {organizations.map((org) => (
                      <option key={org} value={org}>
                        {org}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Type
                  </label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                  >
                    <option value="">All Actions</option>
                    {actionTypes.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logs List */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Activity Logs</h2>
            <p className="mt-1 text-sm text-gray-500">
              Displaying {sortedLogs.length} of {logs.length} logs
            </p>
          </div>

          {isLoading ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading logs...</p>
            </div>
          ) : sortedLogs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">
                No logs found matching your filters.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sortedLogs.map((log) => (
                <li key={log._id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="w-14 h-14 bg-indigo-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-lg">
                        {log.organization.org_acronym?.slice(0, 2) || "??"}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {log.organization.org_name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {log.organization.org_class}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">{log.action}</p>

                      <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 gap-x-4">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>Logged At: {formatDate(log.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    {/* 
                    <div className="flex flex-col gap-2">
                      <div className="text-xs font-medium text-gray-500">
                        Adviser: {log.organization.adviser_name}
                      </div>
                      <div className="text-xs font-medium text-gray-500">
                        President: {log.organization.org_president}
                      </div>
                    </div> */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
