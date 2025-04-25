import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faEye,
  faEyeSlash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { handleLogin } from "../../../api/login_api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(username, password, navigate, setErrorMsg);
  };

  return (
    <div className="bg-[url('/general/cnscsch.png')] bg-cover bg-center h-screen flex flex-col">
      <header className="w-full h-20 flex justify-between px-16 ">
        <div className="h-full w-fit flex items-center space-x-1.5">
          <img
            className="h-[3rem] w-auto"
            src={"/general/cnsc_codex_ver_2.png"}
            alt="CNSC Codex Logo"
          />
          <span className="text-sm text-white font-bold">CNSC CODEX</span>
        </div>
        <div className="flex gap-3 h-full py-4 mr-27 mt-20 items-center  my-auto text-white ">
          <Link to={`newsfeed`} className="underline-animate py-2">
            Public Information Page
          </Link>
          <div className="h-6 w-0.5 bg-white" />
          <Link to={`organization`} className="underline-animate py-2">
            Organizations
          </Link>
          <div className="h-6 w-0.5 bg-white" />
          <h1 className="underline-animate py-2">Manuals</h1>
        </div>
      </header>

      <section className="w-full  h-full flex items-center justify-evenly gap-12 ">
        {/* Left side content (optional for layout) */}
        <div className="h-full w-1/10 flex justify-center">
          <div className="bg-cnsc-white-color h-2/3 w-1"></div>
        </div>

        <div className="flex flex-1/4 flex-col items-start w-fit text-9xl  ">
          <h1
            className="text-cnsc-primary-color font-black font-outline-3"
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
          <h1 className="text-sm text-cnsc-white-color italic">
            Document Tracking and Data Management for Student Organizations
          </h1>
        </div>

        {/* Main Section - Login Form */}
        <div className="w-[420px] h-auto   rounded-2xl bg-cnsc-white-color p-6 py-12 flex flex-col justify-between items-center ">
          <form className="w-full" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white text-black-800 w-full px-4 py-2 rounded-lg border"
                required
              />
              <div className="bg-white mt-2 text-black-800 w-full rounded-lg border relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`bg-white w-full px-4 py-2 rounded-lg outline-none ${
                    showPassword ? "text-base" : "text-sm"
                  }`}
                  required
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-xs mt-2">{errorMsg}</p>
            )}
            <button
              type="submit"
              className="bg-cnsc-primary-color mt-2 text-cnsc-white-color w-full px-4 py-2 rounded-lg border"
            >
              Login
            </button>
          </form>
          <div className="w-full h-10 flex justify-center items-center text-xs mt-2">
            <hr className="flex-1" />
            <button className="px-2">
              <Link to="/register">Register</Link>
            </button>
            <hr className="flex-1" />
          </div>
        </div>

        {/* Right side content (optional for layout) */}
        <div className="h-full w-1/10 flex justify-center items-end">
          {" "}
          <div className="bg-cnsc-white-color h-2/3 w-1"></div>
        </div>
      </section>
    </div>
  );
}
