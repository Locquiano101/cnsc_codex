import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_ROUTER } from "../../../../App";
import {
  faAdd,
  faEye,
  faPencil,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import SearchableDropdown from "../../../../components/searchable_drop_down";

// ------------------- AddNewUser Modal -------------------
function AddNewUser({
  onClose,
  onSubmit,
  newUser,
  onChange,
  organizations,
  loadingOrganizations,
}) {
  const handleSubmit = () => {
    onSubmit(newUser); // Pass newUser when submitting
  };

  return (
    <div className="backdrop-blur-xs absolute inset-0 flex items-center justify-center bg-black/30">
      <div className="border p-12 w-2/3 h-auto bg-brian-blue text-white flex flex-col justify-center relative">
        <div className="flex justify-between w-full mb-12">
          <h2 className="text-lg font-semibold">Add User</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Username Field */}
          <label className="flex gap-4 justify-between">
            <span className="w-1/3">Username</span>
            <input
              name="username"
              value={newUser.username}
              onChange={onChange}
              placeholder="Username"
              className="border p-2 rounded flex-3/4 text-black w-full"
            />
          </label>

          {/* Position Field */}
          <label className="flex gap-4 justify-between items-center">
            <span className="w-1/3">Position</span>
            <select
              name="position"
              value={newUser.position}
              onChange={onChange}
              className="border p-2 rounded flex-3/4 text-black w-full"
            >
              <option value="">Select Position</option>
              <option value="student-leader">Student Leader</option>
              <option value="adviser">Adviser</option>
              <option value="dean">Dean</option>
              <option value="SDU">SDU</option>
              <option value="OSSD">OSSD</option>
            </select>
          </label>
          {/* Organization Field */}
          <label className="flex gap-4 justify-between items-center">
            <span className="w-1/3">Organization</span>
            <div className="flex-3/4 w-full">
              <SearchableDropdown
                options={organizations.map((org) => org.org_name)}
                value={
                  organizations.find((org) => org._id === newUser.organization)
                    ?.org_name || ""
                }
                onChange={(selectedOrgName) => {
                  const selected = organizations.find(
                    (org) => org.org_name === selectedOrgName
                  );
                  onChange({
                    target: {
                      name: "organization",
                      value: selected ? selected._id : "",
                    },
                  });
                }}
                placeholder={
                  loadingOrganizations
                    ? "Loading organizations..."
                    : "Select Organization"
                }
              />
            </div>
          </label>

          {/* Password Field */}
          <label className="flex gap-4 justify-between">
            <span className="w-1/3">Initial Password</span>
            <input
              name="password"
              value={newUser.password}
              onChange={onChange}
              placeholder="Password"
              type="text"
              className="border p-2 rounded flex-3/4 text-black w-full"
            />
          </label>

          <button
            onClick={handleSubmit}
            className="bg-[#28a745] hover:bg-[#218838] text-white p-2 rounded mt-4"
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------- UserTableView -------------------
function UserTableView({ onView, onEdit }) {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    position: "",
    organization: "",
    password: "password123", // Default password
  });

  useEffect(() => {
    fetchUsers();
    fetchOrganizations();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_ROUTER}/get-all-username-info/`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(`${API_ROUTER}/get-all-organization/`);
      setOrganizations(res.data);
    } catch (err) {
      console.error("Error fetching organizations:", err);
    } finally {
      setLoadingOrganizations(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (userToAdd) => {
    try {
      const { data } = await axios.post(
        `${API_ROUTER}/create-new-user`,
        userToAdd
      );
      console.log("Server response:", data);
      alert("User added successfully!");
      setShowAddModal(false);
      fetchUsers(); // Refresh user list after adding
      setNewUser({
        username: "",
        position: "",
        organization: "",
        password: "password123",
      }); // Reset newUser form
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user.");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aKey =
      sortConfig.key === "organization"
        ? a.organization?.org_name || ""
        : a[sortConfig.key] || "";
    const bKey =
      sortConfig.key === "organization"
        ? b.organization?.org_name || ""
        : b[sortConfig.key] || "";
    if (aKey < bKey) return sortConfig.direction === "asc" ? -1 : 1;
    if (aKey > bKey) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="ml-1" />
    ) : (
      <FontAwesomeIcon icon={faSortDown} className="ml-1" />
    );
  };

  if (loading) return <p className="p-4">Loading users…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div>
      {/* Header */}
      <div className="bg-[#1e4976] text-white p-3 flex justify-between items-center">
        <h1 className="font-medium">Users</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 bg-[#fd7e14] text-white px-3 py-1 rounded"
        >
          <FontAwesomeIcon icon={faAdd} />
          <span className="font-medium">Add User</span>
        </button>
      </div>

      {/* Table */}
      <div className="max-h-[500px] overflow-y-auto shadow-2xl">
        <table className="w-full bg-white border-collapse">
          <thead className="bg-gray-50 text-sm">
            <tr>
              <th className="text-start text-xs p-3 font-semibold text-gray-600 uppercase border-b">
                Username
              </th>
              <th
                onClick={() => handleSort("position")}
                className="cursor-pointer text-start text-xs p-3 font-semibold text-gray-600 uppercase border-b"
              >
                Position {getSortIcon("position")}
              </th>
              <th
                onClick={() => handleSort("organization")}
                className="cursor-pointer text-start text-xs p-3 font-semibold text-gray-600 uppercase border-b"
              >
                Organization {getSortIcon("organization")}
              </th>
              <th className="text-start text-xs p-3 font-semibold text-gray-600 uppercase border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedUsers.length > 0 ? (
              sortedUsers.map((u, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {u.username}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {u.position}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {u.organization?.org_name || "No organization"}
                  </td>
                  <td className="py-4 px-4 text-center text-sm font-medium">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(u)}
                        className="p-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full"
                        title="View"
                      >
                        <FontAwesomeIcon icon={faEye} size="sm" />
                      </button>
                      <button
                        onClick={() => onEdit(u)}
                        className="p-1.5 bg-[#28a745] hover:bg-[#218838] text-white rounded-full"
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faPencil} size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-10 text-center text-sm text-gray-500 italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showAddModal && (
        <AddNewUser
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
          newUser={newUser}
          onChange={handleInputChange}
          organizations={organizations}
          loadingOrganizations={loadingOrganizations}
        />
      )}
    </div>
  );
}

// ------------------- Main SDUAdminUserTableView -------------------
export default function SDUAdminUserTableView({ user }) {
  const [mode, setMode] = useState("list");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAdd = () => {
    setSelectedUser(null);
    setMode("add");
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setMode("view");
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setMode("edit");
  };

  const handleBack = () => {
    setSelectedUser(null);
    setMode("list");
  };

  switch (mode) {
    case "list":
      return (
        <div>
          <UserTableView onView={handleView} onEdit={handleEdit} />
        </div>
      );
    case "edit":
    case "add":
      return (
        <div className="p-4">Form to {mode} user here (to be implemented)</div>
      );
    case "view":
      return <div className="p-4">User details view (to be implemented)</div>;
    default:
      return <div className="p-4">Invalid mode</div>;
  }
}
