import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faCheckToSlot,
  faFile,
  faGears,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import OverviewContent from "./overview";
import AccreditationList from "./accreditation";

export default function StudentDevelopmentUnitSection() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // If there's no token, redirect to login
    if (!token) {
      navigate("/login");
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
    }
  }, [navigate]);

  const [activeContent, setActiveContent] = useState("accreditation");

  const renderContent = () => {
    switch (activeContent) {
      case "home":
        return <OverviewContent />;
      case "documents":
        return <> this is documents content</>;
      case "accreditation":
        return <AccreditationList />;
      case "post":
        return <> this is posts content</>;
      case "settings":
        return <> this is settings content</>;
    }
  };

  const handleClick = (content) => {
    setActiveContent(content);
  };
  return (
    <div className="flex flex-col h-screen">
      <div className="h-auto flex gap-4 items-center px-8 py-4 text-white bg-cnsc-primary-color">
        <img src="/general/cnsc_codex_ver_2.png " className="h-20" alt="" />
        <h1 className=" text-2xl font-bold text-cnsc-white">
          Welcome Student Development Unit
        </h1>
      </div>
      <div className="flex h-full">
        <div className="w-1/4 bg-cnsc-white border-r-4 flex flex-col gap-4">
          <div className="flex flex-col gap-4 items-center p-6 text-black">
            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleClick("home")}
            >
              <FontAwesomeIcon icon={faHome} className="mr-4" />
              Overview
            </div>

            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleClick("accreditation")}
            >
              <FontAwesomeIcon icon={faCheckToSlot} className="mr-4" />
              Accredititation
            </div>
            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleClick("documents")}
            >
              <FontAwesomeIcon icon={faFile} className="mr-4" />
              Documents
            </div>
            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleClick("post")}
            >
              <FontAwesomeIcon icon={faAdd} className="mr-4" />
              Post
            </div>
            <div
              className="w-full text-2xl bg-white p-4 rounded-lg cursor-pointer"
              onClick={() => handleClick("settings")}
            >
              <FontAwesomeIcon icon={faGears} className="mr-4" />
              Settings
            </div>
          </div>
        </div>
        <div className="w-full p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
