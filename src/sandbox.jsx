import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faEye,
  faEyeSlash,
  faMagnifyingGlass,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

export default function Sandbox() {
  // Local state for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[url('/general/cnscsch.png')] bg-cover bg-center h-screen flex flex-col">
      <div id="parent" className="flex flex-col h-full">
        <header className="w-full h-[3rem] flex justify-between px-[5rem]">
          <div className="h-full w-fit flex items-center justify-between space-x-1.5">
            <img
              className="h-[3rem] w-auto"
              src="/general/cnsc_codex.png"
              alt="CNSC Codex Logo"
            />
            <span className="text-sm text-white font-bold font-sans">
              CNSC CODEX
            </span>
          </div>
          <div className="flex justify-end h-full gap-2 py-2">
            <div className="h-full min-w-[9rem] bg-cnsc-secondary-color flex py-0">
              <div className="min-w-[4rem] h-full flex">
                <input
                  placeholder="Search"
                  type="text"
                  className="h-full w-[6rem] pl-6 bg-white text-black outline-none"
                />
              </div>
              <div className="w-[3rem] h-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-xl text-cnsc-white-color"
                />
              </div>
            </div>
            <div className="h-full min-w-[9rem] bg-cnsc-secondary-color flex py-0">
              <div className="min-w-[4rem] h-full flex">
                <button className="flex items-center justify-center h-full w-[6rem] bg-white text-black outline-none">
                  Manuals
                </button>
                <div className="w-[3rem] h-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faClipboard}
                    className="text-xl text-cnsc-white-color"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="w-screen h-full flex items-center justify-end px-20 pl-25 pr-24">
          <div className="h-full w-5 flex justify-center items-start pt-5 pb-5">
            <div className="bg-cnsc-white-color h-2/3 w-0.5"></div>
          </div>
          <div className="w-2/3 h-[17rem] rounded-2xl text-8xl pl-22 ">
            <h1
              className="text-cnsc-primary-color font-bold"
              style={{
                textShadow:
                  "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
              }}
            >
              CNSC
            </h1>
            <h1
              className="text-cnsc-secondary-color font-bold"
              style={{
                textShadow:
                  "1px 1px 0 maroon, -1px -1px 0 maroon, 1px -1px 0 maroon, -1px 1px 0 maroon",
              }}
            >
              CODEX
            </h1>
            <h1 className="text-xs text-cnsc-white-color italic">
              Document Tracking and
            </h1>
            <h1 className="text-xs text-cnsc-white-color italic">
              Data Management for Student Organizations
            </h1>
          </div>

          <div className="w-[40%] h-[19rem] rounded-2xl bg-cnsc-white-color p-4 flex items-center justify-center flex-col px-10 mr-15">
            <input
              type="text"
              placeholder="Username"
              className="bg-white text-black-800 w-full px-4 py-2 rounded-lg border-1"
            />
            <div className="bg-white mt-2 text-black-800 w-full rounded-lg border-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`bg-white w-full px-4 py-2 rounded-lg outline-none ${
                  showPassword ? "text-base" : "text-sm"
                }`}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
            </div>

            <button className="bg-cnsc-primary-color mt-2 text-cnsc-white-color w-full px-4 py-2 rounded-lg border-1">
              Login
            </button>
            <div className="w-full h-10 flex justify-center text-xs items-center">
              <hr className="flex-1" />
              <button className="px-2">Register</button>
              <hr className="flex-1" />
              <hr />
            </div>
          </div>
          <div className="h-full w-5 flex justify-center items-end pt-5 pb-5">
            <div className="bg-cnsc-white-color h-2/3 w-0.5"></div>
          </div>
        </section>
      </div>
    </div>
  );
}
