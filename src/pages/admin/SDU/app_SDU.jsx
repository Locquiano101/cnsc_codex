import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faFolderOpen,
  faUserGear,
  faHome,
  faRightFromBracket,
  faUsers,
  faGears,
  faBookOpen,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { HandleLogout } from "../../../api/login_api";
import AccreditationTableSection from "./accreditation/view";
import SDUAdminUserTableView from "./user_management_page/user_table_view";
import SandboxAccomplishment from "./accomplishments/accomplishment_main";
export default function StudentDevelopmentUnitPage() {
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState("accomplishments");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeContent) {
      case "home":
        return <>This is the overview</>;
      case "organizations":
        return <>This is the organizations section</>;
      case "accreditations":
        return <AccreditationTableSection />;
      case "accomplishments":
        return <SandboxAccomplishment />;
      case "documents":
        return <>This is documents content</>;
      case "users":
        return <SDUAdminUserTableView />;
      case "logs":
        return <>This is system logs</>;
      case "settings":
        return <>This is settings content</>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1B3A57] flex flex-col pt-6 text-white">
        {/* Logo + Admin Label */}
        <div className="flex items-center px-6 mb-6">
          <img
            src="/general/cnsc_codex_ver_2.png"
            alt="Logo"
            className="h-10 mr-3"
          />
          <h1 className="text-white font-bold text-md">SDU ADMIN</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-1 text-sm font-medium">
          {[
            { key: "home", icon: faHome, label: "Reports / Dashboard" },
            { key: "organizations", icon: faUsers, label: "Organizations" },
            { key: "users", icon: faUserGear, label: "User Management" },
            {
              key: "accomplishments",
              icon: faUserGear,
              label: "Organization Accomplishments",
            },
            {
              key: "accreditations",
              icon: faFolderOpen,
              label: "Accreditations",
            },
            { key: "logs", icon: faClockRotateLeft, label: "System Logs" },
          ].map(({ key, icon, label }) => (
            <div
              key={key}
              onClick={() => setActiveContent(key)}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition ${
                activeContent === key
                  ? "bg-[#DFE4EB] text-[#1B3A57] font-semibold"
                  : "hover:bg-[#2E4B6B] text-white"
              }`}
            >
              <FontAwesomeIcon icon={icon} />
              {label}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div
          onClick={() => HandleLogout(navigate)}
          className="mt-auto w-full flex justify-center items-center py-3 cursor-pointer text-white hover:bg-red-50 transition"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
          <span className="font-semibold">Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white p-4">
        {renderContent()}
      </main>
    </div>
  );
}
