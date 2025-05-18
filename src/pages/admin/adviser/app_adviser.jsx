import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faFileAlt,
  faCheckCircle,
  faGears,
  faRightFromBracket,
  faFolder,
  faFolderOpen,
  faGroupArrowsRotate,
  faUserGroup,
  faPencilSquare,
  faSquarePen,
  faPersonCircleQuestion,
  faPencilAlt,
  faPenAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { HandleLogout } from "../../../api/login_api";
import ProposalTableAdviserSection from "./documents/adviser_proposal_view";
import AdviserOverview from "./adviser_admin_home_page";
import AdviserAccomplishmentsTableView from "./documents/adviser_accomplishment_view";
import AdviserPosting from "./posts/adviser_post_view";

export default function AdviserAdminPage() {
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(null);
  const [activeContent, setActiveContent] = useState("accomplishments");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    setStoredUser(user);
  }, [navigate]);

  if (storedUser === null) {
    return (
      <div className="flex items-center justify-center h-screen">Loading…</div>
    );
  }

  const renderContent = () => {
    switch (activeContent) {
      case "home":
        return <AdviserOverview />;
      case "post":
        return <AdviserPosting user={storedUser} />;
      case "proposals":
        return <ProposalTableAdviserSection user={storedUser} />;
      case "events":
        return <>This is the events section</>;
      case "accomplishments":
        return <AdviserAccomplishmentsTableView user={storedUser} />;
      case "settings":
        return <>This is settings content</>;
      default:
        return null;
    }
  };

  const navItems = [
    { key: "home", label: "Reports / Dashboard", icon: faHome },
    { key: "post", label: "Post", icon: faPenAlt },
    { key: "proposals", label: "Proposals", icon: faFileAlt },
    { key: "accomplishments", label: "Accomplishments", icon: faCheckCircle },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1B3A57] flex flex-col pt-6 text-white shrink-0">
        <div className="flex items-center px-6 mb-6">
          <img
            src="/general/cnsc_codex_ver_2.png"
            className="h-12 mr-3"
            alt="logo"
          />
          <h1 className="text-white font-bold text-md">
            Welcome, Adviser {storedUser.organization.adviser_name}
          </h1>
        </div>
        {/* Navigation Items */}
        <nav className="flex flex-col space-y-1 text-sm font-medium">
          {navItems.map(({ key, label, icon }) => (
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
          className="mt-auto w-full flex justify-center items-center py-3 cursor-pointer text-white hover:bg-[#2E4B6B] transition"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
          <span className="font-semibold">Logout</span>
        </div>
      </aside>

      {/* Main Content */}

      <div className="w-full flex flex-col flex-3/4">
        <div className="h-24 bg-brian-blue/50 flex items-center justify-end">
          <div className="shadow-lg shadow-black mr-4 m-4 rounded-xl bg-gray-200 p-4">
            <Link
              to={`/organization/profile/${storedUser.organization.org_name}`}
              className="text-md"
            >
              <span className="mr-4">
                <FontAwesomeIcon icon={faUser} />
              </span>
              Go to Public Profile
            </Link>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className=" h-full">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
