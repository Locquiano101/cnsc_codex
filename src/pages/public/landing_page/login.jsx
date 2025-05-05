import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faEye,
  faEyeSlash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FaBars, FaTimes } from "react-icons/fa";
import { handleLogin } from "../../../api/login_api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(username, password, navigate, setErrorMsg);
  };

  return (
    <div className="bg-[url('/general/cnscsch.png')] bg-cover bg-center min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full">
        <div className="flex justify-between items-center px-6 md:px-16 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              className="h-10 md:h-12 w-auto"
              src="/general/cnsc_codex_ver_2.png"
              alt="CNSC Codex Logo"
            />
            <span className="text-sm md:text-base text-white font-bold">
              CNSC CODEX
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-white text-sm md:text-base">
            <Link
              to="/newsfeed"
              className="relative group hover:text-cnsc-secondary-color"
            >
              Public Information Page
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cnsc-secondary-color scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
            </Link>
            <div className="h-5 w-0.5 bg-white" />
            <Link
              to="/organization"
              className="relative group hover:text-cnsc-secondary-color"
            >
              Organizations
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cnsc-secondary-color scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
            </Link>
            <div className="h-5 w-0.5 bg-white" />
            <Link
              to="/manuals"
              className="relative group hover:text-cnsc-secondary-color"
            >
              Manuals
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cnsc-secondary-color scale-x-0 group-hover:scale-x-100 transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col items-center bg-cnsc-blue-color backdrop-blur-md px-6 py-4 space-y-3 text-white text-sm">
            <Link
              to="/newsfeed"
              className="block hover:text-cnsc-secondary-color"
              onClick={() => setMenuOpen(false)}
            >
              Public Information Page
            </Link>
            <Link
              to="/organization"
              className="block hover:text-cnsc-secondary-color"
              onClick={() => setMenuOpen(false)}
            >
              Organizations
            </Link>
            <Link
              to="/manuals"
              className="block hover:text-cnsc-secondary-color"
              onClick={() => setMenuOpen(false)}
            >
              Manuals
            </Link>
          </div>
        )}
      </header>

      {/* Main Section */}
      <section className="flex-1 w-full flex flex-col lg:flex-row items-center justify-between gap-8 sm:px-25 px-8 ">
        <div className="hidden md:block py-60 w-0.5 bg-gray-400 float-start mb-75"></div>

        {/* CNSC CODEX Titles */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl">
          <h1
            className="text-cnsc-primary-color text-7xl md:text-9xl font-black"
            style={{
              textShadow:
                "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
            }}
          >
            CNSC
          </h1>
          <h1
            className="text-cnsc-secondary-color text-6xl md:text-9xl font-bold"
            style={{
              textShadow:
                "2px 2px 0 maroon, -2px -2px 0 maroon, 2px -2px 0 maroon, -2px 2px 0 maroon, 0 0 2px maroon",
            }}
          >
            CODEX
          </h1>

          <h1 className="text-sm md:text-base text-cnsc-white-color italic mt-4">
            Document Tracking and Data Management for Student Organizations
          </h1>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-[520px] bg-cnsc-white-color rounded-3xl p-15 py-20 flex flex-col justify-center items-center shadow-xl ">
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white text-black w-full px-6 py-3 text-base rounded-xl border border-gray-300"
                required
              />
              <div className="bg-white text-black w-full rounded-xl border border-gray-300 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white w-full px-6 py-3 rounded-xl outline-none text-base"
                  required
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm mt-3">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="bg-cnsc-primary-color mt-6 text-cnsc-white-color w-full px-6 py-3 text-lg rounded-xl border hover:bg-cnsc-secondary-color transition-colors duration-300"
            >
              Login
            </button>
          </form>

          <div className="flex items-center justify-center w-full text-sm mt-4">
            <hr className="flex-1 border-black" />
            <button className="px-3 text-cnsc-primary-color font-medium">
              <Link to="/register">Register</Link>
            </button>
            <hr className="flex-1 border-black" />
          </div>
        </div>

        <div className="hidden md:block py-60 w-0.5 bg-gray-400 float-start mt-75"></div>
      </section>
    </div>
  );
}
