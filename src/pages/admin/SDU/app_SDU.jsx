import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserGear,
  faUsers,
  faClockRotateLeft,
  faGlobe,
  faRightFromBracket,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { HandleLogout } from "../../../api/login_api";
import AccreditationTableSection from "./accreditation/view";
import SDUAdminUserTableView from "./user_management_page/user_table_view";
import SandboxAccomplishment from "./accomplishments/accomplishment_main";
import OrganizationViewSDU from "./organization/organization_main";
import { FolderOpen, Star, Users, FileText, Award } from "lucide-react";
import SDUAccomplishmentMain from "./accomplishments/accomplishment_main";
import AddStudentAccomplishmentReport from "../student_leader/documents/student_accomplishment_add";
import SDUSystemAccomplishmentTableApproval from "./system_wide_document/accomplishments/view";
import SduAdminProposalApproval from "./system_wide_document/proposals/view";

export default function StudentDevelopmentUnitPage() {
  const navigate = useNavigate();
  const [activeContent, setActiveContent] = useState("accomplishments");
  const [showOrgSubmenu, setShowOrgSubmenu] = useState(true);
  const [showSystemWideSubmenu, setShowSystemWideSubmenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleNavClick = (content) => {
    setActiveContent(content);
    if (
      content !== "organizations" &&
      content !== "accreditations" &&
      content !== "accomplishments" &&
      content !== "systemProposal" &&
      content !== "systemAccomplishment"
    ) {
      setShowOrgSubmenu(false);
      setShowSystemWideSubmenu(false);
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case "home":
        return <>This is the overview</>;
      case "organizations":
        return <OrganizationViewSDU />;
      case "accreditations":
        return <AccreditationTableSection />;
      case "accomplishments":
        return <SandboxAccomplishment />;
      case "systemProposal":
        return <SduAdminProposalApproval />;
      case "systemAccomplishment":
        return <SDUSystemAccomplishmentTableApproval />;
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
      <aside className="w-64 bg-[#222222] flex flex-col pt-6 text-white ">
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
          {/* Reports / Dashboard */}
          <div
            onClick={() => handleNavClick("home")}
            className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition ${
              activeContent === "home"
                ? "bg-cnsc-primary-color text-cnsc-white-color font-semibold"
                : "hover:bg-gray-500 text-white"
            }`}
          >
            <FontAwesomeIcon icon={faHome} />
            Reports / Dashboard
          </div>

          {/* Organizations Group Toggle */}
          <div
            onClick={() => setShowOrgSubmenu((prev) => !prev)}
            className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-500 text-white transition"
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUsers} />
              Organizations
            </div>
            <FontAwesomeIcon
              icon={showOrgSubmenu ? faChevronUp : faChevronDown}
            />
          </div>

          {/* Organization Submenu */}
          {showOrgSubmenu && (
            <div className="flex flex-col">
              <div
                onClick={() => handleNavClick("organizations")}
                className={`px-4 py-2 flex pl-12 cursor-pointer transition ${
                  activeContent === "organizations"
                    ? "bg-cnsc-primary-color text-cnsc-white-color font-semibold"
                    : "hover:bg-gray-500 text-white"
                }`}
              >
                <Users size={16} className="mr-4" />
                Management
              </div>
              <div
                onClick={() => handleNavClick("accreditations")}
                className={`px-4 py-2 flex pl-12 cursor-pointer transition ${
                  activeContent === "accreditations"
                    ? "bg-cnsc-primary-color text-cnsc-white font-semibold"
                    : "hover:bg-gray-500 text-white"
                }`}
              >
                <FolderOpen size={16} className="mr-4" />
                Accreditations
              </div>
              <div
                onClick={() => handleNavClick("accomplishments")}
                className={`px-4 py-2 flex pl-12 cursor-pointer transition ${
                  activeContent === "accomplishments"
                    ? "bg-cnsc-primary-color text-white font-semibold"
                    : "hover:bg-gray-500 text-white"
                }`}
              >
                <Star size={16} className="mr-4" />
                Accomplishments
              </div>
            </div>
          )}

          {/* System Wide Group Toggle */}
          <div
            onClick={() => setShowSystemWideSubmenu((prev) => !prev)}
            className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-500 text-white transition"
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faGlobe} />
              System Wide Organization
            </div>
            <FontAwesomeIcon
              icon={showSystemWideSubmenu ? faChevronUp : faChevronDown}
            />
          </div>

          {/* System Wide Submenu */}
          {showSystemWideSubmenu && (
            <div className="flex flex-col">
              <div
                onClick={() => handleNavClick("systemProposal")}
                className={`px-4 py-2 flex pl-12 cursor-pointer transition ${
                  activeContent === "systemProposal"
                    ? "bg-cnsc-primary-color text-white font-semibold"
                    : "hover:bg-gray-500 text-white"
                }`}
              >
                <FileText size={16} className="mr-4" />
                Event Proposals
              </div>
              <div
                onClick={() => handleNavClick("systemAccomplishment")}
                className={`px-4 py-2 flex pl-12 cursor-pointer transition ${
                  activeContent === "systemAccomplishment"
                    ? "bg-cnsc-primary-color text-white font-semibold"
                    : "hover:bg-gray-500 text-white"
                }`}
              >
                <Award size={16} className="mr-4" />
                Accomplishment Reports
              </div>
            </div>
          )}

          {/* Other nav items */}
          <div
            onClick={() => handleNavClick("users")}
            className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition ${
              activeContent === "users"
                ? "bg-cnsc-primary-color text-white font-semibold"
                : "hover:bg-gray-500 text-white"
            }`}
          >
            <FontAwesomeIcon icon={faUserGear} />
            User Management
          </div>

          <div
            onClick={() => handleNavClick("logs")}
            className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition ${
              activeContent === "logs"
                ? "bg-cnsc-primary-color text-white font-semibold"
                : "hover:bg-gray-500 text-white"
            }`}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} />
            System Logs
          </div>
        </nav>

        {/* Logout */}
        <div
          onClick={() => HandleLogout(navigate)}
          className="mt-auto w-full flex justify-center items-center py-3 cursor-pointer text-white hover:bg-gray-500"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
          <span className="font-semibold">Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-300 p-4">{renderContent()}</main>
    </div>
  );
}
