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
    <div className="bg-[url('/general/cnscsch.png')] bg-cover bg-center min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-4">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
          <img
            className="h-10 md:h-12 w-auto"
            src={"/general/cnsc_codex_ver_2.png"}
            alt="CNSC Codex Logo"
          />
          <span className="text-sm md:text-base text-white font-bold">
            CNSC CODEX
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-4 items-center text-white text-sm md:text-base">
          <Link to={`newsfeed`} className="underline-animate py-2">
            Public Information Page
          </Link>
          <div className="h-5 w-0.5 bg-white" />
          <Link to={`organization`} className="underline-animate py-2">
            Organizations
          </Link>
          <div className="h-5 w-0.5 bg-white" />
          <h1 className="underline-animate py-2">Manuals</h1>
        </div>
      </header>

      {/* Main Section */}
      <section className="flex-1 w-full flex flex-col lg:flex-row items-center justify-evenly gap-8 p-4 md:p-8">
        {/* Left vertical line */}
        <div className="flex h-full justify-center items-center">
          <div className="bg-cnsc-white-color h-2/3 w-1" />
        </div>

        {/* CNSC CODEX Titles */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-sm">
          <h1
            className="text-cnsc-primary-color text-6xl md:text-8xl font-black"
            style={{
              textShadow:
                "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
            }}
          >
            CNSC
          </h1>
          <h1
            className="text-cnsc-secondary-color text-5xl md:text-7xl font-bold"
            style={{
              textShadow:
                "1px 1px 0 maroon, -1px -1px 0 maroon, 1px -1px 0 maroon, -1px 1px 0 maroon",
            }}
          >
            CODEX
          </h1>
          <h1 className="text-xs md:text-sm text-cnsc-white-color italic mt-2">
            Document Tracking and Data Management for Student Organizations
          </h1>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-[420px] bg-cnsc-white-color rounded-2xl p-6 py-10 flex flex-col justify-center items-center">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white text-black w-full px-4 py-2 rounded-lg border"
                required
              />
              <div className="bg-white text-black w-full rounded-lg border relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white w-full px-4 py-2 rounded-lg outline-none text-sm"
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
              className="bg-cnsc-primary-color mt-4 text-cnsc-white-color w-full px-4 py-2 rounded-lg border hover:bg-cnsc-secondary-color transition-colors duration-300"
            >
              Login
            </button>
          </form>

          <div className="flex items-center justify-center w-full text-xs mt-4">
            <hr className="flex-1 border-gray-300" />
            <button className="px-2 text-cnsc-primary-color">
              <Link to="/register">Register</Link>
            </button>
            <hr className="flex-1 border-gray-300" />
          </div>
        </div>

        {/* Right vertical line */}
        <div className="flex h-full justify-center items-center">
          <div className="bg-cnsc-white-color h-2/3 w-1" />
        </div>
      </section>
    </div>
  );
}
