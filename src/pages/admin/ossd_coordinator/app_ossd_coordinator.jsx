import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  faHome,
  faUsers,
  faPencilAlt,
  faFolderOpen,
  faGears,
  faFileAlt,
  faRightFromBracket,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_ROUTER } from "../../../App";
import DeanOverview from "./ossd_home_page";
import DeanOrganizationBoard from "./ossd_organization";
import ProposalSectionDean from "./documents/ossd_proposal_view";

export default function OSSDCoordinatorPage() {
  const [storedUser, setStoredUser] = useState(null);
  const [activeContent, setActiveContent] = useState("proposals");
  const [organizations, setOrganizations] = useState([]);
  const [showDocumentSubmenu, setShowDocumentSubmenu] = useState(false);
  const [activeDocumentSubContent, setActiveDocumentSubContent] =
    useState("proposals");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    setStoredUser(user);
  }, [navigate]);

  useEffect(() => {
    const fetchOrganizationsByDepartment = async () => {
      if (!storedUser) return;
      const department = storedUser.delivery_unit;
      try {
        const response = await axios.post(`${API_ROUTER}/get-by-organization`, {
          department,
        });
        console.log(response.data);
        setOrganizations(response.data);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };
    fetchOrganizationsByDepartment();
  }, [storedUser]);

  const handleClick = (key) => {
    setActiveContent(key);
    if (key === "documents") {
      setShowDocumentSubmenu((prev) => !prev);
    } else {
      setShowDocumentSubmenu(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (storedUser === null) {
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );
  }

  const renderContent = () => {
    switch (activeContent) {
      case "home":
        return <DeanOverview organizations={organizations} />;
      case "organizations":
        return <DeanOrganizationBoard organizations={organizations} />;
      case "post":
        return <div className="p-4">Post content</div>;
      case "proposals":
        return <ProposalSectionDean organization={organizations} />;
      case "settings":
        return <div className="p-4">Settings content</div>;
      default:
        return <div className="p-4">Invalid selection</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-1/3 max-w-xs bg-[#1B3A57] flex flex-col pt-6 text-white">
        <div className="flex items-center px-6 mb-6">
          <img
            src="/general/cnsc_codex_ver_2.png"
            className="h-12 mr-3"
            alt="logo"
          />
          <h1 className="text-white font-bold text-md">
            Welcome {storedUser.delivery_unit} OSSD Coordinator
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-1 text-sm font-medium">
          {[
            { key: "home", label: "Reports / Dashboard", icon: faHome },
            { key: "organizations", label: "Organizations", icon: faUsers },
            { key: "proposals", label: "Proposals", icon: faFileAlt },
          ].map(({ key, label, icon }) => (
            <div key={key}>
              <div
                onClick={() => handleClick(key)}
                className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition ${
                  activeContent === key
                    ? "bg-[#DFE4EB] text-[#1B3A57] font-semibold"
                    : "hover:bg-[#2E4B6B] text-white"
                }`}
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </div>
            </div>
          ))}
        </nav>
        <hr className="mx-4 my-2" />
        <div key="logs" className="text-sm font-medium">
          <div
            onClick={() => handleClick("logs")}
            className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition ${
              activeContent === "logs"
                ? "bg-[#DFE4EB] text-[#1B3A57] font-semibold"
                : "hover:bg-[#2E4B6B] text-white"
            }`}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
            Logs
          </div>
        </div>
        {/* Logout */}
        <div
          onClick={handleLogout}
          className="mt-auto w-full flex justify-center items-center py-3 cursor-pointer text-white hover:bg-[#2E4B6B] transition"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
          <span className="font-semibold">Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
