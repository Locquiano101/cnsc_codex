import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HandleLogout } from "../../../api/login_api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faFileAlt,
  faFolderOpen,
  faGears,
  faHome,
  faPenToSquare,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import StudentProposalTableView from "./documents/student_proposal_view";
import StudentAdminHomePage from "./student_admin_home_page";
import StudentAccomplishmentsTableView from "./documents/student_accomplishment_view";
import StudentPosting from "./posts/student_posts_view";

function PendingOrRevisionUI({ status, storedUser }) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Accreditation Status:&nbsp;
        <span className="text-red-600">{status}</span>
      </h2>
      <p className="text-gray-600 mb-4">
        Your organization's accreditation is currently {status.toLowerCase()}.
        Please wait for further updates or contact the administrator if you have
        questions.
      </p>
      <div className="bg-gray-100 p-6 rounded-md border">
        <h3 className="text-xl font-bold mb-2">Organization Details</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Organization Name:</strong>{" "}
            {storedUser.organization.org_name}
          </li>
          <li>
            <strong>Acronym:</strong> {storedUser.organization.org_acronym}
          </li>
          <li>
            <strong>President:</strong> {storedUser.organization.org_president}
          </li>
          <li>
            <strong>Adviser:</strong> {storedUser.organization.adviser_name}
          </li>
          <li>
            <strong>Adviser Email:</strong>{" "}
            {storedUser.organization.adviser_email}
          </li>
          <li>
            <strong>Department:</strong>{" "}
            {storedUser.organization.adviser_department}
          </li>
          <li>
            <strong>Org Email:</strong> {storedUser.organization.org_email}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function StudentLeaderPage() {
  const navigate = useNavigate();
  const [storedUser, setStoredUser] = useState(null);
  const [activeContent, setActiveContent] = useState("post");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.organization) {
      navigate("/");
      return;
    }
    setStoredUser(user);
  }, [navigate]);

  if (!storedUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading content...
      </div>
    );
  }

  const status = storedUser.organization.accreditation_overall;
  const validStatuses = ["Pending", "Revision Required"];

  const renderContent = () => {
    if (validStatuses.includes(status)) {
      return <PendingOrRevisionUI status={status} storedUser={storedUser} />;
    }

    switch (activeContent) {
      case "home":
        return <StudentAdminHomePage />;
      case "documents":
        return <StudentProposalTableView user={storedUser} />;
      case "accreditations":
        return <StudentAccomplishmentsTableView user={storedUser} />;
      case "post":
        return <StudentPosting user={storedUser} />;
      case "settings":
        return <div className="p-4">This is settings content</div>;
      default:
        return <div className="p-4">Invalid selection</div>;
    }
  };

  const handleClick = (key) => setActiveContent(key);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-2/10 bg-brian-blue flex flex-col">
        {/* Logo & Welcome side-by-side */}
        <div className="flex h-24 bg-brian-blue text-cnsc-white-color gap-2 px-2  items-center">
          <img
            src={`/${encodeURIComponent(
              storedUser.organization.org_name
            )}/Accreditation/Accreditation/photos/${encodeURIComponent(
              storedUser.organization.logo
            )}`}
            className="h-10 w-auto rounded-full"
            alt="Logo"
          />
          <div className="flex flex-col ">
            <h1 className="text-sm italic">Welcome,</h1>
            <h2 className=" text-lg font-bold">
              {storedUser.organization.org_name}
            </h2>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col  text-sm  text-white">
          {[
            { key: "home", icon: faHome, label: "Reports / Dashboard" },
            {
              key: "accreditations",
              icon: faFolderOpen,
              label: "Accomplishments",
            },
            { key: "documents", icon: faFileAlt, label: "Documents" },
            {
              key: "post",
              icon: faPenToSquare,
              label: "Post",
            },
            { key: "settings", icon: faGears, label: "Settings" },
          ].map(({ key, icon, label }) => (
            <div
              key={key}
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
          ))}
        </div>

        <button
          onClick={() => HandleLogout(navigate)}
          className="mt-auto mb-4 flex justify-center items-center py-3 cursor-pointer text-white hover:bg-red-50 transition"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>

      <div className="w-full flex-3/4">
        <div className="h-24 bg-brian-blue/50 "></div>
        {/* Content */}
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
}
