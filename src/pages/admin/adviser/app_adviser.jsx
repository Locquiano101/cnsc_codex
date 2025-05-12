import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";
import { HandleLogout } from "../../../api/login_api";
import ProposalTableAdviserSection from "./documents/adviser_proposal_view";
import AdviserOverview from "./adviser_admin_home_page";
import AdviserAccomplishmentsTableView from "./documents/adviser_accomplishment_view";
import AdviserPosting from "./posts/adviser_post_view";
export default function AdviserAdminPage() {
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(null);
  const [activeContent, setActiveContent] = useState("post");
  const [showDocumentSubmenu, setShowDocumentSubmenu] = useState(false);
  const [activeDocumentSubContent, setActiveDocumentSubContent] =
    useState("proposals");

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
    if (activeContent === "documents" && activeDocumentSubContent) {
      switch (activeDocumentSubContent) {
        case "proposals":
          return <ProposalTableAdviserSection user={storedUser} />;

        case "events":
          return <>This is the events section</>;
        default:
          return <>Select a documents section above.</>;
      }
    }

    switch (activeContent) {
      case "home":
        return <AdviserOverview />;
      case "organizations":
        return <>This is the organizations section</>;
      case "accreditations":
        return <>This is the accreditations section</>;
      case "accomplishments":
        return <AdviserAccomplishmentsTableView user={storedUser} />;
      case "post":
        return <AdviserPosting user={storedUser} />;
      case "settings":
        return <>This is settings content</>;
      default:
        return null;
    }
  };

  const handleClick = (key) => {
    setActiveContent(key);
    if (key === "documents") {
      setShowDocumentSubmenu(true); // always show submenu when clicking documents
      setActiveDocumentSubContent("proposals"); // default subcontent
    } else {
      setShowDocumentSubmenu(false);
      setActiveDocumentSubContent(""); // clear subcontent when navigating away
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-1l2 bg-[#1B3A57] flex flex-col pt-6 text-white">
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
          {[
            { key: "home", label: "Reports / Dashboard", icon: faHome },
            { key: "organizations", label: "Organizations", icon: faUsers },
            { key: "post", label: "post", icon: faPencilAlt },
            { key: "documents", label: "Documents", icon: faFolderOpen },
            {
              key: "accomplishments",
              label: "Accomplishments",
              icon: faCheckCircle,
            },
            { key: "settings", label: "Settings", icon: faGears },
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

              {/* Submenu for Documents */}
              {key === "documents" && showDocumentSubmenu && (
                <div className="  flex flex-col ">
                  {["proposals", "events"].map((sub) => (
                    <div
                      key={sub}
                      onClick={() => setActiveDocumentSubContent(sub)}
                      className={`pl-16 cursor-pointer px-3 py-2 text-sm  transition ${
                        activeDocumentSubContent === sub
                          ? "bg-[#DFE4EB] text-[#1B3A57] font-semibold"
                          : "hover:bg-[#2E4B6B] text-white"
                      }`}
                    >
                      <FontAwesomeIcon icon={faFileAlt} className="mr-4" />
                      {sub.charAt(0).toUpperCase() + sub.slice(1)}
                    </div>
                  ))}
                </div>
              )}
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
      <main className="flex-1 overflow-y-auto bg-gray-50 ">
        <div className="h-24 bg-brian-blue/50" />
        <div className="p-4 border h-full">{renderContent()}</div>
      </main>
    </div>
  );
}
