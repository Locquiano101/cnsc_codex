import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleLogin } from "../../../api/login_api";

export default function LoginSection() {
  const [relativePaths, setRelativePaths] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Retrieve photos from localStorage on mount
  useEffect(() => {
    const photosString = localStorage.getItem("photos");
    if (photosString) {
      try {
        const parsedPhotos = JSON.parse(photosString);
        setRelativePaths(parsedPhotos);
        console.log("Loaded photos:", parsedPhotos);
      } catch (error) {
        console.error("Error parsing photos from localStorage:", error);
      }
    }
  }, []);

  // Cycle through slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % relativePaths.length);
    }, 500); // Change slide every 10 seconds
    return () => clearInterval(timer);
  }, [relativePaths.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await handleLogin(username, password, (user) => {
        // Log the organization information instead of position for clarity
        console.log("User's organization:", user.organization);

        // Extract role from user's position
        const role = user.position.toLowerCase();
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "student-leader") {
          navigate("/admin/student-leader");
        } else if (role === "adviser") {
          navigate("/admin/adviser");
        } else if (role === "sdu") {
          navigate("/admin/student-development-unit");
        } else {
          // Default or unknown role
          navigate("/unauthorized");
        }
      });
    } catch (err) {
      setErrorMsg("Invalid username or password");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="relative flex h-screen bg-gray-100 overflow-hidden">
        {relativePaths.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
              activeIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background blurred image */}
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-screen h-screen object-cover blur-2xl"
            />
            {/* Foreground image */}
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="absolute w-auto h-screen"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 w-full h-full bg-black/25 flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-cnsc-primary-color w-1/2 h-2/3 gap-4 px-12 rounded-3xl flex flex-col items-center justify-center shadow-2xl"
        >
          <img
            src="/general/cnsc_codex_ver_2.png"
            alt=""
            className="h-32 w-32"
          />
          <h1 className="text-4xl font-bold text-white mt-4">
            Welcome to CNSC CODEX
          </h1>
          {errorMsg && (
            <p className="text-xl  font-bold text-red-400">{errorMsg}</p>
          )}{" "}
          <div className="w-full">
            <label className="text-white">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white mt-2 text-gray-800 w-full px-4 py-2  "
            />
          </div>
          <div className="w-full">
            <label className="text-white">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white mt-2 text-gray-800 w-full px-4 py-2  "
            />
          </div>
          <button
            type="submit"
            className="bg-cnsc-secondary-color w-full rounded py-2 mt-4 px-4 "
          >
            Login
          </button>
          <p>
            <span className="text-white mt-4 mr-2">Don't have an account?</span>
            <span>
              <Link
                to={"/register"}
                className="text-white mt-4 font-bold underline-animate"
              >
                Register Here.
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
