import axios from "axios";
import { API_ROUTER } from "../App";
// Function to handle login (no hooks here)
export const handleLogin = async (
  username,
  password,
  navigate,
  setErrorMsg
) => {
  try {
    const response = await axios.post(`${API_ROUTER}/login`, {
      username,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    const role = user.position.toLowerCase();
    localStorage.setItem("position", role);

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "student-leader") {
      navigate("/admin/student-leader");
    } else if (role === "adviser") {
      navigate("/admin/adviser");
    } else if (role === "dean") {
      navigate("/admin/dean");
    } else if (role === "ossd coordinator") {
      navigate("/admin/OSSDCoordinator");
    } else if (role === "sdu") {
      navigate("/admin/student-development-unit");
    } else {
      navigate("/unauthorized");
    }
  } catch (err) {
    console.error("Login failed", err.response?.data || err.message);
    setErrorMsg("Invalid username or password", err.message);
  }
};

export const HandleLogout = (navigate) => {
  const confirmLogout = window.confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("position");
    navigate("/");
  }
};
