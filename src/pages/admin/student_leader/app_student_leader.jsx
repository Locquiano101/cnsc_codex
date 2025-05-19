import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HandleLogout } from "../../../api/login_api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faComment,
  faCommentAlt,
  faFile,
  faFileAlt,
  faFolderOpen,
  faGears,
  faHome,
  faIcons,
  faPenToSquare,
  faPerson,
  faPersonArrowUpFromLine,
  faPersonRifle,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import StudentProposalTableView from "./documents/student_proposal_view";
import StudentAdminHomePage from "./student_admin_home_page";
import StudentAccomplishmentsTableView from "./documents/student_accomplishment_view";
import StudentPosting from "./posts/student_posts_view";
import StudentFiles from "./file_manager/file_view";
import StudentDevelopmentUnitPage from "../SDU/app_SDU";
import StudentAccreditationView from "./documents/student_accreditation_edit";

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
  const [activeContent, setActiveContent] = useState("proposals");
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

  const status = storedUser.organization.accreditation_status.over_all_status;

  const validStatuses = ["Pending", "Revision Required"];

  const renderContent = () => {
    if (validStatuses.includes(status)) {
      if (activeContent === "accreditations") {
        return <StudentAccreditationView userData={storedUser} />;
      }
      return <PendingOrRevisionUI status={status} storedUser={storedUser} />;
    }

    switch (activeContent) {
      case "home":
        return <StudentAdminHomePage />;
      case "proposals":
        return <StudentProposalTableView user={storedUser} />;
      case "accreditations":
        return <StudentAccomplishmentsTableView user={storedUser} />;
      case "documents":
        return <StudentFiles user={storedUser} />;
      case "accreditations":
        return <StudentAccomplishmentsTableView user={storedUser} />;
      case "post":
        return <StudentPosting user={storedUser} />;
      default:
        return <div className="p-4">Invalid selection</div>;
    }
  };

  const handleClick = (key) => setActiveContent(key);

  return (
    <div className="flex h-screen  overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#1E1E1E] flex flex-col">
        {/* Logo & Welcome side-by-side */}
        <Link
          to={`/organization/profile/${storedUser.organization.org_name}`}
          className="flex h-24 bg-[#1E1E1E] text-cnsc-white-color gap-2 px-5 items-center"
        >
          <img
            src={`/${encodeURIComponent(
              storedUser.organization.org_name
            )}/Accreditation/Accreditation/photos/${encodeURIComponent(
              storedUser.organization.logo
            )}`}
            className="h-10 w-auto rounded-full aspect-square"
            alt="Logo"
          />
          <div className="flex flex-col ">
            <h2 className=" text-lg font-bold">
              {storedUser.organization.org_name}
            </h2>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex flex-col w-1.45 text-white">
          {[
            { key: "home", icon: faHome, label: "Reports / Dashboard" },
            { key: "accreditations", icon: faFile, label: "Accomplishments" },
            { key: "proposals", icon: faFileAlt, label: "Proposals" },
            { key: "documents", icon: faFolderOpen, label: "Documents" },
            { key: "post", icon: faPenToSquare, label: "Post" },
            { key: "settings", icon: faGears, label: "Settings" },
          ].map(({ key, icon, label }) => (
            <div
              key={key}
              onClick={() => handleClick(key)}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition ${
                activeContent === key
                  ? "bg-cnsc-primary-color  font-semibold"
                  : "hover:bg-gray-500 text-white"
              }`}
            >
              <FontAwesomeIcon icon={icon} className="flex-1" />
              <p className="flex-3/4">{label}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => HandleLogout(navigate)}
          className="mt-auto mb-4 flex justify-center items-center py-3 cursor-pointer text-white hover:bg-gray-500 transition"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>

      <div className="w-full flex flex-col flex-3/4">
        <div className="h-24 bg-cnsc-black-color flex items-center justify-end"></div>
        <div className=" bg-brian-blue/10 flex flex-col overflow-hidden ">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
